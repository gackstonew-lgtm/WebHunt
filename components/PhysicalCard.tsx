import React, { useState } from "react";
import { 
  Phone, Copy, MapPin, Star, Sparkles, Plus, Check, FileText, MessageSquareQuote, ShieldCheck, Globe, ExternalLink, Mail, MessageCircle
} from "lucide-react";
import { PhysicalLead } from "@/lib/types";

interface PhysicalCardProps {
  lead: PhysicalLead;
  isSaved: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSave: (lead: PhysicalLead) => void;
  onPitch: (lead: PhysicalLead) => void;
  onNotes: (lead: PhysicalLead) => void;
}

export default function PhysicalCard({
  lead,
  isSaved,
  isSelected,
  onToggleSelect,
  onSave,
  onPitch,
  onNotes,
}: PhysicalCardProps) {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const hasValidPhone = lead.phone && lead.phoneFormatted !== "Phone unavailable";

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasValidPhone) return;
    navigator.clipboard.writeText(lead.phone!);
    setCopiedPhone(lead.phone!);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lead.email) return;
    navigator.clipboard.writeText(lead.email);
    setCopiedEmail(lead.email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className={`bg-surface border ${isSelected ? "border-primary" : "border-subtle/50"} hover:border-strong/60 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4 group relative`}>
      <div 
        className="absolute top-4 right-4 z-10 cursor-pointer" 
        onClick={(e) => { e.stopPropagation(); onToggleSelect(lead.id); }}
      >
        <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? "bg-primary border-primary text-primary-foreground" : "bg-surface border-subtle/50 text-transparent"}`}>
          <Check className="w-3.5 h-3.5" />
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-1 pr-8">
          <h4 className="font-extrabold text-foreground text-lg tracking-tight leading-snug">
            {lead.businessName}
          </h4>
          <span className="text-xs font-medium text-muted-foreground">
            {lead.industry}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 mt-3 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="line-clamp-1">{lead.address || "No address"}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-surface-subtle border border-subtle/50 text-[9px] uppercase tracking-wider font-bold">
            {lead.country}
          </span>
        </div>

        <div className="flex items-center space-x-2 mt-2">
          {lead.rating && lead.rating > 0 ? (
            <div className="flex items-center space-x-1">
              <div className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold text-xs border border-amber-500/20">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{lead.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground text-[10px]">
                ({lead.reviewCount || 0} reviews)
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground/60 italic text-xs">No reviews</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Phone</span>
            {hasValidPhone ? (
              <button
                onClick={handleCopyPhone}
                className="flex items-center space-x-1 text-xs text-primary hover:text-primary-hover font-medium text-left w-max"
                title="Copy phone"
              >
                <Phone className="w-3 h-3" />
                <span>{lead.phoneFormatted || lead.phone}</span>
                {copiedPhone === lead.phone ? (
                  <Check className="w-3 h-3 text-success ml-1" />
                ) : (
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                )}
              </button>
            ) : (
              <span className="text-muted-foreground/50 text-xs italic">Unavailable</span>
            )}
          </div>
          
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Email</span>
            {lead.email ? (
              <button
                onClick={handleCopyEmail}
                className="flex items-center space-x-1 text-xs text-foreground hover:text-primary font-medium text-left w-max truncate"
                title="Copy email"
              >
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[100px]">{lead.email}</span>
                {copiedEmail === lead.email ? (
                  <Check className="w-3 h-3 text-success ml-1 shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0" />
                )}
              </button>
            ) : (
              <span className="text-muted-foreground/50 text-xs italic">Unavailable</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          {lead.websiteStatus === "SOCIAL_ONLY" ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Social Only</span>
            </span>
          ) : lead.websiteStatus === "BROKEN_WEBSITE" ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
              <ShieldCheck className="w-3 h-3 text-rose-300" />
              <span>Broken Link</span>
            </span>
          ) : lead.websiteStatus === "WEBSITE_FOUND" ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
              <Globe className="w-3 h-3 text-blue-300" />
              <span>Website Found</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-success border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3 text-success" />
              <span>No Website</span>
            </span>
          )}

          {lead.socialLinks?.whatsapp && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
              <MessageCircle className="w-3 h-3" />
              <span>WA</span>
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-subtle/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {lead.sources && lead.sources.length > 1 ? (
              <span 
                className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25"
                title={`Merged from: ${lead.sources.join(", ")}`}
              >
                {lead.sources.length} Sources
              </span>
            ) : (
              <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-surface-subtle text-muted-foreground border border-subtle/50">
                {lead.sourceProvider}
              </span>
            )}
            {lead.sourceUrl && (
              <a
                href={lead.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground p-0.5"
                title="View original source"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPitch(lead)}
              className="px-2.5 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 text-foreground border border-subtle/50 text-xs font-semibold flex items-center space-x-1.5 transition"
              title="Generate cold call pitch script"
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Pitch</span>
            </button>
            <button
              onClick={() => onNotes(lead)}
              className="p-1.5 rounded-xl bg-surface hover:bg-surface-elevated text-muted-foreground hover:text-foreground border border-subtle/50 transition"
              title="Add notes"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onSave(lead)}
            disabled={isSaved}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
              isSaved
                ? "bg-surface-elevated/60 text-success border border-subtle/50 cursor-default"
                : "bg-primary hover:bg-primary-hover text-primary-foreground shadow-brand-btn transition-all duration-300 font-bold shadow-sm"
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
  );
}
