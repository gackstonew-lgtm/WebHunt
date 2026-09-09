"use client";

import React, { useState } from "react";
import { X, Save, DollarSign, Tag, FileText, Check } from "lucide-react";
import { LeadItem } from "@/lib/types";

interface LeadNotesModalProps {
  lead: LeadItem;
  onSave: (notes: string, estimatedValue: number) => Promise<void>;
  onClose: () => void;
}

export default function LeadNotesModal({ lead, onSave, onClose }: LeadNotesModalProps) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [estimatedValue, setEstimatedValue] = useState<number>(lead.estimatedValue || 1500);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(notes, estimatedValue);
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-200">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
            <div>
              <h3 className="font-bold text-white text-base">{lead.businessName}</h3>
              <p className="text-xs text-slate-400">Call Notes, Pitch Progress & Estimated Deal Size</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-sm">
            {/* Deal Value */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Estimated Deal Value ($ USD)</span>
              </label>
              <input
                type="number"
                step="50"
                min="100"
                max="50000"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-[11px] text-slate-500">
                E.g. $1,500 initial website build + $150/mo hosting/maintenance retainer
              </p>
            </div>

            {/* Notes textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Conversation Notes & Follow-up Details</span>
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Spoke with owner John. Interested in appointment booking widget. Follow up on Thursday at 2 PM..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
