"use client";

import React, { useState } from "react";
import { 
  Phone, 
  Copy, 
  Check, 
  MapPin, 
  Star, 
  Sparkles, 
  Download, 
  Trash2, 
  FileText, 
  MessageSquareQuote, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  PhoneOutgoing, 
  Award, 
  Archive,
  Store,
  Terminal,
  ExternalLink,
  Mail,
  MessageCircle,
  Globe,
  Calendar,
  Layers,
  CheckSquare,
  ChevronRight
} from "lucide-react";
import { LeadItem, OnlineJobLead, PhysicalLead, PipelineStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import PitchScriptModal from "./PitchScriptModal";
import JobProposalModal from "./JobProposalModal";
import LeadNotesModal from "./LeadNotesModal";
import ApplicationTrackerDrawer from "./pipeline/ApplicationTrackerDrawer";
import FollowUpQueue from "./pipeline/FollowUpQueue";
import { exportLeadsToCsv } from "@/lib/export";
import { PipelineStats } from "@/lib/pipeline-store";
import { generateWhatsAppChatLink, createQuickWhatsAppLeadMessage } from "@/lib/outreach/whatsapp";

interface LeadPipelineProps {
  leads: LeadItem[];
  stats: PipelineStats;
  onUpdateStatus: (leadId: string, status: PipelineStatus) => void;
  onUpdateNotes: (leadId: string, notes: string, estimatedValue?: number) => void;
  onDeleteLead: (leadId: string) => void;
  onClearPipeline?: () => void;
}

const SALES_STAGES = [
  { key: "ALL", label: "All Sales Leads", icon: TrendingUp },
  { key: "NEW", label: "Inbox (New)", icon: Clock },
  { key: "CONTACTED", label: "Contacted", icon: PhoneOutgoing },
  { key: "INTERESTED", label: "Pitch / Proposal Sent", icon: Sparkles },
  { key: "CLOSED", label: "Closed / Won", icon: Award },
  { key: "NOT_INTERESTED", label: "Archived", icon: Archive },
];

const JOB_STAGES = [
  { key: "ALL", label: "All Job Apps", icon: TrendingUp },
  { key: "SAVED", label: "Saved / Researching", icon: Clock },
  { key: "PREPARING", label: "Preparing App", icon: FileText },
  { key: "APPLIED", label: "Applied / Submitted", icon: PhoneOutgoing },
  { key: "INTERVIEW", label: "Interviewing", icon: Sparkles },
  { key: "OFFER", label: "Offer Received", icon: Award },
  { key: "REJECTED", label: "Rejected / Withdrawn", icon: Archive },
];

export default function LeadPipeline({
  leads,
  stats,
  onUpdateStatus,
  onUpdateNotes,
  onDeleteLead,
  onClearPipeline,
}: LeadPipelineProps) {
  const [pipelineMode, setPipelineMode] = useState<"sales" | "jobs" | "all">("sales");
  const [currentTab, setCurrentTab] = useState<string>("ALL");
  const [pitchLead, setPitchLead] = useState<PhysicalLead | null>(null);
  const [proposalJob, setProposalJob] = useState<OnlineJobLead | null>(null);
  const [trackerJob, setTrackerJob] = useState<OnlineJobLead | null>(null);
  const [notesLead, setNotesLead] = useState<LeadItem | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [currencyMode, setCurrencyMode] = useState<"USD" | "KES">("USD");

  const activeStages = pipelineMode === "jobs" ? JOB_STAGES : SALES_STAGES;

  const filteredLeads = leads.filter((l) => {
    if (pipelineMode === "sales" && l.type !== "physical") return false;
    if (pipelineMode === "jobs" && l.type !== "online") return false;

    if (currentTab !== "ALL") {
      if (l.status !== currentTab) return false;
    }
    return true;
  });

  const handleCopyPhone = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleQuickWhatsApp = (lead: PhysicalLead, e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = createQuickWhatsAppLeadMessage({
      businessName: lead.businessName,
      category: lead.category,
      city: lead.city,
      senderName: "Web Developer",
    });
    const wa = generateWhatsAppChatLink(lead.whatsapp || lead.phone, msg, lead.country || "KE");
    if (wa.isValid) {
      window.open(wa.url, "_blank");
    }
  };

  const handleExport = () => {
    exportLeadsToCsv(filteredLeads, `webhunt-pipeline-${pipelineMode}-${currentTab.toLowerCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pipeline Volume */}
        <div className="p-4 rounded-2xl bg-surface border border-subtle/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Pipeline Volume</span>
            <div className="p-1.5 rounded-xl bg-surface-elevated text-foreground">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-foreground">{leads.length}</span>
            <span className="text-xs text-muted-foreground">
              ({stats.physicalCount} local, {stats.onlineCount} remote)
            </span>
          </div>
        </div>

        {/* Outreach Activity */}
        <div className="p-4 rounded-2xl bg-surface border border-subtle/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Outreach Activity</span>
            <div className="p-1.5 rounded-xl bg-surface-elevated text-success">
              <PhoneOutgoing className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-success">
              {stats.contactedLeads + stats.interestedLeads + stats.closedLeads}
            </span>
            <span className="text-xs text-muted-foreground">contacted</span>
          </div>
        </div>

        {/* Active Pitches / Apps */}
        <div className="p-4 rounded-2xl bg-surface border border-subtle/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Active In Progress</span>
            <div className="p-1.5 rounded-xl bg-surface-elevated text-foreground">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-foreground">{stats.interestedLeads}</span>
            <span className="text-xs text-muted-foreground">active deals/apps</span>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="p-4 rounded-2xl bg-surface border border-subtle/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Est. Pipeline Value</span>
            <div className="p-1.5 rounded-xl bg-surface-elevated text-success">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-success">
              {formatCurrency(stats.totalPipelineValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Follow-up Reminders Task Queue */}
      <FollowUpQueue />

      {/* Primary Pipeline Switcher: Sales vs Jobs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-surface border border-subtle/50 rounded-2xl">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setPipelineMode("sales");
              setCurrentTab("ALL");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              pipelineMode === "sales"
                ? "bg-surface-elevated text-foreground border border-white/20 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/60"
            }`}
          >
            <Store className="w-4 h-4 text-foreground" />
            <span>Sales Pipeline (Local Businesses)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-subtle text-muted-foreground">
              {stats.physicalCount}
            </span>
          </button>

          <button
            onClick={() => {
              setPipelineMode("jobs");
              setCurrentTab("ALL");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              pipelineMode === "jobs"
                ? "bg-surface-elevated text-foreground border border-white/20 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/60"
            }`}
          >
            <Terminal className="w-4 h-4 text-foreground" />
            <span>Job Applications (Remote Gigs)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-subtle text-muted-foreground">
              {stats.onlineCount}
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-2 pr-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 text-foreground border border-subtle/50 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stage Tabs Strip */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-subtle/50 pb-4">
        {activeStages.map((stage) => {
          const Icon = stage.icon;
          const count =
            stage.key === "ALL"
              ? (pipelineMode === "sales" ? stats.physicalCount : stats.onlineCount)
              : leads.filter((l) => {
                  if (pipelineMode === "sales" && l.type !== "physical") return false;
                  if (pipelineMode === "jobs" && l.type !== "online") return false;
                  return l.status === stage.key;
                }).length;

          const isActive = currentTab === stage.key;

          return (
            <button
              key={stage.key}
              onClick={() => setCurrentTab(stage.key)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-surface-elevated text-foreground border border-white/20 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
              <span>{stage.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? "bg-white text-black font-semibold" : "bg-surface-subtle text-muted-foreground"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-surface border border-subtle/50 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-subtle flex items-center justify-center text-muted-foreground mx-auto border border-subtle/50">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-extrabold tracking-tight text-foreground">No leads in this stage</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {pipelineMode === "sales"
              ? "Discover local businesses without websites from the Lead Finder Radar on the home page."
              : "Discover remote software opportunities and track your job applications here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => {
            const isPhysical = lead.type === "physical";
            const physLead = isPhysical ? (lead as PhysicalLead) : null;
            const jobLead = !isPhysical ? (lead as OnlineJobLead) : null;

            return (
              <div
                key={lead.id}
                className="bg-surface border border-subtle/50 hover:border-white/20 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  {/* Top Channel Badge & Stage Selector */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center space-x-1 bg-surface-elevated text-muted-foreground border border-subtle/50">
                        {isPhysical ? <Store className="w-3 h-3 text-foreground" /> : <Terminal className="w-3 h-3 text-foreground" />}
                        <span>{isPhysical ? physLead?.country : (jobLead?.source || "Remote Job")}</span>
                      </span>
                    </div>

                    {/* Status Selector Dropdown */}
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead.id, e.target.value as PipelineStatus)}
                      className="bg-surface-subtle border border-subtle/50 text-sm text-foreground px-2 py-1 rounded-xl focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                    >
                      {isPhysical ? (
                        <>
                          <option value="NEW" className="bg-surface">New Lead</option>
                          <option value="CONTACTED" className="bg-surface">Contacted</option>
                          <option value="INTERESTED" className="bg-surface">Pitch / Proposal</option>
                          <option value="CLOSED" className="bg-surface">Closed / Won</option>
                          <option value="NOT_INTERESTED" className="bg-surface">Archived</option>
                        </>
                      ) : (
                        <>
                          <option value="SAVED" className="bg-surface">Saved</option>
                          <option value="PREPARING" className="bg-surface">Preparing App</option>
                          <option value="APPLIED" className="bg-surface">Applied</option>
                          <option value="INTERVIEW" className="bg-surface">Interview</option>
                          <option value="OFFER" className="bg-surface">Offer</option>
                          <option value="REJECTED" className="bg-surface">Rejected</option>
                          <option value="WITHDRAWN" className="bg-surface">Withdrawn</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="font-extrabold text-foreground text-lg tracking-tight leading-snug mt-2">
                    {isPhysical ? physLead?.businessName : jobLead?.title}
                  </h4>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {isPhysical ? physLead?.category : `${jobLead?.company} • ${jobLead?.location}`}
                  </div>

                  {/* Physical Phone or Job Details */}
                  {isPhysical && physLead && (
                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between bg-surface-subtle p-2.5 rounded-xl border border-subtle/50">
                        <a
                          href={`tel:${physLead.phone}`}
                          className="font-mono text-foreground hover:underline flex items-center space-x-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{physLead.phoneFormatted || physLead.phone}</span>
                        </a>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => handleQuickWhatsApp(physLead, e)}
                            className="p-1 rounded text-success hover:bg-emerald-500/10 transition"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleCopyPhone(physLead.phone, e)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground"
                            title="Copy phone"
                          >
                            {copiedPhone === physLead.phone ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Enriched Contact Badges on Card */}
                      {(physLead.email || physLead.whatsapp || physLead.bookingUrl || physLead.contactPageUrl || (physLead.socialProfiles && Object.keys(physLead.socialProfiles).length > 0)) && (
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          {physLead.email && (
                            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-surface-elevated text-foreground border border-subtle/50 text-[10px]">
                              <a
                                href={`mailto:${physLead.email}`}
                                className="hover:text-white flex items-center space-x-1"
                                title={`Email: ${physLead.email}`}
                              >
                                <Mail className="w-3 h-3 text-muted-foreground" />
                                <span className="max-w-[110px] truncate">{physLead.email}</span>
                              </a>
                              <button
                                onClick={(e) => handleCopyEmail(physLead.email!, e)}
                                className="text-muted-foreground hover:text-foreground p-0.5 ml-0.5"
                                title="Copy email"
                              >
                                {copiedEmail === physLead.email ? <Check className="w-2.5 h-2.5 text-success" /> : <Copy className="w-2.5 h-2.5" />}
                              </button>
                            </div>
                          )}

                          {physLead.whatsapp && (
                            <a
                              href={physLead.whatsapp.startsWith("http") ? physLead.whatsapp : `https://wa.me/${physLead.whatsapp.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-success/10 text-success hover:bg-emerald-500/20 border border-emerald-500/20 text-[10px] font-medium"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3 text-success" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          {physLead.bookingUrl && (
                            <a
                              href={physLead.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-surface-elevated text-foreground hover:text-white border border-subtle/50 text-[10px]"
                              title="Book / Schedule"
                            >
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span>Book</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {!isPhysical && jobLead && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="text-success font-semibold">{jobLead.salary || "Competitive"}</span>
                        <span>{formatDate(jobLead.postedDate)}</span>
                      </div>
                      {jobLead.tags && jobLead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {jobLead.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded bg-surface-subtle text-[10px] text-muted-foreground border border-subtle/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Deal Value */}
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Est. Value: {formatCurrency(lead.estimatedValue || (isPhysical ? 1500 : 3500))}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>

                  {/* Notes Preview */}
                  {lead.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-surface-subtle border border-subtle/50 text-[11px] text-muted-foreground italic">
                      &quot;{lead.notes}&quot;
                    </div>
                  )}
                </div>

                {/* Footer Action Strip */}
                <div className="pt-3 border-t border-subtle/50 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    {isPhysical && physLead && (
                      <button
                        onClick={() => setPitchLead(physLead)}
                        className="px-2.5 py-1 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 text-foreground border border-subtle/50 text-xs font-medium flex items-center space-x-1 transition"
                      >
                        <MessageSquareQuote className="w-3 h-3 text-foreground" />
                        <span>Pitch</span>
                      </button>
                    )}

                    {!isPhysical && jobLead && (
                      <>
                        <button
                          onClick={() => setProposalJob(jobLead)}
                          className="px-2.5 py-1 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 text-foreground border border-subtle/50 text-xs font-medium flex items-center space-x-1 transition"
                        >
                          <Sparkles className="w-3 h-3 text-foreground" />
                          <span>Proposal</span>
                        </button>
                        <button
                          onClick={() => setTrackerJob(jobLead)}
                          className="px-2.5 py-1 rounded-xl bg-surface-subtle hover:bg-surface-elevated text-muted-foreground hover:text-foreground border border-subtle/50 text-xs font-medium flex items-center space-x-1 transition"
                          title="Track application checklist & notes"
                        >
                          <CheckSquare className="w-3 h-3 text-success" />
                          <span>Track App</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setNotesLead(lead)}
                      className="px-2.5 py-1 rounded-xl bg-surface-subtle hover:bg-surface-elevated text-muted-foreground hover:text-foreground border border-subtle/50 text-xs font-medium flex items-center space-x-1 transition"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Notes</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteLead(lead.id)}
                    className="p-1.5 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete lead"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals & Drawers */}
      {pitchLead && <PitchScriptModal lead={pitchLead} onClose={() => setPitchLead(null)} />}
      {proposalJob && <JobProposalModal job={proposalJob} onClose={() => setProposalJob(null)} />}
      {trackerJob && (
        <ApplicationTrackerDrawer
          job={trackerJob}
          onClose={() => setTrackerJob(null)}
          onStatusChange={(newStatus) => {
            onUpdateStatus(trackerJob.id, newStatus);
            trackerJob.status = newStatus;
          }}
        />
      )}
      {notesLead && (
        <LeadNotesModal
          lead={notesLead}
          onSave={(notes, estimatedValue) => {
            onUpdateNotes(notesLead.id, notes, estimatedValue);
            setNotesLead(null);
          }}
          onClose={() => setNotesLead(null)}
        />
      )}
    </div>
  );
}

