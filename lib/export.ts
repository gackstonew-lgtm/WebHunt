import { LeadItem } from "./types";

export function exportLeadsToCsv(leads: LeadItem[], filenamePrefix = "gacks-leads"): void {
  if (!leads || leads.length === 0) return;

  const headers = [
    "Type",
    "Title / Business Name",
    "Phone / Contact",
    "Location / Remote",
    "Country",
    "Category / Niche",
    "Website / Apply URL",
    "Rating / Reviews",
    "Pipeline Status",
    "Estimated Value ($)",
    "Source Provider",
    "Notes",
    "Date Added",
  ];

  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    const clean = String(val).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = leads.map((lead) => {
    if (lead.type === "physical") {
      return [
        escapeCsv("Physical Business (No Website)"),
        escapeCsv(lead.businessName),
        escapeCsv(lead.phoneFormatted || lead.phone),
        escapeCsv(lead.address || `${lead.city}, ${lead.country}`),
        escapeCsv(lead.country),
        escapeCsv(lead.category || "Local Service"),
        escapeCsv("No Website on Record"),
        escapeCsv(lead.rating ? `${lead.rating.toFixed(1)} (${lead.reviewCount || 0})` : "N/A"),
        escapeCsv(lead.status),
        escapeCsv(lead.estimatedValue || 1500),
        escapeCsv(lead.sourceProvider),
        escapeCsv(lead.notes || ""),
        escapeCsv(new Date(lead.createdAt).toISOString().split("T")[0]),
      ];
    } else {
      return [
        escapeCsv("Online Tech Opportunity"),
        escapeCsv(`${lead.title} (${lead.company})`),
        escapeCsv(lead.company),
        escapeCsv(lead.isRemote ? "Remote / Global" : lead.location),
        escapeCsv(lead.country || "Worldwide"),
        escapeCsv(lead.category || "Software Development"),
        escapeCsv(lead.url),
        escapeCsv(lead.tags ? lead.tags.join(", ") : ""),
        escapeCsv(lead.status),
        escapeCsv(lead.estimatedValue || 3500),
        escapeCsv(lead.source),
        escapeCsv(lead.notes || ""),
        escapeCsv(new Date(lead.createdAt).toISOString().split("T")[0]),
      ];
    }
  });

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filenamePrefix}-${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
