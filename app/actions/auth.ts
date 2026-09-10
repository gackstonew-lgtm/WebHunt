"use server";

import prisma from "@/lib/db";
import { 
  hashPassword, 
  verifyPassword, 
  validatePasswordStrength, 
  generateSecureToken,
  generateSecureOtp,
  hashOtp,
  verifyOtp
} from "@/lib/auth/password";
import { 
  setSessionCookie, 
  clearSessionCookie, 
  getCurrentSession,
  isAdminSession
} from "@/lib/auth/session";
import { 
  sendVerificationOtpEmail,
  sendVerificationEmail, 
  sendPasswordResetEmail 
} from "@/lib/email/service";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { revalidatePath } from "next/cache";

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // In CLI test scripts outside request context, static generation store is not active
  }
}

/**
 * Register a new user account and dispatch a 6-digit Resend OTP
 */
export async function registerAction(formData: {
  name?: string;
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  requireOtp?: boolean;
  requireVerification?: boolean;
  email?: string;
}> {
  try {
    const rawEmail = formData.email || "";
    const email = rawEmail.toLowerCase().trim();
    const name = (formData.name || "").trim();
    const password = formData.password || "";

    if (!email || !EMAIL_REGEX.test(email)) {
      return { success: false, error: "Please provide a valid email address." };
    }

    const regLimit = checkRateLimit(`register_${email}`, 5, 60);
    if (!regLimit.allowed) {
      return {
        success: false,
        error: `Too many registration attempts. Please wait ${regLimit.retryAfterSeconds} second(s).`,
      };
    }

    const strengthCheck = validatePasswordStrength(password);
    if (!strengthCheck.isValid) {
      return { success: false, error: strengthCheck.message || "Password does not meet security requirements." };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    const otp = generateSecureOtp(6);
    const otpHash = hashOtp(otp);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const verificationToken = generateSecureToken(32);
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    if (existingUser) {
      if (existingUser.emailVerified) {
        return {
          success: false,
          error: "An account with this email address already exists. Please sign in.",
        };
      } else {
        // Unverified account: rotate OTP and update password
        const newPasswordHash = await hashPassword(password);

        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: name || existingUser.name,
            passwordHash: newPasswordHash,
            verificationOtpHash: otpHash,
            verificationOtpExpiry: otpExpiry,
            verificationOtpAttempts: 0,
            verificationOtpSentAt: new Date(),
            verificationToken,
            verificationTokenExpiry,
          },
        });

        const emailResult = await sendVerificationOtpEmail(email, name || existingUser.name || "WebHunt User", otp);

        if (!emailResult.success && !emailResult.isSimulated) {
          return {
            success: false,
            error: "We couldn't send the verification code right now. Please try again.",
          };
        }

        return {
          success: true,
          requireOtp: true,
          requireVerification: true,
          email,
          message: "Verification code sent to your email. Please enter the 6-digit code.",
        };
      }
    }

    // New user registration
    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        role: "user",
        status: "active",
        emailVerified: null,
        verificationOtpHash: otpHash,
        verificationOtpExpiry: otpExpiry,
        verificationOtpAttempts: 0,
        verificationOtpSentAt: new Date(),
        verificationToken,
        verificationTokenExpiry,
        profile: {
          create: {
            fullName: name || email.split("@")[0],
            professionalTitle: "Full-Stack Software Engineer & Solutions Architect",
            skillsJson: JSON.stringify(["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"]),
            currency: "USD",
            timezone: "Africa/Nairobi (EAT, UTC+3)",
            city: "Nairobi",
            country: "Kenya",
          },
        },
      },
    });

    const emailResult = await sendVerificationOtpEmail(email, name || "WebHunt User", otp);

    if (!emailResult.success && !emailResult.isSimulated) {
      return {
        success: false,
        error: "We couldn't send the verification code right now. Please try again.",
      };
    }

    return {
      success: true,
      requireOtp: true,
      requireVerification: true,
      email,
      message: "Verification code sent to your email. Please enter the 6-digit code.",
    };
  } catch (error: any) {
    console.error("[AuthAction] Registration failed:", error);
    return {
      success: false,
      error: error.message || "Failed to create account. Please try again.",
    };
  }
}

/**
 * Verify account using the 6-digit numeric OTP
 */
export async function verifyOtpAction(params: {
  email: string;
  otp: string;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  isExpired?: boolean;
  isLocked?: boolean;
}> {
  try {
    const rawEmail = params.email || "";
    const email = rawEmail.toLowerCase().trim();
    const otp = (params.otp || "").trim();

    if (!email || !otp) {
      return { success: false, error: "Please enter your email and 6-digit verification code." };
    }

    if (!/^\d{6}$/.test(otp)) {
      return { success: false, error: "Please enter a valid 6-digit verification code." };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Account not found or invalid request." };
    }

    if (user.emailVerified) {
      await setSessionCookie(user.id, user.email, user.role);
      return { success: true, message: "Account is already verified. Redirecting to workspace..." };
    }

    // Check if OTP exists
    if (!user.verificationOtpHash) {
      return {
        success: false,
        error: "No active verification code found. Please request a new code.",
        isExpired: true,
      };
    }

    // Check expiration
    if (user.verificationOtpExpiry && user.verificationOtpExpiry < new Date()) {
      return {
        success: false,
        error: "This verification code has expired. Please request a new code.",
        isExpired: true,
      };
    }

    // Brute force protection: maximum 5 attempts per OTP
    if ((user.verificationOtpAttempts || 0) >= 5) {
      // Invalidate OTP
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationOtpHash: null,
          verificationOtpExpiry: null,
        },
      });
      return {
        success: false,
        error: "Too many incorrect attempts. For security, please request a new verification code.",
        isLocked: true,
      };
    }

    // Verify OTP hash
    const isValidOtp = verifyOtp(otp, user.verificationOtpHash);
    if (!isValidOtp) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationOtpAttempts: (user.verificationOtpAttempts || 0) + 1,
        },
      });
      return { success: false, error: "Incorrect verification code. Please check your email and try again." };
    }

    // Mark user verified and consume OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationOtpHash: null,
        verificationOtpExpiry: null,
        verificationOtpAttempts: 0,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    // Establish authenticated session
    await setSessionCookie(user.id, user.email, user.role);

    safeRevalidatePath("/");
    safeRevalidatePath("/pipeline");

    return {
      success: true,
      message: "Your email address has been verified successfully! Welcome to WebHunt.",
    };
  } catch (error: any) {
    console.error("[AuthAction] OTP verification failed:", error);
    return { success: false, error: "Failed to verify code. Please try again." };
  }
}

/**
 * Resend a fresh 6-digit OTP with 60-second rate limiting
 */
export async function resendOtpAction(email: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  cooldownSeconds?: number;
}> {
  try {
    const cleanEmail = (email || "").toLowerCase().trim();
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Safe response to avoid account enumeration
    if (!user || user.emailVerified) {
      return {
        success: true,
        message: "If an unverified account exists with that email, a new code has been sent.",
      };
    }

    // Enforce 60-second rate-limit cooldown
    if (user.verificationOtpSentAt) {
      const elapsedSeconds = Math.floor((Date.now() - user.verificationOtpSentAt.getTime()) / 1000);
      if (elapsedSeconds < 60) {
        const remaining = 60 - elapsedSeconds;
        return {
          success: false,
          error: `Please wait ${remaining} second${remaining === 1 ? '' : 's'} before requesting another code.`,
          cooldownSeconds: remaining,
        };
      }
    }

    const otp = generateSecureOtp(6);
    const otpHash = hashOtp(otp);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationOtpHash: otpHash,
        verificationOtpExpiry: otpExpiry,
        verificationOtpAttempts: 0,
        verificationOtpSentAt: new Date(),
      },
    });

    const emailResult = await sendVerificationOtpEmail(user.email, user.name || "WebHunt User", otp);

    if (!emailResult.success && !emailResult.isSimulated) {
      return {
        success: false,
        error: "We couldn't send the verification code right now. Please try again.",
      };
    }

    return {
      success: true,
      message: "A fresh 6-digit verification code has been dispatched to your inbox.",
    };
  } catch (error: any) {
    console.error("[AuthAction] Resend OTP failed:", error);
    return { success: false, error: "Failed to resend verification code." };
  }
}

/**
 * Sign in an existing user with verified credentials
 */
export async function loginAction(formData: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  isUnverified?: boolean;
  email?: string;
  role?: string;
}> {
  try {
    const rawEmail = formData.email || "";
    const email = rawEmail.toLowerCase().trim();
    const password = formData.password || "";

    if (!email || !password) {
      return { success: false, error: "Please provide both email and password." };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return { success: false, error: "Invalid email or password." };
    }

    if (user.status !== "active") {
      return { success: false, error: "Your account is suspended or inactive. Please contact support." };
    }

    // Check account lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const waitMinutes = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / (1000 * 60));
      return {
        success: false,
        error: `Account is temporarily locked due to failed attempts. Please try again in ${waitMinutes} minute(s).`,
      };
    }

    // Verify password
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      const failedAttempts = (user.failedLoginAttempts || 0) + 1;
      const lockoutUntil = failedAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
          lockoutUntil,
        },
      });

      return { success: false, error: "Invalid email or password." };
    }

    // Check if email has been verified
    if (!user.emailVerified) {
      // Auto-dispatch a fresh OTP if none active or expired
      if (!user.verificationOtpExpiry || user.verificationOtpExpiry < new Date()) {
        const otp = generateSecureOtp(6);
        const otpHash = hashOtp(otp);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            verificationOtpHash: otpHash,
            verificationOtpExpiry: otpExpiry,
            verificationOtpAttempts: 0,
            verificationOtpSentAt: new Date(),
          },
        });

        await sendVerificationOtpEmail(user.email, user.name || "WebHunt User", otp);
      }

      return {
        success: false,
        isUnverified: true,
        email: user.email,
        error: "Your email address has not been verified yet. A 6-digit verification code was sent to your inbox.",
      };
    }

    // Reset login attempt counters on successful sign-in
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // Create session cookie with role
    await setSessionCookie(user.id, user.email, user.role);

    safeRevalidatePath("/");
    safeRevalidatePath("/pipeline");
    safeRevalidatePath("/searches");

    return { success: true, role: user.role };
  } catch (error: any) {
    console.error("[AuthAction] Login failed:", error);
    return { success: false, error: "An error occurred while signing in. Please try again." };
  }
}

/**
 * Backward-compatible token link verification
 */
export async function verifyEmailAction(token: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    if (!token || token.trim() === "") {
      return { success: false, error: "Missing verification token." };
    }

    const cleanToken = token.trim();
    const user = await prisma.user.findUnique({
      where: { verificationToken: cleanToken },
    });

    if (!user) {
      return {
        success: false,
        error: "This verification link is invalid or has already been used.",
      };
    }

    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      return {
        success: false,
        error: "This verification link has expired. Please request a new verification code.",
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
        verificationOtpHash: null,
        verificationOtpExpiry: null,
      },
    });

    await setSessionCookie(user.id, user.email, user.role);

    safeRevalidatePath("/");
    safeRevalidatePath("/pipeline");

    return {
      success: true,
      message: "Your email address has been verified successfully! Welcome to WebHunt.",
    };
  } catch (error: any) {
    console.error("[AuthAction] Email verification failed:", error);
    return { success: false, error: "Failed to verify email. Please try again." };
  }
}

/**
 * Backward-compatible token resend
 */
export async function resendVerificationAction(email: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const result = await resendOtpAction(email);
  return {
    success: result.success,
    message: result.message,
    error: result.error,
  };
}

/**
 * Request a password reset link
 */
export async function requestPasswordResetAction(email: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cleanEmail = (email || "").toLowerCase().trim();
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    const resetLimit = checkRateLimit(`reset_${cleanEmail}`, 3, 900); // Max 3 per 15 minutes
    if (!resetLimit.allowed) {
      return {
        success: false,
        error: `Too many password reset requests. Please wait ${resetLimit.retryAfterSeconds} second(s) before trying again.`,
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (user && user.emailVerified) {
      const resetToken = generateSecureToken(32);
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      await sendPasswordResetEmail(user.email, user.name || "WebHunt User", resetToken);
    }

    return {
      success: true,
      message: "If an active account exists with that email, instructions to reset your password have been sent.",
    };
  } catch (error: any) {
    console.error("[AuthAction] Request password reset failed:", error);
    return { success: false, error: "Failed to process password reset request." };
  }
}

/**
 * Reset user password with token
 */
export async function resetPasswordAction(
  token: string,
  newPassword: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    if (!token || token.trim() === "") {
      return { success: false, error: "Missing password reset token." };
    }

    const strengthCheck = validatePasswordStrength(newPassword);
    if (!strengthCheck.isValid) {
      return { success: false, error: strengthCheck.message || "Password does not meet security requirements." };
    }

    const user = await prisma.user.findUnique({
      where: { resetToken: token.trim() },
    });

    if (!user) {
      return {
        success: false,
        error: "This password reset link is invalid or has already been used.",
      };
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      return {
        success: false,
        error: "This password reset link has expired. Please request a new one.",
      };
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });

    return {
      success: true,
      message: "Password reset successful! You can now sign in with your new password.",
    };
  } catch (error: any) {
    console.error("[AuthAction] Reset password failed:", error);
    return { success: false, error: "Failed to reset password. Please try again." };
  }
}

/**
 * Sign out the current user session
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  await clearSessionCookie();
  safeRevalidatePath("/");
  safeRevalidatePath("/pipeline");
  safeRevalidatePath("/searches");
  return { success: true };
}

/**
 * Get current session and user profile status
 */
export async function getAuthStatusAction(): Promise<{
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: string;
    status: string;
    isVerified: boolean;
  } | null;
}> {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return { isAuthenticated: false, isAdmin: false, user: null };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return { isAuthenticated: false, isAdmin: false, user: null };
    }

    const isUserAdmin = isAdminSession(session) || (user.role || '').toLowerCase() === 'admin';

    return {
      isAuthenticated: true,
      isAdmin: isUserAdmin,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
        status: user.status || 'active',
        isVerified: !!user.emailVerified,
      },
    };
  } catch (err) {
    return { isAuthenticated: false, isAdmin: false, user: null };
  }
}

/**
 * Server-side authorization guard for administrative actions
 */
export async function requireAdminSessionAction(): Promise<{
  isAuthorized: boolean;
  userId?: string;
  error?: string;
}> {
  const session = await getCurrentSession();
  if (!session || !session.userId) {
    return { isAuthorized: false, error: "Authentication required." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, status: true },
  });

  if (!user || user.status !== 'active') {
    return { isAuthorized: false, error: "User account is suspended or inactive." };
  }

  const role = (user.role || '').toLowerCase();
  if (role !== 'admin' && role !== 'administrator' && role !== 'owner' && role !== 'superadmin') {
    return { isAuthorized: false, error: "Access denied. Administrator privileges required." };
  }

  return { isAuthorized: true, userId: session.userId };
}
