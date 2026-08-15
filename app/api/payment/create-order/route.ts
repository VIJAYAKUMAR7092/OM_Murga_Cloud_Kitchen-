import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { getRestaurantSettings } from "@/server/queries/settings";
import { validateAndCalculateCoupon } from "@/server/utils/coupon";

export async function POST(request: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "dummy",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy",
    });

    const { cartItems, latitude, longitude, couponCode } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Recalculate amount from database
    const foodIds = cartItems.map((item: any) => item.foodId);
    const foods = await prisma.food.findMany({
      where: { id: { in: foodIds } },
    });

    let subtotal = 0;
    for (const item of cartItems) {
      const dbFood = foods.find((f) => f.id === item.foodId);
      if (dbFood) {
        subtotal += dbFood.price * item.quantity;
      }
    }

    // 2. Add Delivery Charge & Tax
    const settings = await getRestaurantSettings();
    const minOrder = settings?.minimumOrder || 0;
    
    if (subtotal < minOrder) {
      return NextResponse.json({ error: `Minimum order amount is ₹${minOrder}` }, { status: 400 });
    }

    // Assuming delivery radius check is passed client-side, we apply standard charge here
    const deliveryCharge = settings?.deliveryCharge || 50;
    const tax = subtotal * 0.05;
    const originalAmount = subtotal + tax + deliveryCharge;

    const couponResult = await validateAndCalculateCoupon(couponCode, originalAmount);
    if (couponCode && !couponResult.isValid) {
       return NextResponse.json({ error: couponResult.error }, { status: 400 });
    }

    const grandTotal = couponResult.finalAmount;

    const amountInPaise = Math.round(grandTotal * 100);

    // 3. Create Razorpay Order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error: any) {
    console.error("Razorpay Create Order Error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
