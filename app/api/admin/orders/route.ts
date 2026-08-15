import { NextResponse } from "next/server";
import { getOrders } from "@/server/queries/orders";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const payment = searchParams.get("payment") || undefined;
    
    const data = await getOrders({
      page,
      limit,
      search,
      status,
      payment,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
