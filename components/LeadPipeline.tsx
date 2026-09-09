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
  ExternalLink
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

const STAGES: { key: PipelineStatus | "ALL"; label: string; icon: any }[] = [
  { key: "ALL", label: "All Leads", icon: TrendingUp },
  { key: "NEW", label: "New (Inbox)", icon: Clock },
  { key: "CONTACTED", label: "Contacted", icon: PhoneOutgoing },
  { key: "INTERESTED", label: "Pitch / Proposal Sent", icon: Sparkles },
  { key: "CLOSED", label: "Closed / Won", icon: Award },
  { key: "NOT_INTERESTED", label: "Archived", icon: Archive },
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
        <div className="p-4 rounded-2xl bg-[#111F1A] border border-[rgba(120,200,170,0.14)] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8AA79A] font-medium">Pipeline Volume</span>
            <div className="p-1.5 rounded-lg bg-[#16302A] text-[#0251B8]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#EAF2EE]">{leads.length}</span>
            <span className="text-xs text-[#8AA79A]">
              ({stats.physicalCount} local, {stats.onlineCount} remote)
            </span>
          </div>
        </div>

        {/* Outreach Activity */}
        <div className="p-4 rounded-2xl bg-[#111F1A] border border-[rgba(120,200,170,0.14)] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8AA79A] font-medium">Outreach Activity</span>
            <div className="p-1.5 rounded-lg bg-[#16302A] text-[#5EBA8C]">
              <PhoneOutgoing className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#5EBA8C]">
              {stats.contactedLeads + stats.interestedLeads + stats.closedLeads}
            </span>
            <span className="text-xs text-[#8AA79A]">contacted</span>
          </div>
        </div>

        {/* Active Pitches */}
        <div className="p-4 rounded-2xl bg-[#111F1A] border border-[rgba(120,200,170,0.14)] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8AA79A] font-medium">Active Pitches</span>
            <div className="p-1.5 rounded-lg bg-[#16302A] text-[#0251B8]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#EAF2EE]">{stats.interestedLeads}</span>
            <span className="text-xs text-[#8AA79A]">in progress</span>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="p-4 rounded-2xl bg-[#111F1A] border border-[rgba(120,200,170,0.14)] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8AA79A] font-medium">Est. Pipeline Value</span>
            <div className="p-1.5 rounded-lg bg-[#16302A] text-[#5EBA8C]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#5EBA8C]">
              {formatCurrency(stats.totalPipelineValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Export Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(120,200,170,0.14)] pb-4">
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
                    ? "bg-[#16302A] text-[#EAF2EE] border border-[rgba(120,200,170,0.28)] shadow-sm"
                    : "text-[#8AA79A] hover:text-[#EAF2EE] hover:bg-[#16302A]/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#0251B8]" : "text-[#8AA79A]"}`} />
                <span>{stage.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? "bg-[#0251B8] text-white" : "bg-[#0F1A16] text-[#8AA79A]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mode Filter & Export Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Channel Selector */}
          <div className="bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] rounded-xl p-1 flex items-center text-xs">
            <button
              onClick={() => setModeFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                modeFilter === "ALL" ? "bg-[#16302A] text-[#EAF2EE]" : "text-[#8AA79A]"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setModeFilter("physical")}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center space-x-1 ${
                modeFilter === "physical" ? "bg-[#16302A] text-[#EAF2EE]" : "text-[#8AA79A]"
              }`}
            >
              <Store className="w-3 h-3 text-[#0251B8]" />
              <span>Local</span>
            </button>
            <button
              onClick={() => setModeFilter("online")}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center space-x-1 ${
                modeFilter === "online" ? "bg-[#16302A] text-[#EAF2EE]" : "text-[#8AA79A]"
              }`}
            >
              <Terminal className="w-3 h-3 text-[#0251B8]" />
              <span>Remote</span>
            </button>
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111F1A] hover:bg-[#16302A] text-[#EAF2EE] border border-[rgba(120,200,170,0.14)] text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-[#8AA79A]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#111F1A] border border-[rgba(120,200,170,0.14)] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0F1A16] flex items-center justify-center text-[#8AA79A] mx-auto border border-[rgba(120,200,170,0.08)]">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-[#EAF2EE]">No leads in this stage</h4>
          <p className="text-xs text-[#8AA79A] max-w-sm mx-auto">
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
                className="bg-[#111F1A] border border-[rgba(120,200,170,0.14)] hover:border-[rgba(120,200,170,0.28)] rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  {/* Top Channel Badge & Stage Selector */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center space-x-1 bg-[#16302A] text-[#8AA79A] border border-[rgba(120,200,170,0.14)]">
                        {isPhysical ? <Store className="w-3 h-3 text-[#0251B8]" /> : <Terminal className="w-3 h-3 text-[#0251B8]" />}
                        <span>{isPhysical ? physLead?.country : "Remote Job"}</span>
                      </span>
                    </div>

                    {/* Status Selector Dropdown */}
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead.id, e.target.value as PipelineStatus)}
                      className="bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] text-xs text-[#EAF2EE] px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0251B8] cursor-pointer"
                    >
                      <option value="NEW" className="bg-[#111F1A]">📥 New Lead</option>
                      <option value="CONTACTED" className="bg-[#111F1A]">📞 Contacted</option>
                      <option value="INTERESTED" className="bg-[#111F1A]">✨ Pitch / Proposal</option>
                      <option value="CLOSED" className="bg-[#111F1A]">🏆 Closed / Won</option>
                      <option value="NOT_INTERESTED" className="bg-[#111F1A]">⛔ Archived</option>
                    </select>
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="font-bold text-[#EAF2EE] text-base leading-snug mt-2">
                    {isPhysical ? physLead?.businessName : jobLead?.title}
                  </h4>
                  <div className="text-[11px] text-[#8AA79A] mt-0.5">
                    {isPhysical ? physLead?.category : `${jobLead?.company} • ${jobLead?.location}`}
                  </div>

                  {/* Physical Phone or Job Details */}
                  {isPhysical && physLead && (
                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex items-center justify-between bg-[#0F1A16] p-2.5 rounded-xl border border-[rgba(120,200,170,0.14)]">
                        <a
                          href={`tel:${physLead.phone}`}
                          className="font-mono text-[#5EBA8C] hover:underline flex items-center space-x-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{physLead.phoneFormatted || physLead.phone}</span>
                        </a>
                        <button
                          onClick={(e) => handleCopyPhone(physLead.phone, e)}
                          className="p-1 rounded text-[#8AA79A] hover:text-[#EAF2EE]"
                          title="Copy phone"
                        >
                          {copiedPhone === physLead.phone ? (
                            <Check className="w-3 h-3 text-[#5EBA8C]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {physLead.address && (
                        <div className="flex items-center space-x-1.5 text-[#8AA79A] pt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#8AA79A] shrink-0" />
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
                              className="px-2 py-0.5 rounded bg-[#0F1A16] text-[10px] text-[#8AA79A] border border-[rgba(120,200,170,0.08)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Deal Value */}
                  <div className="mt-3 flex items-center justify-between text-xs text-[#8AA79A]">
                    <span className="font-semibold text-[#5EBA8C]">
                      Est. Value: {formatCurrency(lead.estimatedValue || (isPhysical ? 1500 : 3500))}
                    </span>
                    <span className="text-[11px] text-[#8AA79A]">
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>

                  {/* Notes Preview */}
                  {lead.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] text-[11px] text-[#8AA79A] italic">
                      "{lead.notes}"
                    </div>
                  )}
                </div>

                {/* Footer Action Strip */}
                <div className="pt-3 border-t border-[rgba(120,200,170,0.14)] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    {isPhysical && physLead && (
                      <button
                        onClick={() => setPitchLead(physLead)}
                        className="px-2.5 py-1 rounded-lg bg-[#16302A] hover:bg-[#16302A]/80 text-[#EAF2EE] border border-[rgba(120,200,170,0.2)] text-xs font-medium flex items-center space-x-1 transition"
                      >
                        <MessageSquareQuote className="w-3 h-3 text-[#0251B8]" />
                        <span>Pitch</span>
                      </button>
                    )}

                    {!isPhysical && jobLead && (
                      <>
                        <button
                          onClick={() => setProposalJob(jobLead)}
                          className="px-2.5 py-1 rounded-lg bg-[#16302A] hover:bg-[#16302A]/80 text-[#EAF2EE] border border-[rgba(120,200,170,0.2)] text-xs font-medium flex items-center space-x-1 transition"
                        >
                          <Sparkles className="w-3 h-3 text-[#0251B8]" />
                          <span>Proposal</span>
                        </button>
                        <a
                          href={jobLead.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#0F1A16] hover:bg-[#16302A] text-[#8AA79A] hover:text-[#EAF2EE] border border-[rgba(120,200,170,0.14)] text-xs font-medium transition"
                          title="Apply on site"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}

                    <button
                      onClick={() => setNotesLead(lead)}
                      className="px-2.5 py-1 rounded-lg bg-[#0F1A16] hover:bg-[#16302A] text-[#8AA79A] hover:text-[#EAF2EE] border border-[rgba(120,200,170,0.14)] text-xs font-medium flex items-center space-x-1 transition"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Notes</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteLead(lead.id)}
                    className="p-1.5 rounded-lg text-[#8AA79A] hover:text-red-400 hover:bg-red-500/10 transition"
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
