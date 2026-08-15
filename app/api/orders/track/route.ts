import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('trackingId');
    const phone = searchParams.get('phone');

    if (!trackingId || !phone) {
      return NextResponse.json({ error: "Both Tracking ID and Phone Number are required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        trackingId: trackingId.toUpperCase(),
        phone: phone
      },
      include: {
        orderItems: true,
        review: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const settings = await prisma.restaurantSettings.findFirst();

    // Strip out sensitive fields
    const safeOrder = {
      trackingId: order.trackingId,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      phone: order.phone,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      estimatedDelivery: order.estimatedDelivery,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      restaurantContact: settings?.phone || "9092077915",
      hasReviewed: !!order.review,
      items: order.orderItems.map(item => ({
        foodName: item.foodName,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      }))
    };

    return NextResponse.json({ orders: [safeOrder] });

  } catch (error) {
    console.error("Failed to fetch tracking info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
