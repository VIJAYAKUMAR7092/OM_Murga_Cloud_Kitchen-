import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerEnquirySchema } from "@/lib/validations/enquiry";

import { notificationService } from "@/server/services/notifications/NotificationService";

export async function POST(req: Request) {
  try {
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Basic anti-spam: Max 5 enquiries per IP per hour
    if (ipAddress !== "unknown") {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentCount = await prisma.customerEnquiry.count({
        where: {
          ipAddress,
          createdAt: {
            gte: oneHourAgo,
          },
        },
      });

      if (recentCount >= 5) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    const body = await req.json();

    // Prevent empty requests
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const validatedData = customerEnquirySchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.format() },
        { status: 400 }
      );
    }

    const enquiry = await prisma.customerEnquiry.create({
      data: {
        ...validatedData.data,
        ipAddress,
        userAgent,
        status: "NEW",
      },
    });

    // Fire & forget notification
    notificationService.sendNewEnquiryAlert(enquiry).catch(console.error);

    return NextResponse.json({ success: true, id: enquiry.id }, { status: 201 });
  } catch (error: any) {
    console.error("Error submitting enquiry:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
