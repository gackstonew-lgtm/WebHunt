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
      <div className="py-20 text-center text-muted-foreground">
        <div className="w-8 h-8 border-2 border-subtle/50 border-t-white rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs">Loading in-session pipeline...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-surface text-foreground border border-subtle/50 text-xs font-semibold mb-2">
            <KanbanSquare className="w-3.5 h-3.5 text-muted-foreground" />
            <span>In-Session Local CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Lead Pipeline CRM</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
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
