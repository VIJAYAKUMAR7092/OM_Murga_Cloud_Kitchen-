import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const unreadCount = await prisma.order.count({
      where: {
        isRead: false
      }
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("Failed to fetch unread orders:", error);
    return NextResponse.json({ error: "Failed to fetch unread orders" }, { status: 500 });
  }
}
