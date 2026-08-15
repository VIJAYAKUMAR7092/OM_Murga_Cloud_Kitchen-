import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { getRestaurantSettings, updateRestaurantSettings } from "@/server/queries/settings";
import { restaurantSettingsSchema } from "@/lib/validations/settings";

export async function GET() {
  try {
    const settings = await getRestaurantSettings();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch restaurant settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = restaurantSettingsSchema.parse(body);

    const updatedSettings = await updateRestaurantSettings(validatedData);

    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("Failed to update restaurant settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
