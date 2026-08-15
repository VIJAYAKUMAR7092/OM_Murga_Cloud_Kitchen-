import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { trackingId, phone } = await request.json();

    if (!trackingId || !phone) {
      return NextResponse.json({ error: 'Tracking ID and phone are required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { trackingId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.phone !== phone) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 403 });
    }

    if (order.orderStatus === 'CANCELLED') {
      return NextResponse.json({ error: 'Order is already cancelled' }, { status: 400 });
    }

    if (order.orderStatus !== 'PENDING') {
      return NextResponse.json({ error: 'Order cannot be cancelled at this stage' }, { status: 403 });
    }

    // Check if within 2 minutes of creation
    const now = new Date();
    const orderTime = new Date(order.createdAt);
    const timeDiffMs = now.getTime() - orderTime.getTime();
    
    // 2 minutes = 120,000 milliseconds
    if (timeDiffMs > 120000) {
      return NextResponse.json({ error: 'Cancellation window (2 minutes) has expired' }, { status: 403 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        orderStatus: 'CANCELLED',
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
