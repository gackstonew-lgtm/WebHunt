"use client";

import React from "react";
import LeadPipeline from "@/components/LeadPipeline";
import { useLeadPipeline } from "@/lib/pipeline-store";
import { KanbanSquare } from "lucide-react";

export default function PipelinePage() {
  const {
    leads,
    stats,
    isLoaded,
    updateStatus,
    updateNotes,
    deleteLead,
    clearPipeline,
  } = useLeadPipeline();

  if (!isLoaded) {
    return (
      <div className="py-20 text-center text-[#989BA3]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs">Loading in-session pipeline...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#111214] text-[#EEEEEE] border border-white/[0.08] text-xs font-semibold mb-2">
            <KanbanSquare className="w-3.5 h-3.5 text-[#989BA3]" />
            <span>In-Session Local CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE] tracking-tight">Lead Pipeline CRM</h1>
          <p className="text-xs sm:text-sm text-[#989BA3] mt-1">
            Manage your physical prospects &amp; remote job applications across stages, log notes, and export CSVs.
          </p>
        </div>
      </div>

      <LeadPipeline
        leads={leads}
        stats={stats}
        onUpdateStatus={updateStatus}
        onUpdateNotes={updateNotes}
        onDeleteLead={deleteLead}
        onClearPipeline={clearPipeline}
      />
    </div>
  );
}
