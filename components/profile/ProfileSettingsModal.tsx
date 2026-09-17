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
  Smartphone
} from "lucide-react";
import { getUserProfileAction, saveUserProfileAction, UserProfileData } from "@/app/actions/profile";
import { logoutAction } from "@/app/actions/auth";
import { clearAllClientStorage } from "@/lib/pipeline-store";
import { useTheme } from "@/lib/theme-context";
import KoraCheckoutModal from "@/components/payments/KoraCheckoutModal";

interface ProfileSettingsModalProps {
  onClose: () => void;
  onProfileUpdated?: (profile: UserProfileData) => void;
}

export default function ProfileSettingsModal({ onClose, onProfileUpdated }: ProfileSettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [showKoraCheckout, setShowKoraCheckout] = useState(false);

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
        <div className="p-8 rounded-2xl bg-[#111214] border border-white/[0.1] text-[#EEEEEE] flex items-center space-x-3 shadow-2xl">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
      <div className="relative w-full max-w-2xl bg-[#111214] border border-white/[0.1] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden text-[#EEEEEE] max-h-[92vh] sm:max-h-[88vh] flex flex-col transition-colors">
        
        {/* Profile Card Header */}
        <div className="p-6 pb-5 border-b border-white/[0.08] bg-[#0D0E11] relative">
          {/* Top Bar: Sign Out & Close */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#18191D] text-[#989BA3] border border-white/[0.08]">
                WebHunt Workspace
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#989BA3] hover:text-[#EEEEEE] hover:bg-[#18191D] transition"
                title="Sign out of your account"
              >
                <span>Sign out</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-[#989BA3] hover:text-[#EEEEEE] hover:bg-[#18191D] transition"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Identity Row */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#18191D] border border-white/[0.12] text-[#EEEEEE] flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-[#EEEEEE] truncate">
                  {profile.fullName || "Your Name"}
                </h3>
                <Edit3 className="w-3.5 h-3.5 text-[#989BA3] shrink-0" />
              </div>
              <p className="text-xs text-[#989BA3] truncate">
                {profile.email || "No email registered"}
              </p>
              {profile.professionalTitle && (
                <p className="text-[11px] text-[#EEEEEE] font-medium mt-0.5 truncate">
                  {profile.professionalTitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Grouped Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#EEEEEE]">
          
          {/* GROUP 1: PREFERENCES & APPEARANCE (Theme Switcher) */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-[#989BA3] uppercase tracking-wider flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-[#989BA3]" />
              <span>Preferences &amp; Appearance</span>
            </div>

            <div className="bg-[#0D0E11] border border-white/[0.08] rounded-2xl p-4 divide-y divide-white/[0.06]">
              {/* Theme Switcher Row */}
              <div className="pb-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#18191D] border border-white/[0.08] flex items-center justify-center text-[#EEEEEE]">
                    {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-semibold text-[#EEEEEE] text-xs block">Theme Mode</span>
                    <span className="text-[11px] text-[#989BA3] block">
                      {theme === "dark" ? "Dark Mode (Obsidian #08090B)" : "Light Mode (Off-White #F5F5F7)"}
                    </span>
                  </div>
                </div>

                {/* Segmented Theme Switch */}
                <div className="flex items-center p-1 rounded-xl bg-[#18191D] border border-white/[0.08] shrink-0">
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      theme === "dark"
                        ? "bg-white text-black shadow-sm"
                        : "text-[#989BA3] hover:text-[#EEEEEE]"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      theme === "light"
                        ? "bg-white text-black shadow-sm"
                        : "text-[#989BA3] hover:text-[#EEEEEE]"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                </div>
              </div>

              {/* Currency & Region Row */}
              <div className="pt-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#18191D] border border-white/[0.08] flex items-center justify-center text-[#EEEEEE]">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#EEEEEE] text-xs block">Default Billing Currency</span>
                    <span className="text-[11px] text-[#989BA3] block">Used in proposal drafts and rate cards</span>
                  </div>
                </div>

                <select
                  value={profile.currency || "USD"}
                  onChange={(e) => setProfile({ ...profile, currency: e.target.value as "USD" | "KES" })}
                  className="px-3 py-1.5 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE] font-semibold focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <option value="USD" className="bg-[#111214]">USD ($)</option>
                  <option value="KES" className="bg-[#111214]">KES (KSh)</option>
                </select>
              </div>
            </div>
          </div>

          {/* GROUP: SUBSCRIPTION & PAYMENT METHODS (POWERED BY KORA) */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-[#989BA3] uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#989BA3]" />
                <span>Subscription &amp; Payment Methods</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Kora Gateway Active
              </span>
            </div>

            <div className="bg-[#0D0E11] border border-white/[0.08] rounded-2xl p-4 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#EEEEEE] text-sm">WebHunt Radar Plan</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#18191D] text-[#EEEEEE] border border-white/[0.1]">
                      Standard
                    </span>
                  </div>
                  <p className="text-[11px] text-[#989BA3] mt-0.5">
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
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#989BA3]">
                <span>Accepted via Kora:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#18191D] text-[#EEEEEE] border border-white/[0.08] text-[10px] font-medium flex items-center space-x-1">
                    <Smartphone className="w-3 h-3 text-emerald-400" />
                    <span>M-Pesa (Kenya)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#18191D] text-[#EEEEEE] border border-white/[0.08] text-[10px] font-medium flex items-center space-x-1">
                    <CreditCard className="w-3 h-3 text-[#989BA3]" />
                    <span>Visa / Mastercard</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#18191D] text-[#EEEEEE] border border-white/[0.08] text-[10px] font-medium">
                    Bank Transfer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* GROUP: AI SETTINGS */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-[#989BA3] uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#989BA3]" />
              <span>AI Model Configuration</span>
            </div>

            <div className="bg-[#0D0E11] border border-white/[0.08] rounded-2xl p-4 divide-y divide-white/[0.06]">
              {/* Provider & Model Row */}
              <div className="pb-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-[#18191D] border border-white/[0.08] flex items-center justify-center text-[#EEEEEE]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#EEEEEE] text-xs block">AI Provider &amp; Model</span>
                      <span className="text-[11px] text-[#989BA3] block">Select the AI engine for tasks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={profile.aiPreferences?.provider || "auto"}
                      onChange={(e) => setProfile({
                        ...profile,
                        aiPreferences: { ...(profile.aiPreferences || { model: 'auto', routingStrategy: 'BALANCED', automaticFailover: true }), provider: e.target.value, model: 'auto' }
                      })}
                      className="px-3 py-1.5 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE] font-semibold focus:outline-none focus:ring-1 focus:ring-white/20"
                    >
                      <option value="auto" className="bg-[#111214]">Auto</option>
                      <option value="openai" className="bg-[#111214]">OpenAI</option>
                      <option value="anthropic" className="bg-[#111214]">Anthropic</option>
                      <option value="gemini" className="bg-[#111214]">Google Gemini</option>
                      <option value="openrouter" className="bg-[#111214]">OpenRouter</option>
                    </select>

                    <select
                      value={profile.aiPreferences?.model || "auto"}
                      onChange={(e) => setProfile({
                        ...profile,
                        aiPreferences: { ...(profile.aiPreferences || { provider: 'auto', routingStrategy: 'BALANCED', automaticFailover: true }), model: e.target.value }
                      })}
                      className="px-3 py-1.5 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE] font-semibold focus:outline-none focus:ring-1 focus:ring-white/20"
                    >
                      <option value="auto" className="bg-[#111214]">Auto-Select Model</option>
                      {profile.aiPreferences?.provider === 'openai' && (
                        <>
                          <option value="gpt-4o" className="bg-[#111214]">GPT-4o</option>
                          <option value="gpt-4o-mini" className="bg-[#111214]">GPT-4o Mini</option>
                        </>
                      )}
                      {profile.aiPreferences?.provider === 'anthropic' && (
                        <>
                          <option value="claude-3-5-sonnet-20241022" className="bg-[#111214]">Claude 3.5 Sonnet</option>
                          <option value="claude-3-haiku-20240307" className="bg-[#111214]">Claude 3 Haiku</option>
                        </>
                      )}
                      {profile.aiPreferences?.provider === 'gemini' && (
                        <>
                          <option value="gemini-1.5-pro" className="bg-[#111214]">Gemini 1.5 Pro</option>
                          <option value="gemini-1.5-flash" className="bg-[#111214]">Gemini 1.5 Flash</option>
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
                    <label className="text-[11px] text-[#989BA3] font-medium">Routing:</label>
                    <select
                      value={profile.aiPreferences?.routingStrategy || "BALANCED"}
                      onChange={(e) => setProfile({
                        ...profile,
                        aiPreferences: { ...(profile.aiPreferences || { provider: 'auto', model: 'auto', automaticFailover: true }), routingStrategy: e.target.value }
                      })}
                      className="px-2 py-1 rounded-lg bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE] focus:outline-none"
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
                    className="rounded border-white/[0.1] bg-[#18191D] text-emerald-500 focus:ring-0"
                  />
                  <span className="text-[11px] font-medium text-[#EEEEEE]">Automatic Failover</span>
                </label>
              </div>
            </div>
          </div>

          {/* GROUP 2: PROFESSIONAL IDENTITY */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-[#989BA3] uppercase tracking-wider flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#989BA3]" />
              <span>Professional Identity</span>
            </div>

            <div className="bg-[#0D0E11] border border-white/[0.08] rounded-2xl p-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#989BA3] mb-1">Full Name / Agency</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18191D] border border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-white/20 text-xs text-[#EEEEEE]"
                    placeholder="e.g. Gackstone Baraka"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#989BA3] mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={profile.professionalTitle}
                    onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18191D] border border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-white/20 text-xs text-[#EEEEEE]"
                    placeholder="e.g. Senior Full-Stack Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#989BA3] mb-1">Bio / Value Proposition</label>
                <textarea
                  rows={2}
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#18191D] border border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-white/20 text-xs text-[#EEEEEE] leading-relaxed"
                  placeholder="Summary of your technical capabilities and engineering focus..."
                />
              </div>
            </div>
          </div>

          {/* GROUP 3: VERIFIED SKILLS & COMPETENCIES */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-[#989BA3] uppercase tracking-wider flex items-center space-x-1.5">
              <Code className="w-3.5 h-3.5 text-[#989BA3]" />
              <span>Verified Skills &amp; Tech Stack</span>
            </div>

            <div className="bg-[#0D0E11] border border-white/[0.08] rounded-2xl p-4 space-y-3">
              <form onSubmit={handleAddSkill} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill (e.g. Next.js, Python, PostgreSQL)"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#18191D] border border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-white/20 text-xs text-[#EEEEEE]"
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
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#18191D] text-[#EEEEEE] border border-white/[0.08] text-[11px]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-[#989BA3] hover:text-red-400 ml-1 text-sm leading-none"
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
            <div className="px-1 text-[11px] font-bold text-[#989BA3] uppercase tracking-wider flex items-center space-x-1.5">
              <Coins className="w-3.5 h-3.5 text-[#989BA3]" />
              <span>Commercial Pricing &amp; Kenya Rates</span>
            </div>

            <div className="bg-[#0D0E11] border border-white/[0.08] rounded-2xl p-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#989BA3] mb-1">Hourly Rate (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#989BA3]">$</span>
                    <input
                      type="number"
                      value={profile.hourlyRateUsd || 45}
                      onChange={(e) => setProfile({ ...profile, hourlyRateUsd: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#989BA3] mb-1">Hourly Rate (KES)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#989BA3]">KSh</span>
                    <input
                      type="number"
                      value={profile.hourlyRateKes || 5500}
                      onChange={(e) => setProfile({ ...profile, hourlyRateKes: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#989BA3] mb-1">SME Web Project (KES)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#989BA3]">KSh</span>
                    <input
                      type="number"
                      value={profile.projectRateKes || 150000}
                      onChange={(e) => setProfile({ ...profile, projectRateKes: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#989BA3] mb-1">M-Pesa Buy Goods / Till Number (Optional)</label>
                  <input
                    type="text"
                    value={profile.mpesaTillNumber || ""}
                    onChange={(e) => setProfile({ ...profile, mpesaTillNumber: e.target.value })}
                    placeholder="e.g. 987654"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#989BA3] mb-1">Timezone &amp; Location</label>
                  <input
                    type="text"
                    value={profile.timezone || "Africa/Nairobi (EAT, UTC+3)"}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GROUP 5: CONTACT CHANNELS */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-[#989BA3] uppercase tracking-wider flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-[#989BA3]" />
              <span>Contact Channels &amp; Portfolio Proof</span>
            </div>

            <div className="bg-[#0D0E11] border border-white/[0.08] rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#989BA3] mb-1">Public Email</label>
                  <input
                    type="email"
                    value={profile.email || ""}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="contact@yourdomain.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#989BA3] mb-1">Phone / WhatsApp (E.164)</label>
                  <input
                    type="text"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value, whatsapp: e.target.value })}
                    placeholder="+254712345678"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#989BA3] mb-1">Portfolio Website</label>
                  <input
                    type="url"
                    value={profile.portfolioUrl || ""}
                    onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#989BA3] mb-1">GitHub Profile</label>
                  <input
                    type="url"
                    value={profile.githubUrl || ""}
                    onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#0D0E11] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            {savedSuccess ? (
              <span className="text-emerald-400 flex items-center space-x-1 font-semibold animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Saved &amp; synchronized!</span>
              </span>
            ) : (
              <span className="text-[#989BA3] text-[11px]">
                Settings automatically apply to proposal engine.
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#18191D] hover:bg-[#22242A] text-[#EEEEEE] text-xs font-medium border border-white/[0.08] transition"
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

