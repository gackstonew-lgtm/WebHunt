import { PhysicalLead, PhysicalSearchParams } from "../types";

export interface IPhysicalLeadProvider {
  name: string;
  providerKey: 'osm' | 'google' | 'demo';
  isConfigured(): boolean;
  search(params: PhysicalSearchParams): Promise<PhysicalLead[]>;
}
