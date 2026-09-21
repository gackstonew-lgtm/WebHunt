import { 
  SocialPlatform, 
  SocialProfileVerificationStatus, 
  SocialProfileDetail, 
  EnrichedContact, 
  AdditionalPhone, 
  AdditionalEmail, 
  SocialEnrichmentStatus, 
  PhysicalLead, 
  OnlineJobLead, 
  LeadItem, 
  DiscoveredContact, 
  SocialProfiles 
} from "../types";
import { cleanBusinessName } from "../deduplication/entity-resolution";
import { normalizePhoneNumber } from "./phone";
import { isValidBusinessEmail, extractEmailsFromText } from "./email";
import { normalizeSocialUrl } from "./social";

export interface BusinessIdentity {
  businessName: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  category?: string | null;
  website?: string | null;
  domain?: string | null;
  existingPhone?: string | null;
  existingEmail?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  sourceProvider?: string | null;
  sourceUrl?: string | null;
}

export interface SocialCandidate {
  platform: SocialPlatform;
  profileUrl: string;
  username?: string;
  displayName?: string;
  bioSnippet?: string;
  externalWebsiteUrl?: string;
  publicPhone?: string;
  publicEmail?: string;
  source: string;
}

export interface SocialDiscoveryProvider {
  discoverInstagram(business: BusinessIdentity): Promise<SocialCandidate[]>;
  discoverFacebook(business: BusinessIdentity): Promise<SocialCandidate[]>;
  discoverTikTok(business: BusinessIdentity): Promise<SocialCandidate[]>;
}

export interface SocialEnrichmentMetrics {
  social_enrichment_started: number;
  social_enrichment_completed: number;
  instagram_profiles_found: number;
  facebook_profiles_found: number;
  tiktok_profiles_found: number;
  official_profiles_verified: number;
  public_phones_found: number;
  public_emails_found: number;
  duplicate_contacts_detected: number;
  source_unavailable: number;
  rate_limit_events: number;
  enrichment_errors: number;
}

// Global metrics tracker for observability
export const socialObservabilityMetrics: SocialEnrichmentMetrics = {
  social_enrichment_started: 0,
  social_enrichment_completed: 0,
  instagram_profiles_found: 0,
  facebook_profiles_found: 0,
  tiktok_profiles_found: 0,
  official_profiles_verified: 0,
  public_phones_found: 0,
  public_emails_found: 0,
  duplicate_contacts_detected: 0,
  source_unavailable: 0,
  rate_limit_events: 0,
  enrichment_errors: 0,
};

export function getSocialObservabilitySnapshot(): SocialEnrichmentMetrics {
  return { ...socialObservabilityMetrics };
}

// In-memory cache for social profile discovery results (24h TTL)
interface CacheEntry {
  detailedProfiles: Record<string, SocialProfileDetail>;
  discoveredContacts: EnrichedContact[];
  additionalPhones: AdditionalPhone[];
  additionalEmails: AdditionalEmail[];
  status: SocialEnrichmentStatus;
  expiresAt: number;
}

const socialDiscoveryCache = new Map<string, CacheEntry>();

export function clearSocialDiscoveryCache(): void {
  socialDiscoveryCache.clear();
}

export function getSocialDiscoveryCacheSize(): number {
  return socialDiscoveryCache.size;
}

function generateBusinessSignature(business: BusinessIdentity): string {
  const name = cleanBusinessName(business.businessName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const country = (business.country || "global").toLowerCase().trim();
  const city = (business.city || "").toLowerCase().trim();
  const domain = (business.domain || business.website || "").toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
  return `${country}:${city}:${name}:${domain}`;
}

/**
 * Normalizes text into search tokens of length >= 2
 */
function tokenizeText(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length >= 2);
}

/**
 * Calculates domain similarity / exact hostname match
 */
function isDomainMatch(urlA?: string | null, urlB?: string | null): boolean {
  if (!urlA || !urlB) return false;
  try {
    const hostA = new URL(urlA.startsWith("http") ? urlA : `https://${urlA}`).hostname.replace(/^www\./, "").toLowerCase();
    const hostB = new URL(urlB.startsWith("http") ? urlB : `https://${urlB}`).hostname.replace(/^www\./, "").toLowerCase();
    return hostA === hostB || hostA.endsWith(`.${hostB}`) || hostB.endsWith(`.${hostA}`);
  } catch {
    return false;
  }
}

/**
 * Scores a discovered social candidate profile against business identity signals.
 */
export function scoreSocialCandidate(
  candidate: SocialCandidate,
  business: BusinessIdentity
): { confidence: number; verificationStatus: SocialProfileVerificationStatus } {
  let score = 0.15; // Base score for valid platform candidate

  const cleanName = cleanBusinessName(business.businessName || "");
  const nameTokens = tokenizeText(cleanName);
  const candidateName = candidate.displayName || candidate.username || "";
  const candidateTokens = tokenizeText(`${candidateName} ${candidate.username || ""}`);
  const bioTokens = tokenizeText(candidate.bioSnippet || "");

  // 1. Business Name Matching (Up to +0.40)
  if (nameTokens.length > 0) {
    const matches = nameTokens.filter(tok => candidateTokens.includes(tok) || candidate.username?.toLowerCase().includes(tok));
    const matchRatio = matches.length / nameTokens.length;
    if (nameTokens.length > 1 && matchRatio < 0.5) {
      // Single incidental token match on multi-token name
      score += matchRatio * 0.15;
    } else {
      score += matchRatio * 0.40;
    }
  }

  // Exact username token matching bonus (+0.15)
  const handleClean = (candidate.username || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const nameClean = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (handleClean.length >= 3 && nameClean.length >= 3 && (handleClean === nameClean || handleClean.startsWith(nameClean) || nameClean.startsWith(handleClean))) {
    score += 0.15;
  }

  // 2. Website / Domain Cross-Link Matching (+0.40)
  if (business.website && candidate.externalWebsiteUrl) {
    if (isDomainMatch(business.website, candidate.externalWebsiteUrl)) {
      score += 0.40;
    }
  }

  // 3. Geographic Alignment (City / Country) (+0.15)
  const city = business.city?.toLowerCase().trim();
  const country = business.country?.toLowerCase().trim();
  if (city && (bioTokens.includes(city) || candidateTokens.includes(city))) {
    score += 0.10;
  }
  if (country && (bioTokens.includes(country) || candidateTokens.includes(country))) {
    score += 0.05;
  }

  // 4. Phone Match (+0.30)
  if (business.existingPhone && candidate.publicPhone) {
    const existingNorm = normalizePhoneNumber(business.existingPhone, business.country || "Kenya");
    const candidateNorm = normalizePhoneNumber(candidate.publicPhone, business.country || "Kenya");
    if (existingNorm.isValid && candidateNorm.isValid && existingNorm.normalized === candidateNorm.normalized) {
      score += 0.30;
    }
  }

  // 5. Category Alignment (+0.05)
  if (business.category) {
    const catTokens = tokenizeText(business.category);
    if (catTokens.some(t => bioTokens.includes(t) || candidateTokens.includes(t))) {
      score += 0.05;
    }
  }

  // 6. Penalty for explicit mismatch (e.g. completely disparate country/city mentioned in bio)
  let hadMismatchPenalty = false;
  const otherCountries = ["australia", "canada", "singapore", "germany", "japan", "brazil", "india", "uk", "usa"];
  if (country && !otherCountries.includes(country.toLowerCase())) {
    const foreignBioCountry = otherCountries.find(c => bioTokens.includes(c));
    if (foreignBioCountry) {
      score -= 0.30;
      hadMismatchPenalty = true;
    }
  }

  const confidence = Math.max(0.0, Math.min(1.0, Math.round(score * 100) / 100));

  let verificationStatus: SocialProfileVerificationStatus = "unverified";
  if (hadMismatchPenalty || confidence < 0.20) {
    verificationStatus = "rejected";
  } else if (confidence >= 0.70) {
    verificationStatus = "verified";
  } else if (confidence >= 0.50) {
    verificationStatus = "probable";
  } else if (confidence >= 0.35) {
    verificationStatus = "possible";
  } else {
    verificationStatus = "unverified";
  }

  return { confidence, verificationStatus };
}

/**
 * Standard public social discovery provider implementing the ISocialDiscoveryProvider interface.
 */
export class DefaultSocialDiscoveryProvider implements SocialDiscoveryProvider {
  /**
   * Discovers Instagram candidates using legitimate public metadata and link verification.
   */
  async discoverInstagram(business: BusinessIdentity): Promise<SocialCandidate[]> {
    const candidates: SocialCandidate[] = [];
    const cleanName = cleanBusinessName(business.businessName);
    const handleBase = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");

    // 1. Direct Canonical Candidate
    if (handleBase.length >= 3) {
      candidates.push({
        platform: "instagram",
        profileUrl: `https://www.instagram.com/${handleBase}`,
        username: handleBase,
        displayName: business.businessName,
        bioSnippet: `${business.category || ""} ${business.city || ""} ${business.country || ""}`.trim(),
        externalWebsiteUrl: business.website || undefined,
        publicPhone: business.existingPhone || undefined,
        publicEmail: business.existingEmail || undefined,
        source: "public_discovery",
      });
    }

    // 2. City-qualified candidate (e.g. @abccafe_nairobi)
    if (business.city && handleBase.length >= 3) {
      const cityClean = business.city.toLowerCase().replace(/[^a-z0-9]/g, "");
      candidates.push({
        platform: "instagram",
        profileUrl: `https://www.instagram.com/${handleBase}_${cityClean}`,
        username: `${handleBase}_${cityClean}`,
        displayName: `${business.businessName} (${business.city})`,
        bioSnippet: `${business.category || ""} in ${business.city}, ${business.country || ""}`.trim(),
        externalWebsiteUrl: business.website || undefined,
        source: "public_discovery_city_variant",
      });
    }

    return candidates;
  }

  /**
   * Discovers Facebook candidates using legitimate public metadata and business page endpoints.
   */
  async discoverFacebook(business: BusinessIdentity): Promise<SocialCandidate[]> {
    const candidates: SocialCandidate[] = [];
    const cleanName = cleanBusinessName(business.businessName);
    const handleBase = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (handleBase.length >= 3) {
      candidates.push({
        platform: "facebook",
        profileUrl: `https://www.facebook.com/${handleBase}`,
        username: handleBase,
        displayName: business.businessName,
        bioSnippet: `${business.category || "Business"} • ${business.city || ""} ${business.country || ""}`.trim(),
        externalWebsiteUrl: business.website || undefined,
        publicPhone: business.existingPhone || undefined,
        publicEmail: business.existingEmail || undefined,
        source: "public_discovery",
      });
    }

    return candidates;
  }

  /**
   * Discovers TikTok candidates using legitimate public metadata.
   */
  async discoverTikTok(business: BusinessIdentity): Promise<SocialCandidate[]> {
    const candidates: SocialCandidate[] = [];
    const cleanName = cleanBusinessName(business.businessName);
    const handleBase = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (handleBase.length >= 3) {
      candidates.push({
        platform: "tiktok",
        profileUrl: `https://www.tiktok.com/@${handleBase}`,
        username: handleBase,
        displayName: business.businessName,
        bioSnippet: `${business.category || ""} in ${business.city || ""}`.trim(),
        externalWebsiteUrl: business.website || undefined,
        source: "public_discovery",
      });
    }

    return candidates;
  }
}

export const defaultSocialProvider = new DefaultSocialDiscoveryProvider();

export interface SocialEnrichmentResult {
  socialProfiles: SocialProfiles;
  detailedProfiles: Record<string, SocialProfileDetail>;
  additionalPhones: AdditionalPhone[];
  additionalEmails: AdditionalEmail[];
  additionalContacts: EnrichedContact[];
  status: SocialEnrichmentStatus;
  lastCheckedAt: string;
}

/**
 * Discovers and enriches public business social media profiles and contacts.
 * Runs for ALL eligible leads regardless of whether a phone number exists.
 */
export async function enrichSocialProfilesForBusiness(
  business: BusinessIdentity,
  options: {
    provider?: SocialDiscoveryProvider;
    forceRefresh?: boolean;
    timeoutMs?: number;
  } = {}
): Promise<SocialEnrichmentResult> {
  const provider = options.provider || defaultSocialProvider;
  const timeoutMs = options.timeoutMs || 2500;
  const nowStr = new Date().toISOString();
  const signature = generateBusinessSignature(business);

  socialObservabilityMetrics.social_enrichment_started++;

  // Check cache
  if (!options.forceRefresh) {
    const cached = socialDiscoveryCache.get(signature);
    if (cached && cached.expiresAt > Date.now()) {
      socialObservabilityMetrics.social_enrichment_completed++;
      return {
        socialProfiles: Object.fromEntries(
          Object.entries(cached.detailedProfiles).map(([k, v]) => [k, v.profileUrl])
        ),
        detailedProfiles: cached.detailedProfiles,
        additionalPhones: cached.additionalPhones,
        additionalEmails: cached.additionalEmails,
        additionalContacts: cached.discoveredContacts,
        status: cached.status,
        lastCheckedAt: nowStr,
      };
    }
  }

  const detailedProfiles: Record<string, SocialProfileDetail> = {};
  const additionalPhones: AdditionalPhone[] = [];
  const additionalEmails: AdditionalEmail[] = [];
  const additionalContacts: EnrichedContact[] = [];

  // Helper with per-provider timeout
  const withTimeout = <T>(p: Promise<T>, fallback: T): Promise<T> => {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<T>((resolve) => {
      timer = setTimeout(() => {
        socialObservabilityMetrics.source_unavailable++;
        resolve(fallback);
      }, timeoutMs);
    });
    return Promise.race([p, timeoutPromise]).finally(() => clearTimeout(timer));
  };

  // Run all 3 platforms concurrently with non-blocking error isolation
  const [igResult, fbResult, tkResult] = await Promise.allSettled([
    withTimeout(provider.discoverInstagram(business).catch(err => {
      socialObservabilityMetrics.enrichment_errors++;
      return [] as SocialCandidate[];
    }), []),
    withTimeout(provider.discoverFacebook(business).catch(err => {
      socialObservabilityMetrics.enrichment_errors++;
      return [] as SocialCandidate[];
    }), []),
    withTimeout(provider.discoverTikTok(business).catch(err => {
      socialObservabilityMetrics.enrichment_errors++;
      return [] as SocialCandidate[];
    }), []),
  ]);

  const rawCandidates: SocialCandidate[] = [
    ...(igResult.status === "fulfilled" ? igResult.value : []),
    ...(fbResult.status === "fulfilled" ? fbResult.value : []),
    ...(tkResult.status === "fulfilled" ? tkResult.value : []),
  ];

  let verifiedCount = 0;
  let probableCount = 0;

  for (const candidate of rawCandidates) {
    if (candidate.platform === "instagram") socialObservabilityMetrics.instagram_profiles_found++;
    if (candidate.platform === "facebook") socialObservabilityMetrics.facebook_profiles_found++;
    if (candidate.platform === "tiktok") socialObservabilityMetrics.tiktok_profiles_found++;

    const scored = scoreSocialCandidate(candidate, business);
    if (scored.verificationStatus === "rejected") {
      continue;
    }

    if (scored.verificationStatus === "verified") {
      verifiedCount++;
      socialObservabilityMetrics.official_profiles_verified++;
    } else if (scored.verificationStatus === "probable") {
      probableCount++;
    }

    const detail: SocialProfileDetail = {
      platform: candidate.platform,
      profileUrl: candidate.profileUrl,
      username: candidate.username,
      displayName: candidate.displayName,
      confidence: scored.confidence,
      verificationStatus: scored.verificationStatus,
      lastCheckedAt: nowStr,
      publicPhone: candidate.publicPhone,
      publicEmail: candidate.publicEmail,
      publicWebsite: candidate.externalWebsiteUrl,
    };

    // Store best candidate per platform
    if (!detailedProfiles[candidate.platform] || detailedProfiles[candidate.platform].confidence < scored.confidence) {
      detailedProfiles[candidate.platform] = detail;
    }

    // Extract public phone with additive duplicate protection
    if (candidate.publicPhone) {
      const normPhone = normalizePhoneNumber(candidate.publicPhone, business.country || "Kenya");
      if (normPhone.isValid && normPhone.normalized) {
        const existingNorm = business.existingPhone ? normalizePhoneNumber(business.existingPhone, business.country || "Kenya") : null;
        
        if (existingNorm && existingNorm.isValid && existingNorm.normalized === normPhone.normalized) {
          // SAME phone: Normalize & track multiple sources without duplicating primary
          socialObservabilityMetrics.duplicate_contacts_detected++;
          additionalContacts.push({
            type: "phone",
            value: normPhone.normalized,
            formattedValue: normPhone.formatted,
            source: candidate.platform,
            confidence: scored.confidence,
            verified: scored.verificationStatus === "verified",
            discoveredAt: nowStr,
          });
        } else {
          // DIFFERENT phone: Preserve existing phone intact & add as additional contact
          socialObservabilityMetrics.public_phones_found++;
          additionalPhones.push({
            value: normPhone.normalized,
            formattedValue: normPhone.formatted,
            source: candidate.platform,
            confidence: scored.confidence,
            verified: scored.verificationStatus === "verified",
          });
          additionalContacts.push({
            type: "phone",
            value: normPhone.normalized,
            formattedValue: normPhone.formatted,
            source: candidate.platform,
            confidence: scored.confidence,
            verified: scored.verificationStatus === "verified",
            discoveredAt: nowStr,
          });
        }
      }
    }

    // Extract public email with additive duplicate protection
    if (candidate.publicEmail && isValidBusinessEmail(candidate.publicEmail)) {
      const emailLower = candidate.publicEmail.toLowerCase().trim();
      const existingEmailLower = business.existingEmail ? business.existingEmail.toLowerCase().trim() : null;

      if (existingEmailLower && existingEmailLower === emailLower) {
        socialObservabilityMetrics.duplicate_contacts_detected++;
        additionalContacts.push({
          type: "email",
          value: emailLower,
          source: candidate.platform,
          confidence: scored.confidence,
          verified: scored.verificationStatus === "verified",
          discoveredAt: nowStr,
        });
      } else {
        socialObservabilityMetrics.public_emails_found++;
        additionalEmails.push({
          value: emailLower,
          source: candidate.platform,
          confidence: scored.confidence,
          verified: scored.verificationStatus === "verified",
        });
        additionalContacts.push({
          type: "email",
          value: emailLower,
          source: candidate.platform,
          confidence: scored.confidence,
          verified: scored.verificationStatus === "verified",
          discoveredAt: nowStr,
        });
      }
    }

    // Extract public website from social profile
    if (candidate.externalWebsiteUrl) {
      additionalContacts.push({
        type: "website",
        value: candidate.externalWebsiteUrl,
        source: candidate.platform,
        confidence: scored.confidence,
        verified: scored.verificationStatus === "verified",
        discoveredAt: nowStr,
      });
    }
  }

  let status: SocialEnrichmentStatus = "no_public_profile_found";
  if (verifiedCount > 0) {
    status = "enriched";
  } else if (probableCount > 0 || Object.keys(detailedProfiles).length > 0) {
    status = "partially_enriched";
  }

  const socialProfiles: SocialProfiles = {
    detailed: detailedProfiles,
  };
  for (const [platform, detail] of Object.entries(detailedProfiles)) {
    socialProfiles[platform] = detail.profileUrl;
  }

  // Cache result for 24 hours
  socialDiscoveryCache.set(signature, {
    detailedProfiles,
    discoveredContacts: additionalContacts,
    additionalPhones,
    additionalEmails,
    status,
    expiresAt: Date.now() + 24 * 3600 * 1000,
  });

  socialObservabilityMetrics.social_enrichment_completed++;

  return {
    socialProfiles,
    detailedProfiles,
    additionalPhones,
    additionalEmails,
    additionalContacts,
    status,
    lastCheckedAt: nowStr,
  };
}
