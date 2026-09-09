import React from "react";
import SavedSearches from "@/components/SavedSearches";

export const dynamic = "force-dynamic";

export default function SearchesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#EAF2EE] tracking-tight">Search History & Analytics</h1>
        <p className="text-sm text-[#8AA79A] mt-1">
          Review past lead radar scans across Kenya, international cities, and remote job feeds.
        </p>
      </div>

      <SavedSearches />
    </div>
  );
}
