import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runMonitoringCycle } from "@/lib/monitoring/opportunity-monitor";

// This endpoint is designed to be called by a cron job scheduler like Vercel Cron.
// It uses a bearer token or custom header for authorization.
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    
    // In production, compare against process.env.CRON_SECRET
    if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get all users who have active accounts (for demo, just grab first 10)
    const activeUsers = await prisma.user.findMany({
      where: { status: "active" },
      take: 10,
    });

    const results = [];
    for (const user of activeUsers) {
      const result = await runMonitoringCycle(user.id);
      results.push({ userId: user.id, result });
    }

    return NextResponse.json({
      success: true,
      message: "Monitoring cycle completed",
      results,
    });
  } catch (error: any) {
    console.error("Cron monitor error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Support GET for simple cron triggers (some schedulers only support GET)
export async function GET(req: Request) {
  return POST(req);
}
