import { getOrders } from "@/server/queries/orders";
import { OrdersClient } from "@/components/admin/orders/OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;
  const limit = 10;
  const search = typeof params.search === "string" ? params.search : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const payment = typeof params.payment === "string" ? params.payment : undefined;

  const { orders, pagination } = await getOrders({
    page,
    limit,
    search,
    status,
    payment,
  });

  return <OrdersClient initialOrders={orders} pagination={pagination} />;
}
