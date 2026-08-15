import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { validateAndCalculateCoupon } from "@/server/utils/coupon";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderData) {
      return NextResponse.json({ error: "Missing required payment details" }, { status: 400 });
    }

    // 1. Verify Razorpay Signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // 2. Prevent Duplicate Payments
    const existingOrder = await prisma.order.findUnique({
      where: { razorpayPaymentId: razorpay_payment_id },
    });

    if (existingOrder) {
      // Order already created for this payment ID, return it to prevent duplicate creation
      return NextResponse.json({ success: true, order: existingOrder }, { status: 200 });
    }

    // 3. Process and Recalculate Order (Do NOT trust client totals)
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
      cartItems,
      couponCode,
    } = orderData;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const foodIds = cartItems.map((item: any) => item.foodId);
    const foods = await prisma.food.findMany({
      where: { id: { in: foodIds } },
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

    // Ideally, we fetch settings again to ensure delivery charges match
    const deliveryFee = 50; // Inside 7km
    const tax = calculatedSubtotal * 0.05; // 5% GST
    const originalAmount = calculatedSubtotal + tax + deliveryFee;

    const couponResult = await validateAndCalculateCoupon(couponCode, originalAmount);
    if (couponCode && !couponResult.isValid) {
      return NextResponse.json({ error: couponResult.error }, { status: 400 });
    }
    const calculatedTotal = couponResult.finalAmount;

    // 4. Generate Order Number OM00000X
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

    // 5. Create Order safely with COMPLETED payment status
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
          paymentMethod: 'ONLINE',
          paymentStatus: 'COMPLETED', // Forced by server after verification
          orderStatus: 'PENDING',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paidAt: new Date(),
          orderItems: {
            create: validatedOrderItems,
          }
        },
      });

      if (couponResult.isValid && couponCode) {
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
      console.log('[NOTIFY] NotificationService Started (ONLINE)');
      const settingsModule = await import('@/server/queries/settings');
      const settings = await settingsModule.getRestaurantSettings();
      const m = await import('@/server/services/notifications/NotificationService');
      await m.notificationService.sendOrderCreatedAlert(order, settings);
    } catch (error) {
      console.error("Background Notification Error:", error);
    }

    return NextResponse.json({ success: true, order }, { status: 201 });

  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
