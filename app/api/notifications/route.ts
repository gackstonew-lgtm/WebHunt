import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        opportunity: {
          select: {
            id: true,
            businessName: true,
            city: true,
            category: true,
          }
        }
      }
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: session.userId, read: false },
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
