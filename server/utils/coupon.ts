import { prisma } from "@/lib/prisma";

export async function validateAndCalculateCoupon(code: string | null | undefined, originalAmount: number) {
  if (!code) {
    return { isValid: true, discountAmount: 0, finalAmount: originalAmount, error: null, coupon: null };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() }
  });

  if (!coupon) {
    return { isValid: false, discountAmount: 0, finalAmount: originalAmount, error: "Invalid coupon code", coupon: null };
  }

  if (!coupon.isActive) {
    return { isValid: false, discountAmount: 0, finalAmount: originalAmount, error: "Coupon is not active", coupon: null };
  }

  const now = new Date();
  if (coupon.startsAt && now < coupon.startsAt) {
    return { isValid: false, discountAmount: 0, finalAmount: originalAmount, error: "Coupon is not yet active", coupon: null };
  }

  if (coupon.expiresAt && now > coupon.expiresAt) {
    return { isValid: false, discountAmount: 0, finalAmount: originalAmount, error: "Coupon has expired", coupon: null };
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { isValid: false, discountAmount: 0, finalAmount: originalAmount, error: "Coupon usage limit exceeded", coupon: null };
  }

  if (originalAmount < coupon.minimumOrderAmount) {
    return { isValid: false, discountAmount: 0, finalAmount: originalAmount, error: `Minimum order amount for this coupon is ₹${coupon.minimumOrderAmount}`, coupon: null };
  }

  let discountAmount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = (originalAmount * coupon.discountValue) / 100;
  } else {
    discountAmount = coupon.discountValue;
  }

  if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
    discountAmount = coupon.maximumDiscount;
  }

  // Discount shouldn't exceed originalAmount
  if (discountAmount > originalAmount) {
    discountAmount = originalAmount;
  }

  const finalAmount = Math.max(0, originalAmount - discountAmount);

  return {
    isValid: true,
    discountAmount,
    finalAmount,
    error: null,
    coupon
  };
}
