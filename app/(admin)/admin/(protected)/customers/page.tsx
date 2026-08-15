import { getCustomers } from "@/server/queries/customers";
import { CustomersClient } from "@/components/admin/customers/CustomersClient";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;
  const limit = 10;
  const search = typeof params.search === "string" ? params.search : undefined;

  const { customers, pagination } = await getCustomers({
    page,
    limit,
    search,
  });

  return <CustomersClient initialCustomers={customers} pagination={pagination} />;
}
