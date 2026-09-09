"use server";

import { aggregator } from "@/lib/providers";
import { SearchParams, SearchResult } from "@/lib/types";

export async function executeSearchAction(params: SearchParams): Promise<{
  success: boolean;
  data?: SearchResult;
  error?: string;
}> {
  try {
    if (params.mode === "physical") {
      if (!params.niche || params.niche.trim().length === 0) {
        return { success: false, error: "Please enter an industry or niche (e.g. plumbers, auto repair, barbers)." };
      }
      if (!params.country || params.country.trim().length === 0) {
        return { success: false, error: "Please select a target country." };
      }
    } else {
      if (!params.query || params.query.trim().length === 0) {
        return { success: false, error: "Please enter a job keyword or tech stack (e.g. React, Next.js, WordPress)." };
      }
    }

    const result = await aggregator.search(params);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("[SearchAction] Search failed:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while executing the search radar.",
    };
  }
}

export async function getProviderStatusesAction() {
  return {
    physical: aggregator.getPhysicalProvidersStatus(),
    online: aggregator.getOnlineProvidersStatus(),
  };
}
