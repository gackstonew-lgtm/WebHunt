export type LeadMode = 'physical' | 'online';

export type PipelineStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'CLOSED' | 'NOT_INTERESTED';

export type PhysicalProviderType = 'osm' | 'google' | 'demo' | 'all';
export type OnlineProviderType = 'remotive' | 'arbeitnow' | 'demo' | 'all';

export type WebsiteConfidence = 'High' | 'Medium' | 'Verified';

export interface PhysicalLead {
  id: string;
  type: 'physical';
  businessName: string;
  phone: string;
  phoneFormatted: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country: string;
  postalCode?: string | null;
  category?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  hasWebsite: boolean;
  noWebsiteConfidence: WebsiteConfidence | string;
  sourceProvider: string;
  providerPlaceId?: string | null;
  status: PipelineStatus;
  estimatedValue: number;
  notes?: string | null;
  tags?: string | string[] | null;
  contactedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface OnlineJobLead {
  id: string;
  type: 'online';
  title: string;
  company: string;
  companyLogo?: string | null;
  location: string;
  country?: string | null;
  isRemote: boolean;
  category?: string | null;
  tags: string[];
  url: string;
  postedDate: string;
  salary?: string | null;
  source: string; // 'remotive' | 'arbeitnow' | 'demo' | 'partner'
  descriptionSnippet?: string;
  status: PipelineStatus;
  estimatedValue: number;
  notes?: string | null;
  contactedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type LeadItem = PhysicalLead | OnlineJobLead;

export interface PhysicalSearchParams {
  mode: 'physical';
  niche: string;
  country: string;
  city?: string;
  locationQuery?: string;
  radius?: number;
  provider?: PhysicalProviderType;
  maxResults?: number;
  forceRefresh?: boolean;
}

export interface OnlineSearchParams {
  mode: 'online';
  query: string;
  category?: string;
  country?: string;
  provider?: OnlineProviderType;
  maxResults?: number;
  forceRefresh?: boolean;
}

export type SearchParams = PhysicalSearchParams | OnlineSearchParams;

export interface SearchResult {
  mode: LeadMode;
  query: string;
  location: string;
  provider: string;
  totalFetched: number;
  qualifiedCount: number;
  fromCache: boolean;
  leads: LeadItem[];
}
