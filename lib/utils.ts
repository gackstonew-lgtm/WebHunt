import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes phone string into raw digits for deduplication & comparisons
 */
export function normalizePhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  // Strip all non-digit characters except leading plus
  let cleaned = phone.replace(/[^\d+]/g, "");
  // If starts with +1 (US), strip +1 for uniform 10-digit matching if length 11
  if (cleaned.startsWith("+1") && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("1") && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Formats a raw phone string into standard US or international readable format
 */
export function formatPhoneNumber(phone?: string | null): string {
  if (!phone) return "No Phone Available";
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  } else if (digits.length > 6) {
    return phone;
  }
  return phone;
}

/**
 * Normalizes business name for duplicate detection (removes Inc, LLC, lowercase)
 */
export function normalizeBusinessName(name: string): string {
  return name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\b(llc|inc|incorporated|corp|corporation|co|ltd|limited|services|group)\b/gi, "")
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
  if (!date) return "Never";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Generate cold calling pitch script tailored to business
 */
export function generatePitchScript(lead: {
  businessName: string;
  category?: string | null;
  city?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
}): { opener: string; valueHook: string; close: string } {
  const niche = lead.category || "local service";
  const location = lead.city || "your area";
  const ratingText = lead.rating ? `with great ${lead.rating}★ reviews` : `in ${location}`;

  return {
    opener: `“Hi, is this the owner of ${lead.businessName}? My name is [Your Name]. I noticed you guys are one of the top-rated ${niche} providers in ${location} ${ratingText}...”`,
    valueHook: `“...but when I searched for your business on Google on my phone, I saw you don't have a direct website or booking page linked. Right now, hundreds of nearby customers looking for ${niche} are landing on competitors because there's no fast way to view your services or quote online.”`,
    close: `“I build fast, high-converting mobile websites and instant appointment booking tools specifically for ${niche} businesses. Can I send you a 2-minute video mockup of what a modern site for ${lead.businessName} would look like?”`,
  };
}
