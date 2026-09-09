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
  CheckCircle2
} from "lucide-react";
import { LeadItem, PipelineStatus, SearchResult } from "@/lib/types";
import PitchScriptModal from "./PitchScriptModal";
import LeadNotesModal from "./LeadNotesModal";

interface ResultsTableProps {
  searchResult: SearchResult;
  onSaveLead: (lead: LeadItem) => Promise<any>;
  onBulkSave: (leads: LeadItem[]) => Promise<any>;
  onUpdateStatus: (leadId: string, status: PipelineStatus) => Promise<any>;
}

export default function ResultsTable({
  searchResult,
  onSaveLead,
  onBulkSave,
  onUpdateStatus,
}: ResultsTableProps) {
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [pitchLead, setPitchLead] = useState<LeadItem | null>(null);
  const [notesLead, setNotesLead] = useState<LeadItem | null>(null);
  const [savedLeadMap, setSavedLeadMap] = useState<Record<string, boolean>>({});
  const [bulkSaving, setBulkSaving] = useState(false);

  // Sorting & Filtering state
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "name">("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minRating, setMinRating] = useState<number>(0);

  const leads = searchResult.leads;

  // Filter & Sort
  const filteredLeads = leads
    .filter((l) => (l.rating || 0) >= minRating)
    .sort((a, b) => {
      if (sortBy === "rating") {
        const rA = a.rating || 0;
        const rB = b.rating || 0;
        return sortOrder === "desc" ? rB - rA : rA - rB;
      }
      if (sortBy === "reviews") {
        const revA = a.reviewCount || 0;
        const revB = b.reviewCount || 0;
        return sortOrder === "desc" ? revB - revA : revA - revB;
      }
      if (sortBy === "name") {
        return sortOrder === "desc"
          ? b.businessName.localeCompare(a.businessName)
          : a.businessName.localeCompare(b.businessName);
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

  const handleSaveSingle = async (lead: LeadItem) => {
    try {
      await onSaveLead(lead);
      setSavedLeadMap((prev) => ({ ...prev, [lead.id]: true }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAll = async () => {
    setBulkSaving(true);
    try {
      const targets =
        selectedLeadIds.size > 0
          ? filteredLeads.filter((l) => selectedLeadIds.has(l.id))
          : filteredLeads;

      await onBulkSave(targets);
      const newSaved: Record<string, boolean> = {};
      targets.forEach((l) => (newSaved[l.id] = true));
      setSavedLeadMap((prev) => ({ ...prev, ...newSaved }));
    } catch (err) {
      console.error(err);
    } finally {
      setBulkSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Results Metrics & Action Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-base">
                Found {leads.length} Qualified Leads Without Websites
              </h3>
              {searchResult.fromCache && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Cached
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Scanned {searchResult.totalFetched} total businesses in {searchResult.location} for "{searchResult.niche}"
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Min Rating Filter */}
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

          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split("-") as any;
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="rating-desc" className="bg-slate-900">Highest Rating</option>
              <option value="reviews-desc" className="bg-slate-900">Most Reviews</option>
              <option value="name-asc" className="bg-slate-900">Name (A-Z)</option>
            </select>
          </div>

          {/* Save All / Selected */}
          <button
            onClick={handleSaveAll}
            disabled={bulkSaving || filteredLeads.length === 0}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>
              {bulkSaving
                ? "Saving..."
                : selectedLeadIds.size > 0
                ? `Save Selected (${selectedLeadIds.size})`
                : `Save All (${filteredLeads.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Table Container */}
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
                <th className="p-4">Location</th>
                <th className="p-4">Reputation</th>
                <th className="p-4">Website Status</th>
                <th className="p-4">Source</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLeads.map((lead) => {
                const isSelected = selectedLeadIds.has(lead.id);
                const isSaved = savedLeadMap[lead.id];

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
                          title="Click to dial"
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

                    {/* Location */}
                    <td className="p-4 max-w-[200px] truncate">
                      <div className="flex items-center space-x-1 text-slate-300 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{lead.address || `${lead.city}, ${lead.state}`}</span>
                      </div>
                    </td>

                    {/* Rating & Reviews */}
                    <td className="p-4 whitespace-nowrap">
                      {lead.rating ? (
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center space-x-0.5 text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{lead.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-slate-500 text-[11px]">
                            ({lead.reviewCount || 0} reviews)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">No reviews yet</span>
                      )}
                    </td>

                    {/* Website Status Flag */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>No Website Found</span>
                      </span>
                    </td>

                    {/* Source Provider */}
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
                          title="Generate custom pitch script"
                        >
                          <MessageSquareQuote className="w-3.5 h-3.5" />
                          <span>Pitch</span>
                        </button>

                        {/* Notes button */}
                        <button
                          onClick={() => setNotesLead(lead)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                          title="Add call notes / deal value"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Save to pipeline button */}
                        <button
                          onClick={() => handleSaveSingle(lead)}
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
                              <span>Pipeline</span>
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

      {/* Modals */}
      {pitchLead && <PitchScriptModal lead={pitchLead} onClose={() => setPitchLead(null)} />}
      {notesLead && (
        <LeadNotesModal
          lead={notesLead}
          onSave={async (notes, estimatedValue) => {
            notesLead.notes = notes;
            notesLead.estimatedValue = estimatedValue;
            await onSaveLead(notesLead);
            setSavedLeadMap((prev) => ({ ...prev, [notesLead.id]: true }));
          }}
          onClose={() => setNotesLead(null)}
        />
      )}
    </div>
  );
}
