"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  User, 
  Briefcase, 
  Code, 
  Globe, 
  Save, 
  Check, 
  Plus, 
  Phone, 
  Mail, 
  Coins, 
  LogOut, 
  Moon, 
  Sun, 
  Edit3, 
  Sliders, 
  Palette,
  CreditCard,
  Sparkles,
  Smartphone,
  Download,
  Share
} from "lucide-react";
import { getUserProfileAction, saveUserProfileAction, UserProfileData } from "@/app/actions/profile";
import { logoutAction } from "@/app/actions/auth";
import { clearAllClientStorage } from "@/lib/pipeline-store";
import { useTheme } from "@/lib/theme-context";
import { usePwaInstall } from "@/lib/usePwaInstall";
import KoraCheckoutModal from "@/components/payments/KoraCheckoutModal";

interface ProfileSettingsModalProps {
  onClose: () => void;
  onProfileUpdated?: (profile: UserProfileData) => void;
}

export default function ProfileSettingsModal({ onClose, onProfileUpdated }: ProfileSettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const { isInstalled, canInstall, platform, isInstalling, installApp } = usePwaInstall();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [showKoraCheckout, setShowKoraCheckout] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getUserProfileAction();
      if (res.success && res.data) {
        setProfile(res.data);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || !profile) return;
    if (!profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()],
      });
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    const res = await saveUserProfileAction(profile);
    setIsSaving(false);
    if (res.success && res.data) {
      setSavedSuccess(true);
      if (onProfileUpdated) onProfileUpdated(res.data);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleLogout = async () => {
    clearAllClientStorage();
    await logoutAction();
    window.location.href = "/auth?mode=signin";
  };

  if (isLoading || !profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="p-8 rounded-2xl bg-surface border border-subtle/50 text-foreground flex items-center space-x-3 shadow-2xl">
          <div className="w-5 h-5 border-2 border-subtle/50 border-t-white rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading User Profile...</span>
        </div>
      </div>
    );
  }

  // Get initials for avatar
  const initials = (profile.fullName || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface border border-subtle/50 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden text-foreground max-h-[92vh] sm:max-h-[88vh] flex flex-col transition-colors">
        
        {/* Profile Card Header */}
        <div className="p-6 pb-5 border-b border-subtle/50 bg-surface-subtle relative">
          {/* Top Bar: Sign Out & Close */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-elevated text-muted-foreground border border-subtle/50">
                WebHunt Workspace
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition"
                title="Sign out of your account"
              >
                <span>Sign out</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Identity Row */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-surface-elevated border border-subtle/50 text-foreground flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-foreground truncate">
                  {profile.fullName || "Your Name"}
                </h3>
                <Edit3 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {profile.email || "No email registered"}
              </p>
              {profile.professionalTitle && (
                <p className="text-[11px] text-foreground font-medium mt-0.5 truncate">
                  {profile.professionalTitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Grouped Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-foreground">
          
          {/* GROUP 1: PREFERENCES & APPEARANCE (Theme Switcher) */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Preferences &amp; Appearance</span>
            </div>

            <div className="bg-surface-subtle border border-subtle/50 rounded-2xl p-4 divide-y divide-white/[0.06]">
              {/* Theme Switcher Row */}
              <div className="pb-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-surface-elevated border border-subtle/50 flex items-center justify-center text-foreground">
                    {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground text-xs block">Theme Mode</span>
                    <span className="text-[11px] text-muted-foreground block">
                      {theme === "dark" ? "Dark Mode (Obsidian #08090B)" : "Light Mode (Off-White #F5F5F7)"}
                    </span>
                  </div>
                </div>

                {/* Segmented Theme Switch */}
                <div className="flex items-center p-1 rounded-xl bg-surface-elevated border border-subtle/50 shrink-0">
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      theme === "dark"
                        ? "bg-white text-black shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      theme === "light"
                        ? "bg-white text-black shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                </div>
              </div>

              {/* Currency & Region Row */}
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-surface-elevated border border-subtle/50 flex items-center justify-center text-foreground shrink-0">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground text-xs block">Default Billing Currency</span>
                    <span className="text-[11px] text-muted-foreground block">Used in proposal drafts and rate cards</span>
                  </div>
                </div>

                <select
                  value={profile.currency || "USD"}
                  onChange={(e) => setProfile({ ...profile, currency: e.target.value as "USD" | "KES" })}
                  className="px-3 py-1.5 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary/40"
                >
                  <option value="USD" className="bg-surface">USD ($)</option>
                  <option value="KES" className="bg-surface">KES (KSh)</option>
                </select>
              </div>

              {/* PWA App Installation Row */}
              <div className="pt-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-surface-elevated border border-subtle/50 flex items-center justify-center text-foreground shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-xs block">WebHunt Application</span>
                      <span className="text-[11px] text-muted-foreground block">
                        {isInstalled
                          ? "Application is running in standalone mode"
                          : "Install Web Hunt directly on your device"}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isInstalled ? (
                      <div
                        role="status"
                        aria-live="polite"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated border border-subtle/50 text-xs font-semibold text-foreground"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>App installed</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await installApp();
                          if (res.isFallback || !canInstall) {
                            setShowGuide((prev) => !prev);
                          }
                        }}
                        disabled={isInstalling}
                        aria-expanded={showGuide}
                        aria-label="Install App"
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shadow-sm transition disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isInstalling ? "Installing..." : "Install App"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Platform-Specific Guided Installation Instructions */}
                {!isInstalled && showGuide && (
                  <div className="mt-1 p-3.5 rounded-xl bg-surface-elevated border border-subtle/60 text-[11px] text-muted-foreground space-y-2 animate-in fade-in">
                    <div className="font-semibold text-foreground flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <Download className="w-3.5 h-3.5 text-primary" />
                        <span>
                          {platform === "ios"
                            ? "Install on iOS / iPadOS Safari:"
                            : platform === "android"
                            ? "Install on Android:"
                            : "Install on Desktop:"}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowGuide(false)}
                        className="text-muted-foreground hover:text-foreground text-xs px-1.5 py-0.5 rounded hover:bg-surface-subtle transition"
                        aria-label="Close installation instructions"
                      >
                        ✕
                      </button>
                    </div>

                    {platform === "ios" ? (
                      <ol className="list-decimal list-inside space-y-1 pl-1 leading-relaxed">
                        <li>Tap the <strong className="text-foreground">Share</strong> icon in the Safari toolbar.</li>
                        <li>Scroll down and select <strong className="text-foreground">Add to Home Screen</strong>.</li>
                        <li>Tap <strong className="text-foreground">Add</strong> in the top-right corner to complete.</li>
                      </ol>
                    ) : platform === "android" ? (
                      <ol className="list-decimal list-inside space-y-1 pl-1 leading-relaxed">
                        <li>Tap the browser menu icon (<strong className="text-foreground">⋮</strong>) in the top-right.</li>
                        <li>Select <strong className="text-foreground">Install app</strong> or <strong className="text-foreground">Add to Home screen</strong>.</li>
                        <li>Confirm by tapping <strong className="text-foreground">Install</strong>.</li>
                      </ol>
                    ) : (
                      <ol className="list-decimal list-inside space-y-1 pl-1 leading-relaxed">
                        <li>Click the <strong className="text-foreground">Install</strong> icon (⊕) in your browser address bar.</li>
                        <li>Or open the browser menu (<strong className="text-foreground">⋮</strong>) and select <strong className="text-foreground">Install WebHunt</strong>.</li>
                        <li>Confirm in the prompt to launch as a standalone desktop app.</li>
                      </ol>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GROUP: SUBSCRIPTION & PAYMENT METHODS (POWERED BY KORA) */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Subscription &amp; Payment Methods</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Kora Gateway Active
              </span>
            </div>

            <div className="bg-surface-subtle border border-subtle/50 rounded-2xl p-4 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-subtle">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-foreground text-sm">WebHunt Radar Plan</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-elevated text-foreground border border-subtle/50">
                      Standard
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Multi-channel local business discovery, remote gigs, and proposal exports.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowKoraCheckout(true)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-sm transition shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade / Add Credits</span>
                </button>
              </div>

              {/* Supported Payment Channels Pill Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span>Accepted via Kora:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-surface-elevated text-foreground border border-subtle/50 text-[10px] font-medium flex items-center space-x-1">
                    <Smartphone className="w-3 h-3 text-emerald-400" />
                    <span>M-Pesa (Kenya)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-elevated text-foreground border border-subtle/50 text-[10px] font-medium flex items-center space-x-1">
                    <CreditCard className="w-3 h-3 text-muted-foreground" />
                    <span>Visa / Mastercard</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-elevated text-foreground border border-subtle/50 text-[10px] font-medium">
                    Bank Transfer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* GROUP: AI SETTINGS */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
              <span>AI Model Configuration</span>
            </div>

            <div className="bg-surface-subtle border border-subtle/50 rounded-2xl p-4 divide-y divide-white/[0.06]">
              {/* Provider & Model Row */}
              <div className="pb-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-surface-elevated border border-subtle/50 flex items-center justify-center text-foreground">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-xs block">AI Provider &amp; Model</span>
                      <span className="text-[11px] text-muted-foreground block">Select the AI engine for tasks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={profile.aiPreferences?.provider || "auto"}
                      onChange={(e) => setProfile({
                        ...profile,
                        aiPreferences: { ...(profile.aiPreferences || { model: 'auto', routingStrategy: 'BALANCED', automaticFailover: true }), provider: e.target.value, model: 'auto' }
                      })}
                      className="px-3 py-1.5 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary/40"
                    >
                      <option value="auto" className="bg-surface">Auto</option>
                      <option value="openai" className="bg-surface">OpenAI</option>
                      <option value="anthropic" className="bg-surface">Anthropic</option>
                      <option value="gemini" className="bg-surface">Google Gemini</option>
                      <option value="openrouter" className="bg-surface">OpenRouter</option>
                    </select>

                    <select
                      value={profile.aiPreferences?.model || "auto"}
                      onChange={(e) => setProfile({
                        ...profile,
                        aiPreferences: { ...(profile.aiPreferences || { provider: 'auto', routingStrategy: 'BALANCED', automaticFailover: true }), model: e.target.value }
                      })}
                      className="px-3 py-1.5 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary/40"
                    >
                      <option value="auto" className="bg-surface">Auto-Select Model</option>
                      {profile.aiPreferences?.provider === 'openai' && (
                        <>
                          <option value="gpt-4o" className="bg-surface">GPT-4o</option>
                          <option value="gpt-4o-mini" className="bg-surface">GPT-4o Mini</option>
                        </>
                      )}
                      {profile.aiPreferences?.provider === 'anthropic' && (
                        <>
                          <option value="claude-3-5-sonnet-20241022" className="bg-surface">Claude 3.5 Sonnet</option>
                          <option value="claude-3-haiku-20240307" className="bg-surface">Claude 3 Haiku</option>
                        </>
                      )}
                      {profile.aiPreferences?.provider === 'gemini' && (
                        <>
                          <option value="gemini-1.5-pro" className="bg-surface">Gemini 1.5 Pro</option>
                          <option value="gemini-1.5-flash" className="bg-surface">Gemini 1.5 Flash</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Routing & Failover */}
              <div className="pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-muted-foreground font-medium">Routing:</label>
                    <select
                      value={profile.aiPreferences?.routingStrategy || "BALANCED"}
                      onChange={(e) => setProfile({
                        ...profile,
                        aiPreferences: { ...(profile.aiPreferences || { provider: 'auto', model: 'auto', automaticFailover: true }), routingStrategy: e.target.value }
                      })}
                      className="px-2 py-1 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground focus:outline-none"
                    >
                      <option value="AUTO">Auto</option>
                      <option value="BALANCED">Balanced</option>
                      <option value="PERFORMANCE">Performance</option>
                      <option value="FASTEST">Fastest</option>
                      <option value="COST_OPTIMIZED">Cost Optimized</option>
                      <option value="MANUAL">Manual</option>
                    </select>
                  </div>
                </div>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={profile.aiPreferences?.automaticFailover ?? true}
                    onChange={(e) => setProfile({
                      ...profile,
                      aiPreferences: { ...(profile.aiPreferences || { provider: 'auto', model: 'auto', routingStrategy: 'BALANCED' }), automaticFailover: e.target.checked }
                    })}
                    className="rounded border-subtle/50 bg-surface-elevated text-emerald-500 focus:ring-0"
                  />
                  <span className="text-[11px] font-medium text-foreground">Automatic Failover</span>
                </label>
              </div>
            </div>
          </div>

          {/* GROUP 2: PROFESSIONAL IDENTITY */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Professional Identity</span>
            </div>

            <div className="bg-surface-subtle border border-subtle/50 rounded-2xl p-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Full Name / Agency</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-subtle/50 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-foreground"
                    placeholder="e.g. Gackstone Baraka"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={profile.professionalTitle}
                    onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-subtle/50 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-foreground"
                    placeholder="e.g. Senior Full-Stack Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">Bio / Value Proposition</label>
                <textarea
                  rows={2}
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-subtle/50 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-foreground leading-relaxed"
                  placeholder="Summary of your technical capabilities and engineering focus..."
                />
              </div>
            </div>
          </div>

          {/* GROUP 3: VERIFIED SKILLS & COMPETENCIES */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
              <Code className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Verified Skills &amp; Tech Stack</span>
            </div>

            <div className="bg-surface-subtle border border-subtle/50 rounded-2xl p-4 space-y-3">
              <form onSubmit={handleAddSkill} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill (e.g. Next.js, Python, PostgreSQL)"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-surface-elevated border border-subtle/50 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-foreground"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs flex items-center space-x-1 transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-surface-elevated text-foreground border border-subtle/50 text-[11px]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-muted-foreground hover:text-red-400 ml-1 text-sm leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* GROUP 4: COMMERCIAL RATES */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
              <Coins className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Commercial Pricing &amp; Kenya Rates</span>
            </div>

            <div className="bg-surface-subtle border border-subtle/50 rounded-2xl p-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Hourly Rate (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <input
                      type="number"
                      value={profile.hourlyRateUsd || 45}
                      onChange={(e) => setProfile({ ...profile, hourlyRateUsd: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Hourly Rate (KES)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">KSh</span>
                    <input
                      type="number"
                      value={profile.hourlyRateKes || 5500}
                      onChange={(e) => setProfile({ ...profile, hourlyRateKes: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">SME Web Project (KES)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">KSh</span>
                    <input
                      type="number"
                      value={profile.projectRateKes || 150000}
                      onChange={(e) => setProfile({ ...profile, projectRateKes: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">M-Pesa Buy Goods / Till Number (Optional)</label>
                  <input
                    type="text"
                    value={profile.mpesaTillNumber || ""}
                    onChange={(e) => setProfile({ ...profile, mpesaTillNumber: e.target.value })}
                    placeholder="e.g. 987654"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Timezone &amp; Location</label>
                  <input
                    type="text"
                    value={profile.timezone || "Africa/Nairobi (EAT, UTC+3)"}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GROUP 5: CONTACT CHANNELS */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Contact Channels &amp; Portfolio Proof</span>
            </div>

            <div className="bg-surface-subtle border border-subtle/50 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Public Email</label>
                  <input
                    type="email"
                    value={profile.email || ""}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="contact@yourdomain.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Phone / WhatsApp (E.164)</label>
                  <input
                    type="text"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value, whatsapp: e.target.value })}
                    placeholder="+254712345678"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Portfolio Website</label>
                  <input
                    type="url"
                    value={profile.portfolioUrl || ""}
                    onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">GitHub Profile</label>
                  <input
                    type="url"
                    value={profile.githubUrl || ""}
                    onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-subtle/50 text-xs text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-subtle/50 bg-surface-subtle flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            {savedSuccess ? (
              <span className="text-emerald-400 flex items-center space-x-1 font-semibold animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Saved &amp; synchronized!</span>
              </span>
            ) : (
              <span className="text-muted-foreground text-[11px]">
                Settings automatically apply to proposal engine.
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-secondary text-foreground text-xs font-medium border border-subtle/50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </div>

      </div>

      {showKoraCheckout && (
        <KoraCheckoutModal
          onClose={() => setShowKoraCheckout(false)}
          userEmail={profile.email || ""}
          userName={profile.fullName || ""}
        />
      )}
    </div>
  );
}

