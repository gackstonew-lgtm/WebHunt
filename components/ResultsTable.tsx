"use client";

import React, { useState } from "react";
import { 
  Phone, 
  Copy, 
  Check, 
  MapPin, 
  Star, 
  Sparkles, 
  ExternalLink, 
  Download, 
  Plus, 
  BookmarkCheck, 
  FileText, 
  MessageSquareQuote,
  ShieldCheck,
  CheckSquare,
  Square,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Briefcase,
  Terminal,
  Store
} from "lucide-react";
import { LeadItem, OnlineJobLead, PhysicalLead, PipelineStatus, SearchResult } from "@/lib/types";
import PitchScriptModal from "./PitchScriptModal";
import JobProposalModal from "./JobProposalModal";
import LeadNotesModal from "./LeadNotesModal";
import JobCard from "./JobCard";
import { exportLeadsToCsv } from "@/lib/export";

interface ResultsTableProps {
  searchResult: SearchResult;
  onSaveLead: (lead: LeadItem) => void;
  onBulkSave: (leads: LeadItem[]) => void;
  savedLeadIds: Set<string>;
}

export default function ResultsTable({
  searchResult,
  onSaveLead,
  onBulkSave,
  savedLeadIds,
}: ResultsTableProps) {
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [pitchLead, setPitchLead] = useState<PhysicalLead | null>(null);
  const [proposalJob, setProposalJob] = useState<OnlineJobLead | null>(null);
  const [notesLead, setNotesLead] = useState<LeadItem | null>(null);

  // Sorting & Filtering state
  const [sortBy, setSortBy] = useState<string>("default");
  const [minRating, setMinRating] = useState<number>(0);
  const [tagFilter, setTagFilter] = useState<string>("ALL");

  const leads = searchResult.leads;

  // Filter & Sort
  const filteredLeads = leads
    .filter((l) => {
      if (l.type === "physical" && minRating > 0) {
        return (l.rating || 0) >= minRating;
      }
      if (l.type === "online" && tagFilter !== "ALL") {
        return l.tags?.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()));
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating" && a.type === "physical" && b.type === "physical") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "name") {
        const nameA = a.type === "physical" ? a.businessName : a.title;
        const nameB = b.type === "physical" ? b.businessName : b.title;
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

  const handleCopyPhone = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const toggleSelectAll = () => {
    if (selectedLeadIds.size === filteredLeads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedLeadIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedLeadIds(next);
  };

  const handleSaveAll = () => {
    const targets =
      selectedLeadIds.size > 0
        ? filteredLeads.filter((l) => selectedLeadIds.has(l.id))
        : filteredLeads;
    onBulkSave(targets);
  };

  const handleExport = () => {
    const targets =
      selectedLeadIds.size > 0
        ? filteredLeads.filter((l) => selectedLeadIds.has(l.id))
        : filteredLeads;
    exportLeadsToCsv(targets, `gacks-leads-${searchResult.mode}`);
  };

  return (
    <div className="space-y-4">
      {/* Metrics Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            searchResult.mode === "physical"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
          }`}>
            {searchResult.mode === "physical" ? <Store className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-base">
                {searchResult.mode === "physical"
                  ? `Found ${leads.length} Qualified Local Businesses Without Websites`
                  : `Found ${leads.length} Remote Software & Web Dev Opportunities`}
              </h3>
              {searchResult.fromCache && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Cached
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {searchResult.mode === "physical"
                ? `Scanned ${searchResult.totalFetched} listings in ${searchResult.location} for "${searchResult.query}"`
                : `Scanned public job APIs for "${searchResult.query}"`}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Physical Rating Filter */}
          {searchResult.mode === "physical" && (
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="0" className="bg-slate-900">All Ratings</option>
                <option value="4.0" className="bg-slate-900">★ 4.0+ Rating</option>
                <option value="4.5" className="bg-slate-900">★ 4.5+ Rating</option>
              </select>
            </div>
          )}

          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="default" className="bg-slate-900">Default Order</option>
              {searchResult.mode === "physical" && (
                <option value="rating" className="bg-slate-900">Highest Rating</option>
              )}
              <option value="name" className="bg-slate-900">Alphabetical</option>
            </select>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExport}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Bulk Save to Pipeline */}
          <button
            onClick={handleSaveAll}
            disabled={filteredLeads.length === 0}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>
              {selectedLeadIds.size > 0
                ? `Save Selected (${selectedLeadIds.size})`
                : `Save All (${filteredLeads.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Results Content */}
      {searchResult.mode === "physical" ? (
        /* ================= PHYSICAL TABLE ================= */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="p-4 w-10 text-center">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                      {selectedLeadIds.size === filteredLeads.length && filteredLeads.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-4">Business & Niche</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Location & Country</th>
                  <th className="p-4">Reputation</th>
                  <th className="p-4">Website Status</th>
                  <th className="p-4">Source</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredLeads.map((item) => {
                  const lead = item as PhysicalLead;
                  const isSelected = selectedLeadIds.has(lead.id);
                  const isSaved = savedLeadIds.has(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-slate-800/40 transition group ${
                        isSelected ? "bg-blue-950/20" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleSelect(lead.id)}
                          className="text-slate-500 hover:text-white transition"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Business Name & Niche */}
                      <td className="p-4">
                        <div className="font-bold text-white text-sm group-hover:text-blue-400 transition">
                          {lead.businessName}
                        </div>
                        <div className="text-slate-400 mt-0.5 inline-flex items-center space-x-1">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">
                            {lead.category || "Local Business"}
                          </span>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <a
                            href={`tel:${lead.phone}`}
                            className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline flex items-center space-x-1"
                            title="Click to call"
                          >
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span>{lead.phoneFormatted || lead.phone}</span>
                          </a>
                          <button
                            onClick={(e) => handleCopyPhone(lead.phone, e)}
                            className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition"
                            title="Copy phone number"
                          >
                            {copiedPhone === lead.phone ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Location & Country */}
                      <td className="p-4 max-w-[200px] truncate">
                        <div className="flex items-center space-x-1 text-slate-300 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{lead.address || `${lead.city}, ${lead.country}`}</span>
                        </div>
                      </td>

                      {/* Reputation */}
                      <td className="p-4 whitespace-nowrap">
                        {lead.rating ? (
                          <div className="flex items-center space-x-1">
                            <div className="flex items-center space-x-0.5 text-amber-400 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{lead.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-slate-500 text-[11px]">
                              ({lead.reviewCount || 0})
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No reviews</span>
                        )}
                      </td>

                      {/* Website Status Flag */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>No Website Found</span>
                        </span>
                      </td>

                      {/* Provider Source */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {lead.sourceProvider}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center space-x-1.5">
                          {/* Pitch script button */}
                          <button
                            onClick={() => setPitchLead(lead)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium transition flex items-center space-x-1"
                            title="Generate cold call pitch script"
                          >
                            <MessageSquareQuote className="w-3.5 h-3.5" />
                            <span>Pitch</span>
                          </button>

                          {/* Notes */}
                          <button
                            onClick={() => setNotesLead(lead)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                            title="Add notes"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Save to pipeline */}
                          <button
                            onClick={() => onSaveLead(lead)}
                            disabled={isSaved}
                            className={`px-3 py-1 rounded-lg font-medium transition flex items-center space-x-1 ${
                              isSaved
                                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20"
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Saved</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= ONLINE JOBS CARD GRID ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((item) => {
            const job = item as OnlineJobLead;
            const isSaved = savedLeadIds.has(job.id);
            return (
              <JobCard
                key={job.id}
                job={job}
                isSaved={isSaved}
                onSave={onSaveLead}
                onOpenProposal={setProposalJob}
                onOpenNotes={setNotesLead}
              />
            );
          })}
        </div>
      )}

      {/* Modals */}
      {pitchLead && <PitchScriptModal lead={pitchLead} onClose={() => setPitchLead(null)} />}
      {proposalJob && <JobProposalModal job={proposalJob} onClose={() => setProposalJob(null)} />}
      {notesLead && (
        <LeadNotesModal
          lead={notesLead as any}
          onSave={async (notes, estimatedValue) => {
            notesLead.notes = notes;
            notesLead.estimatedValue = estimatedValue;
            onSaveLead(notesLead);
          }}
          onClose={() => setNotesLead(null)}
        />
      )}
    </div>
  );
}
