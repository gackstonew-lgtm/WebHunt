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
  CheckCircle2, 
  Clock, 
  PhoneOutgoing, 
  Award, 
  Archive,
  ChevronRight
} from "lucide-react";
import { LeadItem, PipelineStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import PitchScriptModal from "./PitchScriptModal";
import LeadNotesModal from "./LeadNotesModal";

interface LeadPipelineProps {
  initialLeads: LeadItem[];
  stats: {
    totalLeads: number;
    newLeads: number;
    contactedLeads: number;
    interestedLeads: number;
    closedLeads: number;
    totalPipelineValue: number;
    potentialClosedValue: number;
  };
  onUpdateStatus: (leadId: string, status: PipelineStatus) => Promise<any>;
  onUpdateNotes: (leadId: string, notes: string, estimatedValue?: number) => Promise<any>;
  onDeleteLead: (leadId: string) => Promise<any>;
}

const STAGES: { key: PipelineStatus | "ALL"; label: string; icon: any; color: string; bg: string }[] = [
  { key: "ALL", label: "All Leads", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
  { key: "NEW", label: "New Leads", icon: Clock, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { key: "CONTACTED", label: "Contacted", icon: PhoneOutgoing, color: "text-amber-400", bg: "bg-amber-500/10" },
  { key: "INTERESTED", label: "Interested", icon: Sparkles, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { key: "CLOSED", label: "Closed / Won", icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { key: "NOT_INTERESTED", label: "Archived", icon: Archive, color: "text-slate-400", bg: "bg-slate-500/10" },
];

export default function LeadPipeline({
  initialLeads,
  stats,
  onUpdateStatus,
  onUpdateNotes,
  onDeleteLead,
}: LeadPipelineProps) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [currentTab, setCurrentTab] = useState<PipelineStatus | "ALL">("ALL");
  const [pitchLead, setPitchLead] = useState<LeadItem | null>(null);
  const [notesLead, setNotesLead] = useState<LeadItem | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const filteredLeads =
    currentTab === "ALL" ? leads : leads.filter((l) => l.status === currentTab);

  const handleStatusChange = async (leadId: string, newStatus: PipelineStatus) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    await onUpdateStatus(leadId, newStatus);
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm("Are you sure you want to remove this lead from your pipeline?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    await onDeleteLead(leadId);
  };

  const handleCopyPhone = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Pipeline Volume</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{leads.length}</span>
            <span className="text-xs text-slate-500">leads saved</span>
          </div>
        </div>

        {/* Contacted */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Outreach Rate</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <PhoneOutgoing className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-400">{stats.contactedLeads + stats.interestedLeads + stats.closedLeads}</span>
            <span className="text-xs text-slate-500">calls made</span>
          </div>
        </div>

        {/* Interested Deals */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Pitches</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-indigo-400">{stats.interestedLeads}</span>
            <span className="text-xs text-slate-500">high interest</span>
          </div>
        </div>

        {/* Potential Pipeline Value */}
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

      {/* Tabs / Filter Row & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        {/* Stage Filter Buttons */}
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

        {/* CSV Export Button */}
        <a
          href={`/api/export${currentTab !== "ALL" ? `?status=${currentTab}` : ""}`}
          download
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export {currentTab !== "ALL" ? currentTab : "All"} CSV</span>
        </a>
      </div>

      {/* Pipeline Cards Grid */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">No leads in this stage</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Use the Search Radar to discover local businesses without websites and save them to your pipeline.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4 relative group"
            >
              <div>
                {/* Top Lead Header: Name + Stage Selector */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">
                      {lead.businessName}
                    </h4>
                    <span className="text-[11px] text-slate-400 mt-1 inline-block">
                      {lead.category || "Local Business"}
                    </span>
                  </div>

                  {/* Status Selector Dropdown */}
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as PipelineStatus)}
                    className="bg-slate-950 border border-slate-700 text-xs text-slate-200 px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="NEW">📥 New Lead</option>
                    <option value="CONTACTED">📞 Contacted</option>
                    <option value="INTERESTED">✨ Interested</option>
                    <option value="CLOSED">🏆 Closed / Won</option>
                    <option value="NOT_INTERESTED">⛔ Not Interested</option>
                  </select>
                </div>

                {/* Phone & Location */}
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                    <a
                      href={`tel:${lead.phone}`}
                      className="font-mono text-emerald-400 hover:underline flex items-center space-x-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{lead.phoneFormatted || lead.phone}</span>
                    </a>
                    <button
                      onClick={(e) => handleCopyPhone(lead.phone, e)}
                      className="p-1 rounded text-slate-500 hover:text-white"
                      title="Copy phone"
                    >
                      {copiedPhone === lead.phone ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {lead.address && (
                    <div className="flex items-center space-x-1.5 text-slate-400 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{lead.address}</span>
                    </div>
                  )}
                </div>

                {/* Deal Value & Rating */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-1 font-semibold text-emerald-400">
                    <span>Est: {formatCurrency(lead.estimatedValue || 1500)}</span>
                  </div>
                  {lead.rating && (
                    <div className="flex items-center space-x-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{lead.rating.toFixed(1)}</span>
                      <span className="text-slate-500">({lead.reviewCount})</span>
                    </div>
                  )}
                </div>

                {/* Notes Preview */}
                {lead.notes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 italic">
                    "{lead.notes}"
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setPitchLead(lead)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center space-x-1 transition"
                  >
                    <MessageSquareQuote className="w-3 h-3" />
                    <span>Pitch</span>
                  </button>
                  <button
                    onClick={() => setNotesLead(lead)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center space-x-1 transition"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Notes</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(lead.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                  title="Delete lead"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {pitchLead && <PitchScriptModal lead={pitchLead} onClose={() => setPitchLead(null)} />}
      {notesLead && (
        <LeadNotesModal
          lead={notesLead}
          onSave={async (notes, estimatedValue) => {
            await onUpdateNotes(notesLead.id, notes, estimatedValue);
            setLeads((prev) =>
              prev.map((l) =>
                l.id === notesLead.id ? { ...l, notes, estimatedValue } : l
              )
            );
          }}
          onClose={() => setNotesLead(null)}
        />
      )}
    </div>
  );
}
