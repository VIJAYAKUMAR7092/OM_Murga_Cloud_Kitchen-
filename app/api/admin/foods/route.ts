import { NextResponse } from "next/server";
import { getFoods } from "@/server/queries/food";
import { createFood } from "@/server/actions/food";
import { foodSchema } from "@/lib/validations/food";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    
    let isVegetarian: boolean | undefined = undefined;
    if (searchParams.has("isVegetarian")) {
      isVegetarian = searchParams.get("isVegetarian") === "true";
    }

    let isAvailable: boolean | undefined = undefined;
    if (searchParams.has("isAvailable")) {
      isAvailable = searchParams.get("isAvailable") === "true";
    }

    const data = await getFoods({
      page,
      limit,
      search,
      category,
      isVegetarian,
      isAvailable,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch foods:", error);
    return NextResponse.json({ error: "Failed to fetch foods" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = foodSchema.parse(body);
    const food = await createFood(validatedData);
    
    return NextResponse.json(food, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create food" }, { status: 400 });
  }
}
