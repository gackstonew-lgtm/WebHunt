import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Prisma, Lead } from "@prisma/client";
import { getCurrentSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required to export leads." },
        { status: 401 }
      );
    }

    const rl = checkRateLimit(`export:${session.userId}`, 10, 60);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Export rate limit reached. Please wait ${rl.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const whereClause: Prisma.LeadWhereInput = {
      ...(session.role === "admin" ? {} : { userId: session.userId }),
    };

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Generate CSV Header
    const headers = [
      "Business Name",
      "Phone Number",
      "Formatted Phone",
      "Email",
      "WhatsApp",
      "Contact Page URL",
      "Booking URL",
      "Facebook",
      "Instagram",
      "LinkedIn",
      "Twitter / X",
      "Category",
      "Address",
      "City",
      "State",
      "Zip Code",
      "Rating",
      "Reviews",
      "No Website Confidence",
      "Provider Source",
      "Pipeline Status",
      "Estimated Value ($)",
      "Notes",
      "Date Added",
      // Additive Social Enrichment Columns (Section 19)
      "Instagram Confidence",
      "Instagram Verification Status",
      "Facebook Confidence",
      "Facebook Verification Status",
      "TikTok Confidence",
      "TikTok Verification Status",
      "Social Enrichment Status",
      "Social Last Checked",
      "Additional Phones",
      "Additional Emails",
    ];

    const escapeCsv = (str: string | number | null | undefined): string => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = leads.map((lead: Lead) => {
      let detailed: any = {};
      let addPhones = "";
      let addEmails = "";
      let enrichmentStatus = "not_checked";
      let lastChecked = "";

      if (lead.enrichmentJson) {
        try {
          const parsed = JSON.parse(lead.enrichmentJson);
          detailed = parsed.detailedProfiles || (parsed.socialProfiles?.detailed || {});
          if (parsed.additionalPhones) {
            addPhones = parsed.additionalPhones.map((p: any) => `${p.value} (${p.source})`).join("; ");
          }
          if (parsed.additionalEmails) {
            addEmails = parsed.additionalEmails.map((e: any) => `${e.value} (${e.source})`).join("; ");
          }
          if (parsed.socialEnrichmentStatus) {
            enrichmentStatus = parsed.socialEnrichmentStatus;
          }
          if (parsed.socialLastCheckedAt) {
            lastChecked = new Date(parsed.socialLastCheckedAt).toISOString();
          }
        } catch {}
      }

      const igDetail = detailed.instagram;
      const fbDetail = detailed.facebook;
      const tkDetail = detailed.tiktok;

      return [
        escapeCsv(lead.businessName),
        escapeCsv(lead.phone),
        escapeCsv(lead.phoneFormatted),
        escapeCsv(lead.email || ""),
        escapeCsv(lead.whatsapp || ""),
        escapeCsv(lead.contactPageUrl || ""),
        escapeCsv(lead.bookingUrl || ""),
        escapeCsv(lead.facebook || ""),
        escapeCsv(lead.instagram || ""),
        escapeCsv(lead.linkedin || ""),
        escapeCsv(lead.twitter || ""),
        escapeCsv(lead.category || "N/A"),
        escapeCsv(lead.address || "N/A"),
        escapeCsv(lead.city || "N/A"),
        escapeCsv(lead.state || "N/A"),
        escapeCsv(lead.postalCode || "N/A"),
        escapeCsv(lead.rating ? lead.rating.toFixed(1) : "N/A"),
        escapeCsv(lead.reviewCount || 0),
        escapeCsv(lead.noWebsiteConfidence),
        escapeCsv(lead.sourceProvider),
        escapeCsv(lead.status),
        escapeCsv(lead.estimatedValue || 1500),
        escapeCsv(lead.notes || ""),
        escapeCsv(new Date(lead.createdAt).toISOString().split("T")[0]),
        escapeCsv(igDetail ? `${(igDetail.confidence * 100).toFixed(0)}%` : ""),
        escapeCsv(igDetail?.verificationStatus || ""),
        escapeCsv(fbDetail ? `${(fbDetail.confidence * 100).toFixed(0)}%` : ""),
        escapeCsv(fbDetail?.verificationStatus || ""),
        escapeCsv(tkDetail ? `${(tkDetail.confidence * 100).toFixed(0)}%` : ""),
        escapeCsv(tkDetail?.verificationStatus || ""),
        escapeCsv(enrichmentStatus),
        escapeCsv(lastChecked),
        escapeCsv(addPhones),
        escapeCsv(addEmails),
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const filename = `webhunt-leads-${status ? status.toLowerCase() : "all"}-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("[ExportAPI] Failed to generate CSV:", error);
    return NextResponse.json({ error: "Failed to generate CSV export." }, { status: 500 });
  }
}
