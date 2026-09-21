import { LeadMode } from "../types";

export interface IndustryCategory {
  id: string;
  name: string;
  icon?: string;
  description: string;
  applicableModes: LeadMode[];
}

export interface OsmTagRequirement {
  key: string;
  value: string;
}

export interface BusinessTerms {
  queryTerms: string[];
  osmTags: OsmTagRequirement[];
  googleTypes?: string[];
  yelpCategories?: string[];
  foursquareCategories?: string[];
}

export interface JobTerms {
  titles: string[];
  keywords: string[];
  category?: string;
}

export interface IndustryDefinition {
  id: string;
  name: string;
  categoryId: string; // Top-level sector / category ID
  industryGroup?: string; // Sub-industry / industry group
  subCategory?: string; // Category within industry
  niche?: string; // Specific niche
  businessType?: string; // Specific physical business type
  isPopular?: boolean;
  applicableModes: LeadMode[];
  aliases: string[];
  businessTerms: BusinessTerms;
  jobTerms: JobTerms;
}

export interface SelectedIndustryItem {
  id: string;
  name: string;
}

export interface NormalizedSearchQuery {
  rawQuery: string;
  matchedIndustries: IndustryDefinition[];
  primaryIndustry?: IndustryDefinition;
  businessSearchTerms: string[];
  osmTags: OsmTagRequirement[];
  googleQuery: string;
  yelpCategories: string[];
  foursquareQuery: string;
  jobTitles: string[];
  jobKeywords: string[];
  jobCategory?: string;
}
