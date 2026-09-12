import { NextRequest, NextResponse } from "next/server";
import { requestPasswordResetAction } from "@/app/actions/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json({ success: false, error: "Please provide an email address." }, { status: 400 });
    }
    const result = await requestPasswordResetAction(email);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to process password reset request." }, { status: 500 });
  }
}
