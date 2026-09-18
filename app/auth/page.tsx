"use client";

import React, { useState, Suspense } from "react";
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
  ShieldCheck, 
  Eye, 
  EyeOff,
  Sparkles
} from "lucide-react";
import { 
  loginAction, 
  registerAction, 
  requestPasswordResetAction 
} from "@/app/actions/auth";

type AuthTab = "signin" | "register" | "forgot";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const initialMode = searchParams.get("mode") as AuthTab;
  const initialEmail = searchParams.get("email") || "";

  const [tab, setTab] = useState<AuthTab>(
    initialMode && ["signin", "register", "forgot"].includes(initialMode) 
      ? initialMode 
      : "signin"
  );

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await loginAction({ email, password });
      if (res.success) {
        setSuccessMessage("Authentication successful. Redirecting to workspace...");
        const target = returnUrl && returnUrl.startsWith("/") ? returnUrl : "/";
        setTimeout(() => {
          window.location.href = target;
        }, 400);
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
        setSuccessMessage(res.message || "Account created successfully. Redirecting to workspace...");
        const target = returnUrl && returnUrl.startsWith("/") ? returnUrl : "/";
        setTimeout(() => {
          window.location.href = target;
        }, 400);
      } else {
        setErrorMessage(res.error || "Failed to create account.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Registration encountered an unexpected error.");
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
        <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl bg-surface border border-subtle/50 shadow-sm mb-1">
          <div className="w-6 h-6 rounded-xl bg-surface-elevated flex items-center justify-center">
            <Radar className="w-3.5 h-3.5 text-foreground" />
          </div>
          <span className="font-bold text-sm text-foreground tracking-tight">WebHunt Workspace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {tab === "signin" && "Sign In to Your Workspace"}
          {tab === "register" && "Create Your WebHunt Account"}
          {tab === "forgot" && "Reset Your Password"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          {tab === "signin" && "Access verified physical business radar, live remote tech gigs, and proposal generator."}
          {tab === "register" && "Join WebHunt to discover high-value prospects and track multi-channel outreach."}
          {tab === "forgot" && "Enter your registered email address to receive a secure recovery link."}
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-surface border border-subtle/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Tab Switcher */}
        {(tab === "signin" || tab === "register") && (
          <div className="flex rounded-xl bg-surface-subtle p-1 border border-subtle/50">
            <button
              type="button"
              onClick={() => { setTab("signin"); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                tab === "signin"
                  ? "bg-surface-elevated text-foreground border border-subtle/50 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab("register"); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                tab === "register"
                  ? "bg-surface-elevated text-foreground border border-subtle/50 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN FORM */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-subtle border border-subtle/50 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-foreground transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">Password</label>
                <button
                  type="button"
                  onClick={() => { setTab("forgot"); setErrorMessage(null); setSuccessMessage(null); }}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-subtle border border-subtle/50 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-foreground transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">Full Name / Agency Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name / Agency Name"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-subtle border border-subtle/50 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-foreground transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-subtle border border-subtle/50 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-foreground transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">Password (Min 8 chars, 1 number, 1 letter)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-subtle border border-subtle/50 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-foreground transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-subtle border border-subtle/50 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-foreground transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD */}
        {tab === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center pb-2">
              <div className="w-12 h-12 rounded-2xl bg-surface-subtle border border-subtle/50 text-foreground flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Password Recovery</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                We will email you a single-use recovery link valid for 1 hour.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-subtle border border-subtle/50 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-foreground transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
                className="text-xs text-muted-foreground hover:text-foreground transition"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4 text-foreground">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-subtle/50 border-t-white rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading authentication workspace...</span>
        </div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
