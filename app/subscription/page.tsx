"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  CreditCard, 
  Smartphone, 
  Building2, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Radar, 
  Zap, 
  Lock,
  ArrowLeft,
  Calendar,
  Layers,
  Crown
} from "lucide-react";
import { KORA_PAYMENT_PLANS, PaymentPlan } from "@/lib/kora";
import { 
  getUserSubscriptionAction, 
  initializePaymentAction, 
  verifyPaymentAction 
} from "@/app/actions/payments";
import { SubscriptionStatusResult } from "@/lib/auth/subscription";

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const returnTo = searchParams.get("returnTo") || "";
  const paymentStatus = searchParams.get("payment");
  const refParam = searchParams.get("ref");

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [userSession, setUserSession] = useState<any | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatusResult | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("annual");
  const [currency, setCurrency] = useState<"USD" | "KES" | "NGN">("USD");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationSuccessMessage, setVerificationSuccessMessage] = useState<string | null>(null);

  // Manual reference check state
  const [manualRef, setManualRef] = useState(refParam || "");
  const [isVerifyingRef, setIsVerifyingRef] = useState(false);
  const [manualVerifyResult, setManualVerifyResult] = useState<any | null>(null);

  const currentPlan =
    KORA_PAYMENT_PLANS.find((p) => p.id === selectedPlanId) || KORA_PAYMENT_PLANS[0];

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await getUserSubscriptionAction();
      if (res.isAuthenticated && res.user) {
        setUserSession(res.user);
        setCustomerEmail(res.user.email);
        setCustomerName(res.user.name || "");
      }
      setSubStatus(res.subscriptionStatus);
    } catch (err: any) {
      console.warn("Failed to load subscription status:", err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Handle auto-verification if redirected with payment=success
  useEffect(() => {
    if (paymentStatus === "success" && refParam) {
      setIsVerifyingRef(true);
      verifyPaymentAction(refParam)
        .then((res) => {
          if (res.status) {
            setVerificationSuccessMessage(
              "Your transaction (" + refParam + ") was verified successfully! Your subscription is now active."
            );
            fetchStatus();
          } else {
            setErrorMessage(res.message || "Payment verification pending. Please verify below.");
          }
        })
        .catch((err) => {
          setErrorMessage(err.message || "Verification error");
        })
        .finally(() => {
          setIsVerifyingRef(false);
        });
    }
  }, [paymentStatus, refParam]);

  const getPlanPrice = (plan: PaymentPlan) => {
    if (currency === "KES") return "KSh " + plan.priceKes.toLocaleString();
    if (currency === "NGN") return "₦" + (plan.priceUsd * 1500).toLocaleString();
    return "$" + plan.priceUsd.toLocaleString();
  };

  const handleCheckout = async (planIdToUse?: string) => {
    const targetPlan = planIdToUse
      ? KORA_PAYMENT_PLANS.find((p) => p.id === planIdToUse) || currentPlan
      : currentPlan;

    if (!userSession && !customerEmail.trim()) {
      setErrorMessage("Please enter your email address to receive access and invoice.");
      return;
    }

    setIsCheckingOut(true);
    setErrorMessage(null);

    try {
      const res = await initializePaymentAction({
        planId: targetPlan.id,
        currency,
        customerEmail: customerEmail.trim() || userSession?.email,
        customerName: customerName.trim() || userSession?.name || "WebHunt Lead Hunter",
        narration: "WebHunt " + targetPlan.name + " Subscription",
        returnTo,
      });

      if (res.status && res.data?.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else {
        setErrorMessage(res.message || "Failed to connect to Kora Gateway.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualRef.trim()) return;

    setIsVerifyingRef(true);
    setManualVerifyResult(null);

    try {
      const res = await verifyPaymentAction(manualRef.trim());
      setManualVerifyResult(res);
      if (res.status) {
        fetchStatus();
      }
    } catch (err: any) {
      setManualVerifyResult({ status: false, message: err.message });
    } finally {
      setIsVerifyingRef(false);
    }
  };

  const getReturnHref = () => {
    if (returnTo === "physical") return "/";
    if (returnTo === "online") return "/";
    if (returnTo.startsWith("/")) return returnTo;
    return "/";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href={getReturnHref()}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-600 dark:text-muted-foreground hover:text-neutral-900 dark:hover:text-foreground transition px-3 py-1.5 rounded-xl bg-surface dark:bg-surface border border-black/[0.08] dark:border-subtle/50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to {returnTo === "online" ? "Remote Gigs Radar" : "Local Lead Radar"}</span>
        </Link>

        {userSession && (
          <div className="text-xs text-neutral-500 dark:text-muted-foreground">
            Signed in as <span className="font-semibold text-neutral-900 dark:text-foreground">{userSession.email}</span>
          </div>
        )}
      </div>

      {/* Success Banner */}
      {verificationSuccessMessage && (
        <div className="p-4 rounded-xl bg-success/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-sm text-foreground">Subscription Active!</div>
              <div className="text-muted-foreground">{verificationSuccessMessage}</div>
            </div>
          </div>
          <Link
            href={getReturnHref()}
            className="px-4 py-2 bg-white text-black hover:bg-neutral-200 font-semibold rounded-xl shrink-0 transition"
          >
            Launch Radar Now
          </Link>
        </div>
      )}

      {/* Current Active Status Card (Only shown for verified paid subscriptions) */}
      {subStatus?.subscription && (
        <div className="bg-surface dark:bg-surface border border-subtle/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-surface-elevated border border-subtle/50 text-foreground flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-foreground">
                    Active Subscription
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-success/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider">
                    Active
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-muted-foreground mt-0.5">
                  {"Plan: " + (subStatus.subscription.plan === "annual" ? "Annual Pass ($200/yr)" : "Monthly Access ($50/mo)") + " • " + (subStatus.subscription.daysRemaining || 0) + " days remaining"}
                </p>
              </div>
            </div>

            <Link
              href={getReturnHref()}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold shadow-sm transition shrink-0"
            >
              <Radar className="w-4 h-4" />
              <span>Launch Lead Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-surface dark:bg-surface border border-black/[0.08] dark:border-subtle/50 text-neutral-600 dark:text-muted-foreground text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-300" />
          <span>Production Radar Access Control</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-foreground tracking-tight">
          Unlock Unlimited Discovery Radar
        </h1>
        <p className="text-sm text-neutral-600 dark:text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Access high-intent physical business leads with no websites, remote tech contracts, enriched WhatsApp &amp; phone contacts, and deal pipeline automation.
        </p>

        {/* Currency Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-surface dark:bg-surface border border-black/[0.08] dark:border-subtle/50 mt-4">
          {(["USD", "KES", "NGN"] as const).map((curr) => (
            <button
              key={curr}
              type="button"
              onClick={() => setCurrency(curr)}
              className={"px-4 py-1.5 rounded-xl text-xs font-semibold transition " + (
                currency === curr
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-600 dark:text-muted-foreground hover:text-neutral-900 dark:hover:text-foreground"
              )}
            >
              {curr === "USD" ? "USD ($)" : curr === "KES" ? "KES (KSh)" : "NGN (₦)"}
            </button>
          ))}
        </div>
      </div>

      {/* Two Authoritative Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {KORA_PAYMENT_PLANS.map((plan) => {
          const isAnnual = plan.id === "annual";

          return (
            <div
              key={plan.id}
              className={"relative rounded-2xl p-6 sm:p-8 border transition flex flex-col justify-between space-y-6 " + (
                isAnnual
                  ? "bg-surface dark:bg-surface border-subtle/50 shadow-xl"
                  : "bg-surface dark:bg-surface border-black/[0.08] dark:border-subtle/50 hover:border-black/[0.16] dark:hover:border-white/[0.16]"
              )}
            >
              {isAnnual && (
                <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-white text-black text-[10px] font-bold shadow-sm flex items-center space-x-1 uppercase tracking-wider">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>RECOMMENDED • SAVE 66%</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-foreground">{plan.name}</h3>
                    <p className="text-xs text-neutral-500 dark:text-muted-foreground mt-1">{plan.tagline}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-surface-elevated text-neutral-600 dark:text-muted-foreground border border-black/[0.08] dark:border-subtle/50">
                    {plan.durationDays} Days
                  </span>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-neutral-900 dark:text-foreground tracking-tight">
                      {getPlanPrice(plan)}
                    </span>
                    <span className="text-sm font-semibold text-neutral-500 dark:text-muted-foreground">
                      {isAnnual ? "/ year" : "/ month"}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-muted-foreground mt-1">
                    {isAnnual ? "Billed annually • Full 365-day uncapped discovery" : "Billed monthly • 30-day flexible pass"}
                  </p>
                </div>

                {/* Features List */}
                <div className="pt-4 border-t border-black/[0.08] dark:border-subtle/50 space-y-2.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-muted-foreground">
                    Included Features
                  </div>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start space-x-2 text-xs text-neutral-700 dark:text-foreground">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-4 border-t border-black/[0.08] dark:border-subtle/50">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    handleCheckout(plan.id);
                  }}
                  disabled={isCheckingOut}
                  className={"w-full py-3 px-6 rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2 " + (
                    isAnnual
                      ? "bg-white text-black hover:bg-neutral-200 shadow-sm"
                      : "bg-surface-elevated hover:bg-surface-secondary text-neutral-900 dark:text-foreground border border-black/[0.08] dark:border-subtle/50"
                  )}
                >
                  {isCheckingOut && selectedPlanId === plan.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Connecting to Kora...</span>
                    </>
                  ) : (
                    <>
                      <span>Get {plan.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Guest Email Field if Not Signed In */}
      {!userSession && (
        <div className="bg-surface dark:bg-surface border border-black/[0.08] dark:border-subtle/50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-muted-foreground">
            <Lock className="w-4 h-4 text-neutral-400 dark:text-foreground" />
            <span>Account Details for Invoice &amp; Subscription Setup</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-muted-foreground mb-1">
                Your Full Name / Agency
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Baraka Tech"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated dark:bg-surface-elevated border border-black/[0.08] dark:border-subtle/50 text-xs text-neutral-900 dark:text-foreground placeholder:text-neutral-500 dark:placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-muted-foreground mb-1">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated dark:bg-surface-elevated border border-black/[0.08] dark:border-subtle/50 text-xs text-neutral-900 dark:text-foreground placeholder:text-neutral-500 dark:placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
              />
            </div>
          </div>
        </div>
      )}

      {/* Supported Payment Rails Badges */}
      <div className="bg-surface dark:bg-surface border border-black/[0.08] dark:border-subtle/50 rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center space-x-3 p-5 rounded-xl bg-surface-elevated dark:bg-surface-elevated border border-black/[0.08] dark:border-subtle/50">
            <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-neutral-900 dark:text-foreground">M-Pesa &amp; Mobile Money</div>
              <div className="text-[10px] text-neutral-500 dark:text-muted-foreground">Instant STK Push in Kenya, Ghana &amp; Africa</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-5 rounded-xl bg-surface-elevated dark:bg-surface-elevated border border-black/[0.08] dark:border-subtle/50">
            <CreditCard className="w-5 h-5 text-neutral-400 dark:text-foreground shrink-0" />
            <div>
              <div className="font-semibold text-neutral-900 dark:text-foreground">Global Visa &amp; Mastercard</div>
              <div className="text-[10px] text-neutral-500 dark:text-muted-foreground">3D-Secure 256-bit encrypted checkout</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-5 rounded-xl bg-surface-elevated dark:bg-surface-elevated border border-black/[0.08] dark:border-subtle/50">
            <ShieldCheck className="w-5 h-5 text-neutral-400 dark:text-foreground shrink-0" />
            <div>
              <div className="font-semibold text-neutral-900 dark:text-foreground">Instant Radar Activation</div>
              <div className="text-[10px] text-neutral-500 dark:text-muted-foreground">Automatic server verification &amp; access sync</div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Verification Accordion */}
      <div className="bg-surface dark:bg-surface border border-black/[0.08] dark:border-subtle/50 rounded-2xl p-5 text-xs space-y-3">
        <details className="group cursor-pointer">
          <summary className="font-semibold text-neutral-600 dark:text-muted-foreground hover:text-neutral-900 dark:hover:text-foreground flex items-center justify-between list-none">
            <span>Already paid via Kora? Click here to verify your reference number</span>
            <span className="text-xs group-open:rotate-180 transition">▼</span>
          </summary>

          <form onSubmit={handleManualVerify} className="mt-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={manualRef}
                onChange={(e) => setManualRef(e.target.value)}
                placeholder="Enter transaction reference (e.g. WH-1726045...)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-black/[0.08] dark:border-subtle/50 text-xs text-neutral-900 dark:text-foreground font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
              />
              <button
                type="submit"
                disabled={isVerifyingRef}
                className="px-4 py-2.5 bg-surface-elevated hover:bg-surface-secondary text-neutral-900 dark:text-foreground font-semibold rounded-xl border border-black/[0.08] dark:border-subtle/50 flex items-center justify-center space-x-2 transition"
              >
                {isVerifyingRef ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Verify Reference</span>}
              </button>
            </div>

            {manualVerifyResult && (
              <div className={"p-4 rounded-xl text-xs border " + (
                manualVerifyResult.status && manualVerifyResult.data?.status === "success"
                  ? "bg-success/10 border-emerald-500/30 text-emerald-300"
                  : "bg-surface-elevated border-black/[0.08] dark:border-subtle/50 text-neutral-600 dark:text-muted-foreground"
              )}>
                <div className="font-semibold text-neutral-900 dark:text-foreground">
                  {manualVerifyResult.status ? "Transaction Verified Successfully:" : "Verification Notice:"}
                </div>
                <div>{manualVerifyResult.message}</div>
                {manualVerifyResult.data && (
                  <div className="font-mono text-[10px] mt-1 opacity-80">
                    Ref: {manualVerifyResult.data.reference} | Status: {manualVerifyResult.data.status} | Amount: {manualVerifyResult.data.currency} {manualVerifyResult.data.amount}
                  </div>
                )}
              </div>
            )}
          </form>
        </details>
      </div>

    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh] text-neutral-500 dark:text-muted-foreground space-x-2 text-xs">
        <RefreshCw className="w-4 h-4 animate-spin text-neutral-400 dark:text-foreground" />
        <span>Loading subscription status...</span>
      </div>
    }>
      <SubscriptionContent />
    </Suspense>
  );
}
