import { NextResponse } from "next/server";
import { getFoodById } from "@/server/queries/food";
import { updateFood, deleteFood } from "@/server/actions/food";
import { foodSchema } from "@/lib/validations/food";
import { z } from "zod";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const food = await getFoodById(id);
    
    if (!food) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    return NextResponse.json(food);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch food" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = foodSchema.parse(body);
    
    const oldFood = await getFoodById(id);
    
    const food = await updateFood(id, validatedData);
    
    if (oldFood && oldFood.image !== food.image && oldFood.image.startsWith("/uploads/foods/")) {
      const oldPath = path.join(process.cwd(), "public", oldFood.image);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.error("Failed to delete old image:", e);
        }
      }
    }
    
    return NextResponse.json(food);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to update food" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteFood(id);
    
    return NextResponse.json({ success: true, message: "Food deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete food" }, { status: 400 });
  }
}
