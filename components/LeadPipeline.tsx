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
  Code
} from "lucide-react";
import { LeadItem, OnlineJobLead, PhysicalLead, PipelineStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import PitchScriptModal from "./PitchScriptModal";
import JobProposalModal from "./JobProposalModal";
import LeadNotesModal from "./LeadNotesModal";
import { exportLeadsToCsv } from "@/lib/export";
import { PipelineStats } from "@/lib/pipeline-store";

interface LeadPipelineProps {
  leads: LeadItem[];
  stats: PipelineStats;
  onUpdateStatus: (leadId: string, status: PipelineStatus) => void;
  onUpdateNotes: (leadId: string, notes: string, estimatedValue?: number) => void;
  onDeleteLead: (leadId: string) => void;
  onClearPipeline?: () => void;
}

const STAGES: { key: PipelineStatus | "ALL"; label: string; icon: any; color: string; bg: string }[] = [
  { key: "ALL", label: "All Leads", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
  { key: "NEW", label: "New (Inbox)", icon: Clock, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { key: "CONTACTED", label: "Contacted", icon: PhoneOutgoing, color: "text-amber-400", bg: "bg-amber-500/10" },
  { key: "INTERESTED", label: "Pitch / Proposal Sent", icon: Sparkles, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { key: "CLOSED", label: "Closed / Won", icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { key: "NOT_INTERESTED", label: "Archived", icon: Archive, color: "text-slate-400", bg: "bg-slate-500/10" },
];

export default function LeadPipeline({
  leads,
  stats,
  onUpdateStatus,
  onUpdateNotes,
  onDeleteLead,
  onClearPipeline,
}: LeadPipelineProps) {
  const [currentTab, setCurrentTab] = useState<PipelineStatus | "ALL">("ALL");
  const [modeFilter, setModeFilter] = useState<"ALL" | "physical" | "online">("ALL");
  const [pitchLead, setPitchLead] = useState<PhysicalLead | null>(null);
  const [proposalJob, setProposalJob] = useState<OnlineJobLead | null>(null);
  const [notesLead, setNotesLead] = useState<LeadItem | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const filteredLeads = leads.filter((l) => {
    if (currentTab !== "ALL" && l.status !== currentTab) return false;
    if (modeFilter !== "ALL" && l.type !== modeFilter) return false;
    return true;
  });

  const handleCopyPhone = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleExport = () => {
    exportLeadsToCsv(filteredLeads, `gacks-pipeline-${currentTab.toLowerCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pipeline Volume */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Pipeline Volume</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{leads.length}</span>
            <span className="text-xs text-slate-500">
              ({stats.physicalCount} local, {stats.onlineCount} remote)
            </span>
          </div>
        </div>

        {/* Outreach Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Outreach Activity</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <PhoneOutgoing className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-400">
              {stats.contactedLeads + stats.interestedLeads + stats.closedLeads}
            </span>
            <span className="text-xs text-slate-500">contacted</span>
          </div>
        </div>

        {/* Active Pitches */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Pitches / Quotes</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-indigo-400">{stats.interestedLeads}</span>
            <span className="text-xs text-slate-500">high interest</span>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Est. Pipeline Value</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400">
              {formatCurrency(stats.totalPipelineValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Export Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Stage Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const count =
              stage.key === "ALL"
                ? leads.length
                : leads.filter((l) => l.status === stage.key).length;
            const isActive = currentTab === stage.key;

            return (
              <button
                key={stage.key}
                onClick={() => setCurrentTab(stage.key)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? `${stage.bg} ${stage.color} border border-slate-700 shadow-sm`
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{stage.label}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mode Filter & Export Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Channel Selector */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-1 flex items-center text-xs">
            <button
              onClick={() => setModeFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                modeFilter === "ALL" ? "bg-slate-800 text-white" : "text-slate-400"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setModeFilter("physical")}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center space-x-1 ${
                modeFilter === "physical" ? "bg-blue-600/30 text-blue-300" : "text-slate-400"
              }`}
            >
              <Store className="w-3 h-3" />
              <span>Local</span>
            </button>
            <button
              onClick={() => setModeFilter("online")}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center space-x-1 ${
                modeFilter === "online" ? "bg-cyan-600/30 text-cyan-300" : "text-slate-400"
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Remote</span>
            </button>
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">No leads in this stage</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Use the Lead Finder Radar on the home page to discover local businesses without websites or remote software gigs.
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
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  {/* Top Channel Badge & Stage Selector */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
                        isPhysical
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      }`}>
                        {isPhysical ? <Store className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
                        <span>{isPhysical ? physLead?.country : "Remote Job"}</span>
                      </span>
                    </div>

                    {/* Status Selector Dropdown */}
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead.id, e.target.value as PipelineStatus)}
                      className="bg-slate-950 border border-slate-700 text-xs text-slate-200 px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="NEW">📥 New Lead</option>
                      <option value="CONTACTED">📞 Contacted</option>
                      <option value="INTERESTED">✨ Pitch / Proposal</option>
                      <option value="CLOSED">🏆 Closed / Won</option>
                      <option value="NOT_INTERESTED">⛔ Archived</option>
                    </select>
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="font-bold text-white text-base leading-snug mt-2">
                    {isPhysical ? physLead?.businessName : jobLead?.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isPhysical ? physLead?.category : `${jobLead?.company} • ${jobLead?.location}`}
                  </div>

                  {/* Physical Phone or Job Details */}
                  {isPhysical && physLead && (
                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                        <a
                          href={`tel:${physLead.phone}`}
                          className="font-mono text-emerald-400 hover:underline flex items-center space-x-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{physLead.phoneFormatted || physLead.phone}</span>
                        </a>
                        <button
                          onClick={(e) => handleCopyPhone(physLead.phone, e)}
                          className="p-1 rounded text-slate-500 hover:text-white"
                          title="Copy phone"
                        >
                          {copiedPhone === physLead.phone ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {physLead.address && (
                        <div className="flex items-center space-x-1.5 text-slate-400 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{physLead.address}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {!isPhysical && jobLead && (
                    <div className="mt-3 space-y-1.5">
                      {jobLead.tags && jobLead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {jobLead.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Deal Value */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-emerald-400">
                      Est. Value: {formatCurrency(lead.estimatedValue || (isPhysical ? 1500 : 3500))}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Added: {formatDate(lead.createdAt)}
                    </span>
                  </div>

                  {/* Notes Preview */}
                  {lead.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 italic">
                      "{lead.notes}"
                    </div>
                  )}
                </div>

                {/* Footer Action Strip */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    {isPhysical && physLead && (
                      <button
                        onClick={() => setPitchLead(physLead)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center space-x-1 transition"
                      >
                        <MessageSquareQuote className="w-3 h-3" />
                        <span>Pitch</span>
                      </button>
                    )}

                    {!isPhysical && jobLead && (
                      <>
                        <button
                          onClick={() => setProposalJob(jobLead)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center space-x-1 transition"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Proposal</span>
                        </button>
                        <a
                          href={jobLead.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
                          title="Apply on site"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}

                    <button
                      onClick={() => setNotesLead(lead)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center space-x-1 transition"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Notes</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteLead(lead.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
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

      {/* Modals */}
      {pitchLead && <PitchScriptModal lead={pitchLead} onClose={() => setPitchLead(null)} />}
      {proposalJob && <JobProposalModal job={proposalJob} onClose={() => setProposalJob(null)} />}
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
