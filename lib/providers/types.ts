import { ProviderRawPlace, SearchParams } from "../types";

export interface ILeadProvider {
  name: string;
  providerKey: 'google' | 'yelp' | 'osm' | 'demo';
  isConfigured(): boolean;
  search(params: SearchParams): Promise<ProviderRawPlace[]>;
}

export interface AggregatorOptions extends SearchParams {
  filterNoWebsiteOnly?: boolean;
  requirePhone?: boolean;
}
