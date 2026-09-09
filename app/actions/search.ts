"use server";

import prisma from "@/lib/db";
import { aggregator } from "@/lib/providers";
import { LeadItem, SearchParams, SearchResult } from "@/lib/types";

export async function executeSearchAction(params: SearchParams): Promise<{
  success: boolean;
  data?: SearchResult;
  error?: string;
}> {
  try {
    if (!params.niche || params.niche.trim().length === 0) {
      return { success: false, error: "Please enter an industry or niche (e.g. plumbers, auto repair)." };
    }
    if (!params.location || params.location.trim().length === 0) {
      return { success: false, error: "Please enter a location (city, state, or zip code)." };
    }

    const searchResult = await aggregator.search(params);

    // Save search log to Database
    let dbSearchId: string | undefined = undefined;
    try {
      const searchRecord = await prisma.search.create({
        data: {
          niche: searchResult.niche,
          location: searchResult.location,
          provider: searchResult.provider,
          radius: params.radius || 25,
          totalFetched: searchResult.totalFetched,
          qualifiedLeads: searchResult.qualifiedLeads,
        },
      });
      dbSearchId = searchRecord.id;
    } catch (dbErr) {
      console.warn("[SearchAction] Could not log search record to DB:", dbErr);
    }

    return {
      success: true,
      data: {
        ...searchResult,
        searchId: dbSearchId,
      },
    };
  } catch (error: any) {
    console.error("[SearchAction] Search execution failed:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while searching for leads.",
    };
  }
}

export async function getRecentSearchesAction() {
  try {
    const searches = await prisma.search.findMany({
      take: 15,
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: searches };
  } catch (error) {
    console.warn("[SearchAction] Failed to fetch recent searches:", error);
    return { success: true, data: [] };
  }
}

export async function getProvidersStatusAction() {
  return aggregator.getProviderStatus();
}
