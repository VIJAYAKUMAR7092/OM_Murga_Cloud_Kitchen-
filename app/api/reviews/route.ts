import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, review, customerName, trackingId, phone } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }
    if (!trackingId || !phone || !customerName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if order exists and is delivered
    const order = await prisma.order.findUnique({
      where: { trackingId: trackingId.toUpperCase() },
      include: { orderItems: true }
    });

    if (!order || order.phone !== phone) {
      return NextResponse.json({ error: "Order not found or unauthorized" }, { status: 404 });
    }

    if (order.orderStatus !== "DELIVERED") {
      return NextResponse.json({ error: "Only delivered orders can be reviewed" }, { status: 400 });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { orderId: order.id }
    });

    if (existingReview) {
      return NextResponse.json({ error: "This order has already been reviewed" }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        rating,
        review,
        customerName,
        customerPhone: order.phone,
        foodId: order.orderItems[0]?.foodId || "unknown",
        orderId: order.id,
      }
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const foodId = searchParams.get("foodId");
    const approved = searchParams.get("approved");

    const where: any = {};
    if (foodId) where.foodId = foodId;
    if (approved === "true") where.isApproved = true;

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        food: { select: { name: true } },
      }
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
