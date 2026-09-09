import React from "react";
import prisma from "@/lib/db";
import LeadPipeline from "@/components/LeadPipeline";
import { 
  updateLeadStatusAction, 
  updateLeadNotesAction, 
  deleteLeadAction, 
  getPipelineLeadsAction 
} from "@/app/actions/leads";
import { LeadItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const result = await getPipelineLeadsAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Lead Pipeline CRM</h1>
        <p className="text-sm text-slate-400 mt-1">
          Track prospect communication, log call notes, customize deal sizes, and close website contracts.
        </p>
      </div>

      <LeadPipeline
        initialLeads={result.data}
        stats={result.stats}
        onUpdateStatus={updateLeadStatusAction}
        onUpdateNotes={updateLeadNotesAction}
        onDeleteLead={deleteLeadAction}
      />
    </div>
  );
}
