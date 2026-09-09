import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OnlineJobLead, PhysicalLead } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes phone string into standard raw digits
 */
export function normalizePhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[^\d+]/g, "");
  // If starts with +1 (US) with 12 chars (+1XXXXXXXXXX), strip +1
  if (cleaned.startsWith("+1") && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("1") && cleaned.length === 11 && !cleaned.startsWith("10")) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Worldwide phone formatting supporting Kenya (+254), US (+1), UK (+44), etc.
 */
export function formatPhoneNumber(phone?: string | null, countryCode?: string): string {
  if (!phone) return "No Phone Available";
  const cleaned = phone.trim();

  // Kenyan number format (+254 7XX XXX XXX or 07XX XXX XXX)
  if (cleaned.startsWith("+254") || cleaned.startsWith("254") || (countryCode === "KE" && (cleaned.startsWith("07") || cleaned.startsWith("01")))) {
    let digits = cleaned.replace(/\D/g, "");
    if (digits.startsWith("254")) digits = "0" + digits.substring(3);
    if (digits.length === 10) {
      return `+254 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }
  }

  const digits = cleaned.replace(/\D/g, "");

  // US/Canada format
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // International format with plus
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  return cleaned;
}

/**
 * Normalizes business name for duplicate detection
 */
export function normalizeBusinessName(name: string): string {
  return name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\b(llc|inc|incorporated|corp|corporation|co|ltd|limited|services|group|enterprises|ventures|holdings)\b/gi, "")
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "Recently";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Cold calling pitch script for physical businesses without websites
 */
export function generatePitchScript(lead: {
  businessName: string;
  category?: string | null;
  city?: string | null;
  country?: string | null;
  rating?: number | null;
}): { opener: string; valueHook: string; close: string } {
  const niche = lead.category || "local business";
  const location = lead.city ? `${lead.city}, ${lead.country || ""}` : (lead.country || "your area");
  const ratingText = lead.rating ? `with great ${lead.rating}★ reviews` : `in ${location}`;

  return {
    opener: `“Hi, is this the owner or manager of ${lead.businessName}? My name is [Your Name]. I noticed you guys are one of the prominent ${niche} services in ${location} ${ratingText}...”`,
    valueHook: `“...but when I searched for your business on Google on my mobile phone, I noticed there's no direct website or WhatsApp/online booking link attached to your profile. Right now, customers searching for ${niche} in ${location} end up tapping on competitors simply because there's no instant menu or service page to view.”`,
    close: `“I design fast, mobile-friendly websites and POS/appointment systems specifically for ${niche} businesses that turn Google searches into paying customers. Can I send you a 2-minute video mockup of what a clean site for ${lead.businessName} would look like?”`,
  };
}

/**
 * Proposal & cover letter generator for online software / web development jobs
 */
export function generateJobProposal(job: {
  title: string;
  company: string;
  tags?: string[];
  category?: string | null;
}): { subject: string; greeting: string; body: string; callToAction: string } {
  const techStack = (job.tags && job.tags.length > 0) ? job.tags.slice(0, 4).join(", ") : "modern web frameworks (React, Next.js, Node.js)";

  return {
    subject: `Application for ${job.title} — Full-Stack Developer with expertise in ${techStack}`,
    greeting: `Hi ${job.company} Hiring Team,`,
    body: `I came across your opening for the **${job.title}** role and wanted to reach out directly. I specialize in building fast, scalable web applications and software solutions with ${techStack}.\n\nI have proven experience delivering production-grade web apps with clean architecture, responsive UI, robust API integrations, and optimal performance. I take end-to-end ownership—from database schema and server-side logic down to pixel-perfect frontends.`,
    callToAction: `I would love to learn more about ${job.company}'s roadmap and how I can help accelerate your engineering goals. Let's connect for a brief 10-minute chat this week!\n\nBest regards,\n[Your Name]\n[Portfolio / GitHub URL]\n[Your Phone / Email]`,
  };
}
