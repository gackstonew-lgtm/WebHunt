import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== session.userId) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true, readAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to mark notification read:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
