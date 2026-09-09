"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  User, 
  Briefcase, 
  Code, 
  DollarSign, 
  Globe, 
  Save, 
  Check, 
  Plus, 
  Trash2, 
  Phone, 
  Mail, 
  Sparkles,
  Layers,
  Coins,
  LogOut
} from "lucide-react";
import { getUserProfileAction, saveUserProfileAction, UserProfileData } from "@/app/actions/profile";
import { logoutAction } from "@/app/actions/auth";

interface ProfileSettingsModalProps {
  onClose: () => void;
  onProfileUpdated?: (profile: UserProfileData) => void;
}

export default function ProfileSettingsModal({ onClose, onProfileUpdated }: ProfileSettingsModalProps) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState("");

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
    await logoutAction();
    window.location.href = "/auth?mode=signin";
  };

  if (isLoading || !profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="p-8 rounded-3xl bg-[#0D0D0D] border border-[rgba(228,222,210,0.2)] text-[#F6F4F1] flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-[#F95C4B] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading Professional Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0D0D0D] border border-[rgba(228,222,210,0.2)] rounded-3xl shadow-2xl overflow-hidden text-[#F6F4F1] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(228,222,210,0.12)] bg-[#080808]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#F95C4B] text-white shadow-md shadow-[#F95C4B]/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#F6F4F1] text-base">Candidate & Agency Profile</h3>
              <p className="text-xs text-[#A8A196]">
                Verified facts used by the Truthful Proposal Engine (zero hallucinations)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#A8A196] hover:text-[#F6F4F1] hover:bg-[#161616] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#F6F4F1]">
          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#F95C4B] uppercase tracking-wider flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>1. Professional Identity</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">Full Name / Agency Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] text-xs text-[#F6F4F1]"
                  placeholder="e.g. Gackstone Baraka"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">Professional Title</label>
                <input
                  type="text"
                  value={profile.professionalTitle}
                  onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] text-xs text-[#F6F4F1]"
                  placeholder="e.g. Senior Full-Stack Engineer"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">Bio / Value Proposition</label>
                <textarea
                  rows={2}
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] text-xs text-[#F6F4F1] leading-relaxed"
                  placeholder="Brief summary of your expertise and engineering focus..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Verified Skills & Tech Stack */}
          <div className="space-y-3 pt-2 border-t border-[rgba(228,222,210,0.08)]">
            <h4 className="text-xs font-bold text-[#F95C4B] uppercase tracking-wider flex items-center space-x-1.5">
              <Code className="w-3.5 h-3.5" />
              <span>2. Verified Skills & Core Competencies</span>
            </h4>
            <p className="text-[11px] text-[#A8A196]">
              Add your actual verified skills. The proposal engine will only cite competencies listed here.
            </p>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="flex items-center space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. React, Next.js, Node.js, Python, PostgreSQL"
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] text-xs text-[#F6F4F1]"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-[#161616] hover:bg-[#161616]/80 text-[#F6F4F1] border border-[rgba(228,222,210,0.2)] font-medium text-xs flex items-center space-x-1 transition shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#F95C4B]" />
                <span>Add Skill</span>
              </button>
            </form>

            {/* Skills Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#161616] text-[#F6F4F1] border border-[rgba(228,222,210,0.12)] text-[11px]"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#A8A196] hover:text-red-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: Pricing & Rates (USD / KES) */}
          <div className="space-y-4 pt-2 border-t border-[rgba(228,222,210,0.08)]">
            <h4 className="text-xs font-bold text-[#F95C4B] uppercase tracking-wider flex items-center space-x-1.5">
              <Coins className="w-3.5 h-3.5" />
              <span>3. Commercial Rates & Kenya Readiness</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">Hourly Rate (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#A8A196]">$</span>
                  <input
                    type="number"
                    value={profile.hourlyRateUsd || 45}
                    onChange={(e) => setProfile({ ...profile, hourlyRateUsd: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] text-xs text-[#F6F4F1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">Hourly Rate (KES)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#A8A196]">KSh</span>
                  <input
                    type="number"
                    value={profile.hourlyRateKes || 5500}
                    onChange={(e) => setProfile({ ...profile, hourlyRateKes: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] text-xs text-[#F6F4F1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">SME Web Project (KES)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#A8A196]">KSh</span>
                  <input
                    type="number"
                    value={profile.projectRateKes || 150000}
                    onChange={(e) => setProfile({ ...profile, projectRateKes: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] text-xs text-[#F6F4F1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">Default Currency</label>
                <select
                  value={profile.currency || "USD"}
                  onChange={(e) => setProfile({ ...profile, currency: e.target.value as "USD" | "KES" })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] text-xs text-[#F6F4F1]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="KES">KES (KSh)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">M-Pesa Buy Goods / Till Number (Optional)</label>
                <input
                  type="text"
                  value={profile.mpesaTillNumber || ""}
                  onChange={(e) => setProfile({ ...profile, mpesaTillNumber: e.target.value })}
                  placeholder="e.g. 987654"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] text-xs text-[#F6F4F1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">Timezone & Location</label>
                <input
                  type="text"
                  value={profile.timezone || "Africa/Nairobi (EAT, UTC+3)"}
                  onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] text-xs text-[#F6F4F1]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Portfolio URLs */}
          <div className="space-y-4 pt-2 border-t border-[rgba(228,222,210,0.08)]">
            <h4 className="text-xs font-bold text-[#F95C4B] uppercase tracking-wider flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>4. Contact Channels & Portfolio Proof</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="e.g. contact@yourdomain.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] text-xs text-[#F6F4F1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">Phone / WhatsApp (E.164)</label>
                <input
                  type="text"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value, whatsapp: e.target.value })}
                  placeholder="e.g. +254712345678"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] text-xs text-[#F6F4F1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">Portfolio / Personal Website</label>
                <input
                  type="url"
                  value={profile.portfolioUrl || ""}
                  onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] text-xs text-[#F6F4F1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A8A196] mb-1">GitHub Profile</label>
                <input
                  type="url"
                  value={profile.githubUrl || ""}
                  onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] text-xs text-[#F6F4F1]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(228,222,210,0.12)] bg-[#080808] flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-[#A8A196]">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-[#202020] text-[#A8A196] hover:text-[#F95C4B] border border-[rgba(228,222,210,0.12)] transition"
              title="Sign out of WebHunt workspace"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            {savedSuccess && (
              <span className="text-[#5EBA8C] flex items-center space-x-1 font-semibold">
                <Check className="w-4 h-4" />
                <span>Profile updated &amp; synchronized!</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#161616] hover:bg-[#161616]/80 text-[#F6F4F1] text-xs font-medium border border-[rgba(228,222,210,0.12)] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#F95C4B] hover:bg-[#E04838] text-white font-semibold text-xs shadow-md shadow-[#F95C4B]/20 flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
