import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/server/actions/orders";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, estimatedDeliveryTime } = body;
    
    if (!status || !Object.keys(OrderStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await updateOrderStatus(id, status as OrderStatus, estimatedDeliveryTime);
    
    // Send Notifications
    try {
      console.log('[NOTIFY] NotificationService Started (STATUS UPDATE)');
      const settingsModule = await import('@/server/queries/settings');
      const settings = await settingsModule.getRestaurantSettings();
      const m = await import('@/server/services/notifications/NotificationService');
      await m.notificationService.sendOrderStatusUpdate(order, settings);
    } catch (error) {
      console.error("Background Notification Error:", error);
    }
    
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return NextResponse.json({ error: error.message || "Failed to update order status" }, { status: 500 });
  }
}
