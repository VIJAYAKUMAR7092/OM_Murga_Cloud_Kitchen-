import { NextResponse } from "next/server";
import { toggleFoodAvailability } from "@/server/actions/food";
import { foodAvailabilitySchema } from "@/lib/validations/food";
import { z } from "zod";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = foodAvailabilitySchema.parse(body);
    
    const food = await toggleFoodAvailability(id, validatedData.isAvailable);
    
    return NextResponse.json(food);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to update availability" }, { status: 400 });
  }
}
