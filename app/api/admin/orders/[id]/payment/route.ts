import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentMethod !== "COD") {
      return NextResponse.json(
        { error: "Payment completion is only applicable for COD orders" },
        { status: 400 }
      );
    }

    if (order.paymentStatus === "COMPLETED") {
      return NextResponse.json(
        { error: "Payment is already completed" },
        { status: 409 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: "COMPLETED",
        paidAt: new Date()
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order payment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
