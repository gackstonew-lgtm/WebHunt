"use client";

import React from "react";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Check, 
  Globe,
  Clock
} from "lucide-react";
import { OnlineJobLead } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { checkApplicantEligibility } from "@/lib/eligibility/regional-filter";

interface JobCardProps {
  job: OnlineJobLead;
  isSaved: boolean;
  onSave: (job: OnlineJobLead) => void;
  onOpenProposal: (job: OnlineJobLead) => void;
  onOpenNotes?: (job: OnlineJobLead) => void;
}

export default function JobCard({
  job,
  isSaved,
  onSave,
  onOpenProposal,
  onOpenNotes,
}: JobCardProps) {
  const eligibility = checkApplicantEligibility(job);

  return (
    <div className="bg-surface border border-subtle/50 hover:border-strong/60 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4 group">
      <div>
        {/* Top Header: Company + Source Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-9 h-9 rounded-xl bg-surface-subtle border border-subtle/50 object-contain p-1 shrink-0"
                onError={(e) => {
                  // Fallback on error
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-surface-subtle border border-subtle/50 flex items-center justify-center text-foreground font-bold text-xs shrink-0">
                {job.company.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <span className="text-xs font-semibold text-foreground">
                {job.company}
              </span>
              <div className="text-[10px] text-muted-foreground flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {job.sources && job.sources.length > 1 ? (
              <span
                className="uppercase text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25"
                title={`Discovered across: ${job.sources.join(", ")}`}
              >
                {job.sources.length} Sources
              </span>
            ) : (
              <span className="uppercase text-[9px] font-bold px-2 py-0.5 rounded bg-surface-elevated text-muted-foreground border border-subtle/50">
                {job.source}
              </span>
            )}
            <span
              className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                eligibility.isEligibleKenya
                  ? "bg-emerald-500/10 text-success border-emerald-500/25"
                  : "bg-surface-elevated/60 text-foreground border-subtle/50"
              }`}
              title={eligibility.reasons.join(". ")}
            >
              {eligibility.badgeText}
            </span>
          </div>
        </div>

        {/* Job Title */}
        <h4 className="font-extrabold text-foreground text-lg tracking-tight mt-3 group-hover:text-white transition leading-snug">
          {job.title}
        </h4>

        {/* Snippet */}
        {job.descriptionSnippet && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
            {job.descriptionSnippet}
          </p>
        )}

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-surface-subtle text-[10px] text-muted-foreground border border-subtle/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Opportunity Profile / Match Score */}
        {job.relevanceScore !== undefined && job.relevanceScore !== null && (
          <div className="mt-4 p-3 rounded-xl bg-surface-elevated border border-subtle/50 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Opportunity Match</span>
              <span className={`text-xs font-bold ${job.relevanceScore > 0.7 ? 'text-success' : job.relevanceScore > 0.4 ? 'text-amber-400' : 'text-rose-400'}`}>
                {Math.round(job.relevanceScore * 100)}/100
              </span>
            </div>
            {/* Simple progress bar representation */}
            <div className="w-full bg-surface-subtle rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full ${job.relevanceScore > 0.7 ? 'bg-emerald-400' : job.relevanceScore > 0.4 ? 'bg-amber-400' : 'bg-rose-400'}`} 
                style={{ width: `${Math.round(job.relevanceScore * 100)}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-muted-foreground flex flex-col gap-0.5 mt-1">
              <span className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-success" />
                <span>Eligibility: {eligibility.badgeText}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-success" />
                <span>Salary Details: {job.salary && job.salary !== "Not specified" ? "Found" : "Missing"}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-subtle/50 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="text-success font-semibold">{job.salary || "Competitive"}</span>
          <div className="flex items-center space-x-1 text-[11px] text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(job.postedDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenProposal(job)}
            className="px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 text-foreground border border-subtle/50 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Proposal</span>
          </button>

          <div className="flex items-center space-x-1.5">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl bg-surface hover:bg-surface-elevated text-muted-foreground hover:text-foreground border border-subtle/50 text-xs font-medium transition"
              title="Apply on official platform"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => onSave(job)}
              disabled={isSaved}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
                isSaved
                  ? "bg-surface-elevated/60 text-success border border-subtle/50 cursor-default"
                  : "bg-primary hover:bg-primary-hover text-primary-foreground font-bold shadow-sm"
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-success" />
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
        </div>
      </div>
    </div>
  );
}
