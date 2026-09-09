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
      <div className="py-20 text-center text-[#A8A196]">
        <div className="w-8 h-8 border-2 border-[#F95C4B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs">Loading in-session pipeline...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#161616] text-[#E4DED2] border border-[rgba(228,222,210,0.12)] text-xs font-semibold mb-2">
            <KanbanSquare className="w-3.5 h-3.5 text-[#F95C4B]" />
            <span>In-Session Local CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F6F4F1] tracking-tight">Lead Pipeline CRM</h1>
          <p className="text-xs sm:text-sm text-[#A8A196] mt-1">
            Manage your physical prospects & remote job applications across stages, log notes, and export CSVs.
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
