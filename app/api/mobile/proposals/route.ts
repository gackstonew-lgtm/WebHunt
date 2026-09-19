import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { generateProposalAction, generatePhysicalPitchAction } from "@/app/actions/outreach";
import { ProposalTemplateType } from "@/lib/proposals/truthful-generator";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { leadId, templateType, type } = body;

    if (!leadId || !templateType) {
      return NextResponse.json(
        { success: false, error: "Missing leadId or templateType" },
        { status: 400 }
      );
    }

    let result;
    if (type === "physical") {
      result = await generatePhysicalPitchAction(leadId, templateType as any);
    } else {
      result = await generateProposalAction(leadId, templateType as ProposalTemplateType);
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    console.error("[MobileProposals] Generation failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
