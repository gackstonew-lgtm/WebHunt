"use client";

import React, { useState } from "react";
import { X, Save, DollarSign, FileText, Check } from "lucide-react";
import { LeadItem } from "@/lib/types";

interface LeadNotesModalProps {
  lead: LeadItem;
  onSave: (notes: string, estimatedValue: number) => Promise<void> | void;
  onClose: () => void;
}

export default function LeadNotesModal({ lead, onSave, onClose }: LeadNotesModalProps) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [estimatedValue, setEstimatedValue] = useState<number>(lead.estimatedValue || (lead.type === "physical" ? 1500 : 3500));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const title = lead.type === "physical" ? lead.businessName : `${lead.title} (${lead.company})`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(notes, estimatedValue);
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111F1A] border border-[rgba(120,200,170,0.2)] rounded-3xl shadow-2xl overflow-hidden text-[#EAF2EE]">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(120,200,170,0.14)] bg-[#0F1A16]">
            <div>
              <h3 className="font-bold text-[#EAF2EE] text-base truncate max-w-sm">{title}</h3>
              <p className="text-xs text-[#8AA79A]">Prospect Progress, Notes & Estimated Deal Value</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#8AA79A] hover:text-[#EAF2EE] hover:bg-[#16302A] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-sm">
            {/* Deal Value */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8AA79A] flex items-center space-x-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#0251B8]" />
                <span>Estimated Contract / Deal Value ($ USD)</span>
              </label>
              <input
                type="number"
                step="50"
                min="100"
                max="100000"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] rounded-xl px-4 py-2.5 text-sm text-[#EAF2EE] focus:outline-none focus:ring-2 focus:ring-[#0251B8]/40 focus:border-[#0251B8] transition"
              />
            </div>

            {/* Notes textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8AA79A] flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0251B8]" />
                <span>Notes & Interaction History</span>
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log discussion details, client requirements, scheduled callback time..."
                className="w-full bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] rounded-xl p-3 text-xs text-[#EAF2EE] placeholder-[#8AA79A]/50 focus:outline-none focus:ring-2 focus:ring-[#0251B8]/40 focus:border-[#0251B8] resize-none transition"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[rgba(120,200,170,0.14)] bg-[#0F1A16] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#16302A] hover:bg-[#16302A]/80 text-[#8AA79A] hover:text-[#EAF2EE] text-xs font-medium border border-[rgba(120,200,170,0.14)] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#0251B8] hover:bg-[#013F92] text-white text-xs font-semibold shadow-md shadow-[#0251B8]/20 disabled:opacity-50 transition"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-[#5EBA8C]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
