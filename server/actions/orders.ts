import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

const STATUS_FLOW = {
  PENDING: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["CANCELLED"],
  CANCELLED: [],
} as Record<OrderStatus, OrderStatus[]>;

export async function updateOrderStatus(id: string, newStatus: OrderStatus, estimatedDeliveryTime?: number | null) {
  const existingOrder = await prisma.order.findUnique({
    where: { id },
  });

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  const currentStatus = existingOrder.orderStatus;
  
  if (currentStatus === newStatus) {
    return existingOrder;
  }

  const allowedNextStatuses = STATUS_FLOW[currentStatus] || [];
  
  if (!allowedNextStatuses.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
  }

  const dataToUpdate: any = { orderStatus: newStatus };
  if (estimatedDeliveryTime !== undefined) {
    dataToUpdate.estimatedDeliveryTime = estimatedDeliveryTime;
  }

  return prisma.order.update({
    where: { id },
    data: dataToUpdate,
  });
}
