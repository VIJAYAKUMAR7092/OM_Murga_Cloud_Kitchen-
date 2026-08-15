import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // "pending" or "approved"

    const where: any = {};
    if (status === "pending") where.isApproved = false;
    if (status === "approved") where.isApproved = true;

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        food: { select: { name: true } },
        order: { select: { orderNumber: true } },
      }
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Failed to fetch admin reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
