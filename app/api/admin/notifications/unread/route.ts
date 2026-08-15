import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const unreadCount = await prisma.notification.count({
      where: { isRead: false },
    });

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("Failed to fetch unread notifications count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
