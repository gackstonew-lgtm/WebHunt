"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Briefcase, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Copy, 
  Check, 
  Calendar, 
  Mail, 
  User, 
  Clock, 
  Sparkles, 
  Save, 
  FileText,
  AlertCircle
} from "lucide-react";
import { OnlineJobLead, PipelineStatus } from "@/lib/types";
import { ApplicationData, createOrUpdateApplicationAction, fetchApplicationDetailsAction } from "@/app/actions/applications";
import { checkApplicantEligibility } from "@/lib/eligibility/regional-filter";
import { formatDate } from "@/lib/utils";

interface ApplicationTrackerDrawerProps {
  job: OnlineJobLead;
  onClose: () => void;
  onStatusChange: (status: PipelineStatus) => void;
}

export default function ApplicationTrackerDrawer({
  job,
  onClose,
  onStatusChange,
}: ApplicationTrackerDrawerProps) {
  const [appData, setAppData] = useState<ApplicationData>({
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    jobUrl: job.url,
    applicationMethod: "external_form",
    status: (job.status as any) || "SAVED",
    checklist: {
      tailoredResumeReady: false,
      coverLetterPrepared: false,
      portfolioLinksVerified: true,
      timezoneOverlapChecked: true,
      ratesAligned: true,
    },
    notes: job.notes || "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedCover, setCopiedCover] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const eligibility = checkApplicantEligibility(job);

  useEffect(() => {
    async function load() {
      const res = await fetchApplicationDetailsAction(job.id);
      if (res.success && res.data) {
        setAppData({
          ...res.data,
          checklist: res.data.checklist || {
            tailoredResumeReady: false,
            coverLetterPrepared: false,
            portfolioLinksVerified: true,
            timezoneOverlapChecked: true,
            ratesAligned: true,
          },
        });
      }
      setIsLoading(false);
    }
    load();
  }, [job.id]);

  const handleSave = async (updated?: Partial<ApplicationData>) => {
    setIsSaving(true);
    const toSave = { ...appData, ...updated };
    setAppData(toSave);
    const res = await createOrUpdateApplicationAction(toSave);
    setIsSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      if (toSave.status !== job.status) {
        onStatusChange(toSave.status as PipelineStatus);
      }
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const toggleChecklistItem = (key: keyof NonNullable<ApplicationData["checklist"]>) => {
    const current = appData.checklist || {
      tailoredResumeReady: false,
      coverLetterPrepared: false,
      portfolioLinksVerified: false,
      timezoneOverlapChecked: false,
      ratesAligned: false,
    };
    const next = {
      ...current,
      [key]: !current[key],
    };
    setAppData({ ...appData, checklist: next });
    handleSave({ checklist: next });
  };

  const copyNotesOrPitch = () => {
    if (appData.coverLetterText || job.descriptionSnippet) {
      navigator.clipboard.writeText(appData.coverLetterText || job.descriptionSnippet || "");
      setCopiedCover(true);
      setTimeout(() => setCopiedCover(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#111214] border-l border-white/[0.1] text-[#EEEEEE] h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0D0E11]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#18191D] text-[#EEEEEE] border border-white/[0.08]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#EEEEEE] text-base truncate max-w-xs sm:max-w-md">
                {job.title}
              </h3>
              <p className="text-xs text-[#989BA3]">
                Application Tracking for <span className="text-[#EEEEEE] font-semibold">{job.company}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#989BA3] hover:text-[#EEEEEE] hover:bg-[#18191D] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#EEEEEE] flex-1">
          {/* Quick Apply Action Strip */}
          <div className="p-4 rounded-2xl bg-[#0D0E11] border border-white/[0.08] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#989BA3] uppercase tracking-wider">
                Application Pipeline Stage
              </span>
              <select
                value={appData.status}
                onChange={(e) => {
                  const newStatus = e.target.value as any;
                  setAppData({ ...appData, status: newStatus });
                  handleSave({ status: newStatus });
                }}
                className="bg-[#18191D] border border-white/20 text-xs text-[#EEEEEE] px-3 py-1.5 rounded-xl font-semibold focus:outline-none cursor-pointer"
              >
                <option value="SAVED" className="bg-[#111214]">Saved / Researching</option>
                <option value="PREPARING" className="bg-[#111214]">Preparing Application</option>
                <option value="APPLIED" className="bg-[#111214]">Applied / Submitted</option>
                <option value="INTERVIEW" className="bg-[#111214]">Interview Scheduled</option>
                <option value="OFFER" className="bg-[#111214]">Offer Received</option>
                <option value="REJECTED" className="bg-[#111214]">Rejected</option>
                <option value="WITHDRAWN" className="bg-[#111214]">Withdrawn</option>
              </select>
            </div>

            {/* Direct Official Apply Link */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-[#989BA3]">Original Listing on {job.source}</span>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition"
              >
                <span>Open Application Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Regional Eligibility & Timezone Overlap Badge */}
          <div className="p-3.5 rounded-2xl bg-[#111A14] border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center space-x-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{eligibility.badgeText}</span>
              </span>
              <span className="text-[10px] text-[#989BA3] bg-[#0D0E11] px-2 py-0.5 rounded-md border border-white/[0.06]">
                ~{eligibility.timezoneOverlapHours}h EAT Overlap
              </span>
            </div>
            <p className="text-[11px] text-[#989BA3] leading-relaxed">
              {eligibility.reasons[0] || "General worldwide remote role"}
            </p>
          </div>

          {/* Document Preparation Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#EEEEEE] uppercase tracking-wider flex items-center space-x-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-[#989BA3]" />
              <span>Document Preparation Checklist</span>
            </h4>

            <div className="space-y-2 bg-[#0D0E11] p-3.5 rounded-2xl border border-white/[0.08]">
              {[
                { key: "tailoredResumeReady", label: "Tailored CV / Resume highlighted for this role" },
                { key: "coverLetterPrepared", label: "Proposal / Cover Letter generated & personalized" },
                { key: "portfolioLinksVerified", label: "Live portfolio & GitHub repository links verified" },
                { key: "timezoneOverlapChecked", label: "Timezone working hours aligned (EAT / UTC+3)" },
                { key: "ratesAligned", label: "Compensation / Salary expectations documented" },
              ].map((item) => {
                const isChecked = Boolean(appData.checklist?.[item.key as keyof typeof appData.checklist]);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleChecklistItem(item.key as any)}
                    className="w-full flex items-center space-x-2.5 text-left p-1.5 rounded-xl hover:bg-[#18191D] transition text-[11px]"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[#989BA3] shrink-0" />
                    )}
                    <span className={isChecked ? "text-[#EEEEEE] font-medium" : "text-[#989BA3]"}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recruiter & Follow-up Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#EEEEEE] uppercase tracking-wider flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#989BA3]" />
              <span>Recruiter Contact & Follow-up</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0D0E11] p-3.5 rounded-2xl border border-white/[0.08]">
              <div>
                <label className="block text-[10px] font-medium text-[#989BA3] mb-1">Recruiter / Hiring Contact</label>
                <input
                  type="text"
                  value={appData.recruiterName || ""}
                  onChange={(e) => setAppData({ ...appData, recruiterName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins (Talent Partner)"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE] focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#989BA3] mb-1">Recruiter Email</label>
                <input
                  type="email"
                  value={appData.recruiterEmail || ""}
                  onChange={(e) => setAppData({ ...appData, recruiterEmail: e.target.value })}
                  placeholder="e.g. jobs@company.com"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE] focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#989BA3] mb-1">Target Follow-up Date</label>
                <input
                  type="date"
                  value={
                    appData.followUpDate
                      ? new Date(appData.followUpDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => setAppData({ ...appData, followUpDate: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE] focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#989BA3] mb-1">Salary / Rate Offer</label>
                <input
                  type="text"
                  value={appData.salaryOffer || ""}
                  onChange={(e) => setAppData({ ...appData, salaryOffer: e.target.value })}
                  placeholder="e.g. $80,000 / yr"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#18191D] border border-white/[0.08] text-xs text-[#EEEEEE] focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-[#989BA3] uppercase tracking-wider">
              Application Notes & Interview Prep
            </label>
            <textarea
              rows={3}
              value={appData.notes || ""}
              onChange={(e) => setAppData({ ...appData, notes: e.target.value })}
              placeholder="Add key talking points, interviewer feedback, technical test notes..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0D0E11] border border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-white/20 text-xs text-[#EEEEEE] leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#0D0E11] flex items-center justify-between">
          <div className="text-xs text-[#989BA3]">
            {saveSuccess && (
              <span className="text-emerald-400 flex items-center space-x-1 font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>Application saved!</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#18191D] hover:bg-[#22242A] text-[#EEEEEE] text-xs font-medium border border-white/[0.08] transition"
            >
              Close
            </button>
            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
