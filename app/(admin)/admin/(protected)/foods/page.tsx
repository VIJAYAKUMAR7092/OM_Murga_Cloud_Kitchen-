import { getFoods } from "@/server/queries/food";
import { FoodManager } from "@/components/admin/FoodManager";

export const dynamic = "force-dynamic";

export default async function AdminFoodsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;

  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const limit = typeof resolvedParams.limit === "string" ? parseInt(resolvedParams.limit, 10) : 10;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  
  let isVegetarian: boolean | undefined = undefined;
  if (typeof resolvedParams.isVegetarian === "string") {
    isVegetarian = resolvedParams.isVegetarian === "true";
  }

  let isAvailable: boolean | undefined = undefined;
  if (typeof resolvedParams.isAvailable === "string") {
    isAvailable = resolvedParams.isAvailable === "true";
  }

  const { items, total, totalPages } = await getFoods({
    page,
    limit,
    search,
    category,
    isVegetarian,
    isAvailable,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Food Management</h1>
        <p className="text-gray-400">
          Manage your cloud kitchen's menu, pricing, and availability.
        </p>
      </div>

      <FoodManager 
        initialFoods={items} 
        totalItems={total}
        totalPages={totalPages}
        currentPage={page}
      />
    </div>
  );
}
