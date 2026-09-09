export type PipelineStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'CLOSED' | 'NOT_INTERESTED';

export type ProviderType = 'google' | 'yelp' | 'osm' | 'demo' | 'all';

export type WebsiteConfidence = 'High' | 'Medium' | 'Verified';

export interface LeadItem {
  id: string;
  searchId?: string | null;
  businessName: string;
  phone: string;
  phoneFormatted: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  category?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  hasWebsite: boolean;
  noWebsiteConfidence: WebsiteConfidence | string;
  sourceProvider: ProviderType | string;
  providerPlaceId?: string | null;
  status: PipelineStatus;
  estimatedValue: number;
  notes?: string | null;
  tags?: string | null;
  contactedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface SearchParams {
  niche: string;
  location: string;
  radius?: number; // in miles/km
  provider?: ProviderType;
  maxResults?: number;
  forceRefresh?: boolean;
}

export interface SearchResult {
  searchId?: string;
  niche: string;
  location: string;
  provider: string;
  totalFetched: number;
  qualifiedLeads: number;
  fromCache: boolean;
  leads: LeadItem[];
}

export interface ProviderRawPlace {
  name: string;
  phone?: string;
  formattedPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  website?: string | null;
  provider: ProviderType;
  providerId?: string;
  raw?: any;
}
