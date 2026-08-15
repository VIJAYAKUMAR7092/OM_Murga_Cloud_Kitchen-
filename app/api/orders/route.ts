import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAndCalculateCoupon } from "@/server/utils/coupon";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      mobile,
      email,
      whatsapp,
      houseNo,
      landmark,
      formattedAddress,
      latitude,
      longitude,
      paymentMethod,
      cartItems,
      couponCode,
    } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!fullName || !mobile || !houseNo || !formattedAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Securely recalculate prices on the server
    const foodIds = cartItems.map((item: any) => item.foodId);
    
    const foods = await prisma.food.findMany({
      where: {
        id: { in: foodIds },
      },
    });

    const foodMap = new Map(foods.map(f => [f.id, f]));

    let calculatedSubtotal = 0;
    const validatedOrderItems: any[] = [];

    for (const item of cartItems) {
      const food = foodMap.get(item.foodId);
      if (!food) {
        return NextResponse.json({ error: `Food item not found: ${item.foodName || item.foodId}` }, { status: 400 });
      }
      
      if (!food.isAvailable || food.isDeleted) {
        return NextResponse.json({ error: `Food item unavailable: ${food.name}` }, { status: 400 });
      }

      const itemSubtotal = food.price * item.quantity;
      calculatedSubtotal += itemSubtotal;

      validatedOrderItems.push({
        foodId: food.id,
        foodName: food.name,
        price: food.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    // Hardcoded logic for now based on checkout
    const deliveryFee = 50; // Inside 7km
    const tax = calculatedSubtotal * 0.05; // 5% GST
    const originalAmount = calculatedSubtotal + tax + deliveryFee;

    // Validate Coupon
    const couponResult = await validateAndCalculateCoupon(couponCode, originalAmount);
    if (couponCode && !couponResult.isValid) {
      return NextResponse.json({ error: couponResult.error }, { status: 400 });
    }

    const calculatedTotal = couponResult.finalAmount;

    // Generate Order Number OM00000X
    const lastOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    let nextOrderNum = 1;
    if (lastOrder && lastOrder.orderNumber.startsWith("OM")) {
      const numPart = parseInt(lastOrder.orderNumber.replace("OM", ""), 10);
      if (!isNaN(numPart)) {
        nextOrderNum = numPart + 1;
      }
    }
    const orderNumber = `OM${nextOrderNum.toString().padStart(6, '0')}`;

    // Generate Tracking ID OMM-YYYYMMDD-XXXXXX
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomHex = require('crypto').randomBytes(3).toString('hex').toUpperCase();
    const trackingId = `OMM-${dateStr}-${randomHex}`;

    // Create Order
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          trackingId,
          customerName: fullName,
          phone: mobile,
          email: email || null,
          whatsapp: whatsapp || null,
          houseNumber: houseNo,
          landmark: landmark || null,
          formattedAddress,
          latitude,
          longitude,
          subtotal: calculatedSubtotal,
          deliveryFee,
          tax,
          originalAmount: originalAmount,
          discountAmount: couponResult.discountAmount,
          couponCode: couponResult.isValid ? couponCode : null,
          finalAmount: calculatedTotal,
          total: calculatedTotal,
          paymentMethod: paymentMethod === 'online' ? 'ONLINE' : 'COD',
          paymentStatus: 'PENDING',
          orderStatus: 'PENDING',
          orderItems: {
            create: validatedOrderItems,
          }
        },
        include: {
          orderItems: true,
        }
      });

      if (couponResult.isValid && couponCode && paymentMethod !== 'online') {
         await tx.coupon.update({
           where: { code: couponCode.trim().toUpperCase() },
           data: { usedCount: { increment: 1 } }
         });
      }

      return createdOrder;
    });

    console.log('[NOTIFY] Order Created');
    
    // Send Notifications
    try {
      console.log('[NOTIFY] NotificationService Started (COD)');
      const settingsModule = await import('@/server/queries/settings');
      const settings = await settingsModule.getRestaurantSettings();
      const m = await import('@/server/services/notifications/NotificationService');
      await m.notificationService.sendOrderCreatedAlert(order, settings);
    } catch (error) {
      console.error("Background Notification Error:", error);
    }

    return NextResponse.json({ success: true, order }, { status: 201 });

  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
