"use client";

import React, { useState } from "react";
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Zap
} from "lucide-react";
import { KORA_PAYMENT_PLANS, PaymentPlan } from "@/lib/kora";
import { initializePaymentAction, verifyPaymentAction } from "@/app/actions/payments";

interface KoraCheckoutModalProps {
  onClose: () => void;
  defaultPlanId?: string;
  userEmail?: string;
  userName?: string;
  returnTo?: string;
  onSuccess?: () => void;
}

export default function KoraCheckoutModal({
  onClose,
  defaultPlanId = "annual",
  userEmail = "",
  userName = "",
  returnTo = "",
  onSuccess,
}: KoraCheckoutModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    defaultPlanId === "monthly" ? "monthly" : "annual"
  );
  const [currency, setCurrency] = useState<"USD" | "KES" | "NGN">("USD");
  const [email, setEmail] = useState(userEmail);
  const [name, setName] = useState(userName);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationRef, setVerificationRef] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const currentPlan =
    KORA_PAYMENT_PLANS.find((p) => p.id === selectedPlanId) || KORA_PAYMENT_PLANS[0];

  const getPlanPrice = (plan: PaymentPlan) => {
    if (currency === "KES") return "KSh " + plan.priceKes.toLocaleString();
    if (currency === "NGN") return "₦" + (plan.priceUsd * 1500).toLocaleString();
    return "$" + plan.priceUsd.toLocaleString();
  };

  const handleCheckout = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter a valid email address for transaction receipt & verification.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await initializePaymentAction({
        planId: currentPlan.id,
        currency,
        customerEmail: email.trim(),
        customerName: name.trim() || "WebHunt Lead Hunter",
        narration: "WebHunt Delta " + currentPlan.name + " (" + (currency === 'KES' ? 'KSh ' + currentPlan.priceKes : '$' + currentPlan.priceUsd) + ")",
        returnTo,
      });

      if (res.status && res.data?.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else {
        setErrorMessage(res.message || "Failed to initialize Kora Payment.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while connecting to payment gateway.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationRef.trim()) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const res = await verifyPaymentAction(verificationRef.trim());
      setVerificationResult(res);
      if (res.status && (res as any).activated) {
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setVerificationResult({ status: false, message: err.message });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] bg-surface border border-subtle/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-foreground animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-subtle/50 bg-surface-subtle">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-subtle/50 flex items-center justify-center text-foreground">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  WebHunt Delta Subscription
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-elevated text-foreground border border-subtle/50">
                  Kora Gateway
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Choose your pass to unlock unrestricted lead radar scans &amp; CRM pipeline tools
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-surface-elevated p-2 rounded-xl transition border border-transparent hover:border-subtle/50"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Supported Channels Banner */}
          <div className="grid grid-cols-3 gap-2 bg-surface-subtle p-3 rounded-2xl border border-subtle/50">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-2 text-center sm:text-left p-1.5 rounded-xl bg-surface-elevated">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mb-1 sm:mb-0" />
              <div>
                <span className="font-bold text-foreground block text-[11px]">M-Pesa / Mobile</span>
                <span className="text-[9px] text-muted-foreground block">Kenya &amp; Africa</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:space-x-2 text-center sm:text-left p-1.5 rounded-xl bg-surface-elevated">
              <CreditCard className="w-4 h-4 text-foreground shrink-0 mb-1 sm:mb-0" />
              <div>
                <span className="font-bold text-foreground block text-[11px]">Visa / Mastercard</span>
                <span className="text-[9px] text-muted-foreground block">Global Cards</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:space-x-2 text-center sm:text-left p-1.5 rounded-xl bg-surface-elevated">
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0 mb-1 sm:mb-0" />
              <div>
                <span className="font-bold text-foreground block text-[11px]">Bank Transfer</span>
                <span className="text-[9px] text-muted-foreground block">Direct Electronic</span>
              </div>
            </div>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Select Currency
            </span>
            <div className="flex items-center p-1 rounded-xl bg-surface-elevated border border-subtle/50">
              {(["USD", "KES", "NGN"] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={"px-3 py-1 rounded-xl text-xs font-semibold transition " + (
                    currency === curr
                      ? "bg-white text-black shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {curr === "USD" ? "$ (USD)" : curr === "KES" ? "KSh (KES)" : "₦ (NGN)"}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Plans Grid (Exactly 2 Authoritative Plans) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {KORA_PAYMENT_PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <button
                  type="button"
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={"w-full text-left p-4 sm:p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 relative " + (
                    isSelected
                      ? "bg-surface-elevated border-subtle/50 text-foreground shadow-sm"
                      : "bg-surface-subtle hover:bg-surface-elevated/60 border-subtle text-muted-foreground hover:text-foreground"
                  )}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-white text-black text-[9px] font-bold shadow-sm flex items-center space-x-1">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>BEST VALUE (SAVE 66%)</span>
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-base text-foreground">{plan.name}</div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {plan.id === "monthly" ? "30 Days" : "365 Days"}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{plan.tagline}</div>
                  </div>

                  <div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-extrabold text-foreground">
                        {getPlanPrice(plan)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {plan.id === "monthly" ? "/ month" : "/ year"}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-3 space-y-1.5">
                      {plan.features.slice(0, 4).map((f) => (
                        <div key={f} className="flex items-start space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-subtle flex items-center justify-between text-xs font-semibold">
                    <span>{isSelected ? "Selected Plan" : "Choose " + plan.name}</span>
                    <div className={"w-5 h-5 rounded-full border flex items-center justify-center " + (
                      isSelected ? "border-white bg-white text-black" : "border-subtle/50"
                    )}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Customer Details Form */}
          <div className="bg-surface-subtle border border-subtle/50 rounded-2xl p-4 space-y-3">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Receipt &amp; Account Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Full Name / Business
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Baraka Tech"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Verify Existing Payment Reference Accordion */}
          <div className="pt-2 border-t border-subtle">
            <details className="group cursor-pointer">
              <summary className="text-[11px] text-muted-foreground hover:text-foreground flex items-center justify-between list-none">
                <span>Already made a payment? Verify reference number</span>
                <span className="text-xs group-open:rotate-180 transition">▼</span>
              </summary>
              
              <form onSubmit={handleManualVerify} className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={verificationRef}
                    onChange={(e) => setVerificationRef(e.target.value)}
                    placeholder="Enter reference (e.g. WH-1726045...)"
                    className="flex-1 px-5 py-3 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="px-4 py-2 bg-surface-elevated hover:bg-surface-secondary text-foreground font-semibold text-xs rounded-xl border border-subtle/50 flex items-center space-x-1"
                  >
                    {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Verify</span>}
                  </button>
                </div>

                {verificationResult && (
                  <div className={"p-3 rounded-xl text-xs border " + (
                    verificationResult.status && verificationResult.data?.status === "success"
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                      : "bg-surface-elevated border-subtle/50 text-muted-foreground"
                  )}>
                    <div className="font-bold">
                      {verificationResult.status ? "Transaction Verified:" : "Verification Notice:"}
                    </div>
                    <div>{verificationResult.message}</div>
                    {verificationResult.data && (
                      <div className="font-mono text-[10px] mt-1 opacity-80">
                        Ref: {verificationResult.data.reference} | Status: {verificationResult.data.status} | Amount: {verificationResult.data.currency} {verificationResult.data.amount}
                      </div>
                    )}
                  </div>
                )}
              </form>
            </details>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-subtle/50 bg-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Kora 256-bit Encrypted Checkout • PCI-DSS Certified</span>
          </div>

          <div className="flex items-center space-x-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-surface-elevated rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isLoading}
              className="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting to Kora...</span>
                </>
              ) : (
                <>
                  <span>Pay {getPlanPrice(currentPlan)} with Kora</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
