"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Radar, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Sparkles
} from "lucide-react";
import { 
  loginAction, 
  registerAction, 
  verifyOtpAction,
  resendOtpAction, 
  requestPasswordResetAction 
} from "@/app/actions/auth";

type AuthTab = "signin" | "register" | "verify_sent" | "forgot";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const initialMode = searchParams.get("mode") as AuthTab;
  const initialEmail = searchParams.get("email") || "";

  const [tab, setTab] = useState<AuthTab>(
    initialMode && ["signin", "register", "verify_sent", "forgot"].includes(initialMode) 
      ? initialMode 
      : "signin"
  );

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string>(initialEmail);

  // Resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    if (tab === "verify_sent" && otpInputRef.current) {
      setTimeout(() => otpInputRef.current?.focus(), 100);
    }
  }, [tab]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await loginAction({ email, password });
      if (res.success) {
        setSuccessMessage("Authentication successful. Redirecting to workspace...");
        setTimeout(() => {
          const target = returnUrl && returnUrl.startsWith("/") ? returnUrl : "/";
          router.push(target);
          router.refresh();
        }, 600);
      } else if (res.isUnverified) {
        setUnverifiedEmail(res.email || email);
        setTab("verify_sent");
        setErrorMessage(res.error || "Please enter the 6-digit verification code sent to your email.");
      } else {
        setErrorMessage(res.error || "Invalid email or password.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerAction({ name, email, password });
      if (res.success) {
        setUnverifiedEmail(email);
        setTab("verify_sent");
        setSuccessMessage(res.message || "Verification code sent. Please enter the 6-digit code below.");
        setResendCooldown(60);
      } else {
        setErrorMessage(res.error || "Failed to create account.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Registration encountered an unexpected error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = unverifiedEmail || email;
    if (!targetEmail || !otp) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await verifyOtpAction({ email: targetEmail, otp: otp.trim() });
      if (res.success) {
        setSuccessMessage(res.message || "Account verified! Redirecting to workspace...");
        setTimeout(() => {
          const target = returnUrl && returnUrl.startsWith("/") ? returnUrl : "/";
          router.push(target);
          router.refresh();
        }, 800);
      } else {
        setErrorMessage(res.error || "Invalid verification code.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to verify code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const targetEmail = unverifiedEmail || email;
    if (!targetEmail || resendCooldown > 0) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await resendOtpAction(targetEmail);
      if (res.success) {
        setSuccessMessage(res.message || "Fresh 6-digit verification code sent!");
        setResendCooldown(60);
      } else {
        setErrorMessage(res.error || "Failed to resend verification code.");
        if (res.cooldownSeconds) {
          setResendCooldown(res.cooldownSeconds);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error resending verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await requestPasswordResetAction(email);
      if (res.success) {
        setSuccessMessage(res.message || "If an account exists, a password reset link has been dispatched.");
      } else {
        setErrorMessage(res.error || "Failed to request password reset.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error requesting password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl bg-[#0D0D0D] border border-[rgba(228,222,210,0.12)] shadow-xl mb-1">
          <div className="w-6 h-6 rounded-lg bg-[#F95C4B] flex items-center justify-center">
            <Radar className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-[#F6F4F1] tracking-tight">WebHunt Workspace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F6F4F1] tracking-tight">
          {tab === "signin" && "Sign In to Your Workspace"}
          {tab === "register" && "Create Your WebHunt Account"}
          {tab === "verify_sent" && "Enter Verification Code"}
          {tab === "forgot" && "Reset Your Password"}
        </h1>
        <p className="text-xs sm:text-sm text-[#A8A196] max-w-md mx-auto">
          {tab === "signin" && "Access verified physical business radar, live remote tech gigs, and proposal generator."}
          {tab === "register" && "Join WebHunt to discover high-value prospects and track multi-channel outreach."}
          {tab === "verify_sent" && "Enter the 6-digit verification code sent to your email to activate your account."}
          {tab === "forgot" && "Enter your registered email address to receive a secure recovery link."}
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-[#0D0D0D] border border-[rgba(228,222,210,0.15)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Tab Switcher */}
        {(tab === "signin" || tab === "register") && (
          <div className="flex rounded-2xl bg-[#080808] p-1 border border-[rgba(228,222,210,0.1)]">
            <button
              type="button"
              onClick={() => { setTab("signin"); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                tab === "signin"
                  ? "bg-[#161616] text-[#F6F4F1] border border-[rgba(249,92,75,0.4)] shadow-sm"
                  : "text-[#A8A196] hover:text-[#F6F4F1]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab("register"); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                tab === "register"
                  ? "bg-[#161616] text-[#F6F4F1] border border-[rgba(249,92,75,0.4)] shadow-sm"
                  : "text-[#A8A196] hover:text-[#F6F4F1]"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-[#1f0e0e] border border-red-500/30 text-red-300 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-[#0e1f14] border border-[#5EBA8C]/30 text-[#5EBA8C] text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#5EBA8C] shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN FORM */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[#A8A196] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] text-xs text-[#F6F4F1] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium text-[#A8A196]">Password</label>
                <button
                  type="button"
                  onClick={() => { setTab("forgot"); setErrorMessage(null); setSuccessMessage(null); }}
                  className="text-[11px] text-[#F95C4B] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] text-xs text-[#F6F4F1] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#A8A196] hover:text-[#F6F4F1]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-[#F95C4B] hover:bg-[#E04838] text-white font-semibold text-xs shadow-md shadow-[#F95C4B]/20 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER FORM */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[#A8A196] mb-1.5">Full Name / Agency Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gackstone Baraka"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] text-xs text-[#F6F4F1] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#A8A196] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] text-xs text-[#F6F4F1] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#A8A196] mb-1.5">Password (Min 8 chars, 1 number, 1 letter)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] text-xs text-[#F6F4F1] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#A8A196] hover:text-[#F6F4F1]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#A8A196] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] text-xs text-[#F6F4F1] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-[#F95C4B] hover:bg-[#E04838] text-white font-semibold text-xs shadow-md shadow-[#F95C4B]/20 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Get Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: ENTER 6-DIGIT OTP FORM */}
        {tab === "verify_sent" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 py-1">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#161616] border border-[#5EBA8C]/30 text-[#5EBA8C] flex items-center justify-center mx-auto shadow-xl">
                <Mail className="w-6 h-6 text-[#5EBA8C]" />
              </div>
              <h3 className="font-bold text-base text-[#F6F4F1]">Enter Verification Code</h3>
              <p className="text-xs text-[#A8A196]">
                We sent a 6-digit code via Resend to:
              </p>
              <div className="inline-block font-mono text-xs font-semibold px-3 py-1 rounded-xl bg-[#161616] text-[#F6F4F1] border border-[rgba(228,222,210,0.12)]">
                {unverifiedEmail || email}
              </div>
            </div>

            {/* OTP Input Field */}
            <div>
              <label className="block text-[11px] font-medium text-center text-[#A8A196] mb-2">
                6-Digit Code (Valid for 10 minutes)
              </label>
              <input
                ref={otpInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                autoFocus
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setOtp(val);
                }}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] font-mono text-2xl font-bold py-3.5 rounded-2xl bg-[#080808] border-2 border-[rgba(249,92,75,0.4)] focus:border-[#F95C4B] focus:outline-none focus:ring-2 focus:ring-[#F95C4B]/20 text-[#F6F4F1] transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full py-3 rounded-xl bg-[#F95C4B] hover:bg-[#E04838] text-white font-semibold text-xs shadow-md shadow-[#F95C4B]/20 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify & Activate Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="pt-3 border-t border-[rgba(228,222,210,0.08)] flex items-center justify-between">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading || resendCooldown > 0}
                className="text-xs font-semibold text-[#F95C4B] hover:underline flex items-center space-x-1.5 disabled:opacity-50 disabled:no-underline"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => { setTab("signin"); setErrorMessage(null); setSuccessMessage(null); }}
                className="text-xs text-[#A8A196] hover:text-[#F6F4F1] transition"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: FORGOT PASSWORD */}
        {tab === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center pb-2">
              <div className="w-12 h-12 rounded-2xl bg-[#161616] border border-[rgba(228,222,210,0.12)] text-[#F95C4B] flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#F6F4F1]">Password Recovery</h3>
              <p className="text-[11px] text-[#A8A196] mt-0.5">
                We will email you a single-use recovery link valid for 1 hour.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#A8A196] mb-1.5">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] text-xs text-[#F6F4F1] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#F95C4B] hover:bg-[#E04838] text-white font-semibold text-xs shadow-md shadow-[#F95C4B]/20 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Recovery Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setTab("signin"); setErrorMessage(null); setSuccessMessage(null); }}
                className="text-xs text-[#A8A196] hover:text-[#F6F4F1] transition"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Security & Compliance Footer Note */}
      <div className="mt-8 text-center text-xs text-[#A8A196]/80 flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-[#5EBA8C]" />
        <span>Resend Transactional OTP • Scrypt Password Hashing • HttpOnly AES Sessions</span>
      </div>
    </div>
  );
}
