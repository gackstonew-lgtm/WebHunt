import React from "react";
import prisma from "@/lib/db";
import SavedSearches from "@/components/SavedSearches";

export const dynamic = "force-dynamic";

export default async function SearchesPage() {
  let searches: any[] = [];
  try {
    searches = await prisma.search.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (e) {
    console.warn("Could not fetch searches:", e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Search History & Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review all radar queries, lead discovery yields, and re-scan target areas.
        </p>
      </div>

      <SavedSearches searches={searches} />
    </div>
  );
}
