"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Radar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw,
  Mail
} from "lucide-react";
import { verifyEmailAction } from "@/app/actions/auth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(token ? "verifying" : "error");
  const [errorMessage, setErrorMessage] = useState<string | null>(token ? null : "No verification token provided in URL.");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    async function verify() {
      try {
        const res = await verifyEmailAction(token!);
        if (!isMounted) return;

        if (res.success) {
          setStatus("success");
          setSuccessMessage(res.message || "Your email address has been verified successfully!");
          // Auto redirect after 2 seconds
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 2000);
        } else {
          setStatus("error");
          setErrorMessage(res.error || "Failed to verify email. The link may have expired or already been used.");
        }
      } catch (err: any) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(err.message || "Network error occurred during email verification.");
      }
    }

    verify();
    return () => {
      isMounted = false;
    };
  }, [token, router]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-[rgba(228,222,210,0.15)] rounded-3xl p-8 shadow-2xl text-center space-y-6">
        {/* State 1: Verifying */}
        {status === "verifying" && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-3xl bg-[#161616] border border-[rgba(249,92,75,0.3)] text-[#F95C4B] flex items-center justify-center mx-auto shadow-xl">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-[#F6F4F1]">Verifying Your Account...</h2>
            <p className="text-xs text-[#A8A196]">
              Validating your cryptographic one-time token and activating workspace access.
            </p>
          </div>
        )}

        {/* State 2: Success */}
        {status === "success" && (
          <div className="space-y-5 py-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-[#0e1f14] border border-[#5EBA8C]/40 text-[#5EBA8C] flex items-center justify-center mx-auto shadow-xl shadow-[#5EBA8C]/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#F6F4F1]">Email Verified!</h2>
              <p className="text-xs text-[#A8A196] leading-relaxed">
                {successMessage || "Your account is now fully verified. Redirecting you to the lead radar..."}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#F95C4B] hover:bg-[#E04838] text-white font-semibold text-xs shadow-md shadow-[#F95C4B]/20 transition"
              >
                <span>Enter WebHunt Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Error */}
        {status === "error" && (
          <div className="space-y-5 py-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-[#1f0e0e] border border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-xl">
              <AlertCircle className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#F6F4F1]">Verification Link Invalid</h2>
              <p className="text-xs text-red-300 leading-relaxed bg-[#160c0c] p-3 rounded-xl border border-red-500/20">
                {errorMessage}
              </p>
            </div>
            <div className="pt-3 border-t border-[rgba(228,222,210,0.08)] flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Link
                href="/auth?mode=signin"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#161616] hover:bg-[#161616]/80 text-[#F6F4F1] border border-[rgba(228,222,210,0.15)] text-xs font-semibold transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth?mode=register"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95C4B] hover:bg-[#E04838] text-white text-xs font-semibold shadow-md shadow-[#F95C4B]/20 transition"
              >
                Register Again
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
