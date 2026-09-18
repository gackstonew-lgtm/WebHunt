"use client";

/**
 * AIReviewPanel — Displays structured proposal review results
 * 
 * Reuses existing WebHunt Arcade FX dark theme styling exactly.
 * Shows requirement coverage, unsupported claims, issues, and recommendations.
 */

import React from "react";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { ReviewResult, ReviewIssue } from "@/lib/ai/types";

interface AIReviewPanelProps {
  review: ReviewResult;
}

export function AIReviewPanel({ review }: AIReviewPanelProps) {
  const severityIcon = (severity: ReviewIssue["severity"]) => {
    if (severity === "critical") return <XCircle className="w-3 h-3 text-red-400 shrink-0" />;
    if (severity === "warning") return <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />;
    return <Info className="w-3 h-3 text-muted-foreground shrink-0" />;
  };

  const severityColor = (severity: ReviewIssue["severity"]) => {
    if (severity === "critical") return "text-red-400 border-red-500/20 bg-red-500/5";
    if (severity === "warning") return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-muted-foreground border-subtle bg-surface";
  };

  return (
    <div className="p-3 rounded-xl bg-surface border border-subtle space-y-3 text-xs">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 rounded-xl bg-surface-elevated border border-subtle">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</div>
          <div className={`font-semibold mt-0.5 ${review.approved ? "text-emerald-400" : review.overallScore === "rejected" ? "text-red-400" : "text-amber-400"}`}>
            {review.overallScore === "approved" ? "Approved" : review.overallScore === "rejected" ? "Rejected" : "Needs Revision"}
          </div>
        </div>
        <div className="p-2 rounded-xl bg-surface-elevated border border-subtle">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Accuracy</div>
          <div className={`font-semibold mt-0.5 ${review.accuracy === "verified" ? "text-emerald-400" : review.accuracy === "unverified" ? "text-red-400" : "text-amber-400"}`}>
            {review.accuracy === "verified" ? "Verified" : review.accuracy === "unverified" ? "Unverified" : "Partial"}
          </div>
        </div>
        <div className="p-2 rounded-xl bg-surface-elevated border border-subtle">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Personalization</div>
          <div className={`font-semibold mt-0.5 ${review.personalization === "high" ? "text-emerald-400" : review.personalization === "low" ? "text-amber-400" : "text-foreground"}`}>
            {review.personalization.charAt(0).toUpperCase() + review.personalization.slice(1)}
          </div>
        </div>
        <div className="p-2 rounded-xl bg-surface-elevated border border-subtle">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Tone</div>
          <div className={`font-semibold mt-0.5 ${review.professionalTone ? "text-emerald-400" : "text-amber-400"}`}>
            {review.professionalTone ? "Professional" : "Adjust Tone"}
          </div>
        </div>
      </div>

      {/* Requirement coverage */}
      {review.requirementCoverage && (
        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Coverage</div>
          <p className="text-muted-foreground leading-relaxed">{review.requirementCoverage}</p>
        </div>
      )}

      {/* Issues */}
      {review.issues.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Issues</div>
          <div className="space-y-1.5">
            {review.issues.map((issue, i) => (
              <div
                key={i}
                className={`flex items-start space-x-2 p-2 rounded-xl border ${severityColor(issue.severity)}`}
              >
                {severityIcon(issue.severity)}
                <div className="flex-1 min-w-0">
                  <span className={issue.severity === "critical" ? "text-red-300" : issue.severity === "warning" ? "text-amber-300" : "text-muted-foreground"}>
                    {issue.description}
                  </span>
                  {issue.suggestion && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">→ {issue.suggestion}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unsupported claims */}
      {review.unsupportedClaims.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-1.5">Unsupported Claims</div>
          <ul className="space-y-1">
            {review.unsupportedClaims.map((claim, i) => (
              <li key={i} className="flex items-start space-x-1.5 text-muted-foreground">
                <XCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                <span>{claim}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing requirements */}
      {review.missingRequirements.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1.5">Missing Requirements</div>
          <ul className="space-y-1">
            {review.missingRequirements.map((req, i) => (
              <li key={i} className="flex items-start space-x-1.5 text-muted-foreground">
                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {review.recommendations.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Recommendations</div>
          <ul className="space-y-1">
            {review.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start space-x-1.5 text-muted-foreground">
                <CheckCircle className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
