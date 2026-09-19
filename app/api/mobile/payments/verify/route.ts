import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { verifyPaymentAction } from "@/app/actions/payments";

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
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Reference is required" },
        { status: 400 }
      );
    }

    const res = await verifyPaymentAction(reference);

    if (!res.status) {
      return NextResponse.json(
        { success: false, error: res.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: res.data,
      activated: res.activated,
      subscription: res.subscription
    });
  } catch (error: any) {
    console.error("[MobilePayments] Verify failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
