"use client";

import React, { useMemo } from "react";
import { PhysicalLead } from "@/lib/types";
import { MapPin } from "lucide-react";

interface MapResultsViewProps {
  leads: PhysicalLead[];
  location: string;
}

export default function MapResultsView({ leads, location }: MapResultsViewProps) {
  const mapSrc = useMemo(() => {
    const query = encodeURIComponent(location);
    return `https://www.openstreetmap.org/export/embed.html?marker=&query=${query}`;
  }, [location]);

  if (!leads || leads.length === 0) return null;

  return (
    <div className="bg-surface border-0 rounded-2xl overflow-hidden shadow-2xl relative h-[400px] flex flex-col mt-5">
      <div className="bg-surface-subtle/90 border-b border-subtle/50 px-4 py-3 flex items-center justify-between z-10 relative shadow-sm">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>Area Map View</span>
        </h3>
        <span className="text-xs text-muted-foreground font-medium">{leads.length} locations</span>
      </div>
      <div className="flex-1 w-full h-full relative">
        <iframe
          src={mapSrc}
          className="w-full h-full min-h-[350px] border-0"
          title="Map View"
          loading="lazy"
          style={{ filter: "invert(90%) hue-rotate(180deg)" }}
        />
      </div>
    </div>
  );
}
