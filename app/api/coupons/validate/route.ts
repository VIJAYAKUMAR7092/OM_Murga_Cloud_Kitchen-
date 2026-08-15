import { NextResponse } from "next/server";
import { validateAndCalculateCoupon } from "@/server/utils/coupon";

export async function POST(request: Request) {
  try {
    const { code, originalAmount } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    if (originalAmount === undefined || originalAmount === null) {
      return NextResponse.json({ error: "Original amount is required" }, { status: 400 });
    }

    const result = await validateAndCalculateCoupon(code, originalAmount);

    if (!result.isValid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
      coupon: {
        code: result.coupon?.code,
        description: result.coupon?.description,
      }
    });
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
