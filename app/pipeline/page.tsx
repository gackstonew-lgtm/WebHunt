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
      <div className="py-20 text-center text-[#8AA79A]">
        <div className="w-8 h-8 border-2 border-[#0251B8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs">Loading in-session pipeline...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#16302A] text-[#EAF2EE] border border-[rgba(120,200,170,0.14)] text-xs font-semibold mb-1">
            <KanbanSquare className="w-3.5 h-3.5 text-[#0251B8]" />
            <span>In-Session Local CRM</span>
          </div>
          <h1 className="text-2xl font-bold text-[#EAF2EE] tracking-tight">Lead Pipeline CRM</h1>
          <p className="text-xs sm:text-sm text-[#8AA79A] mt-0.5">
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
