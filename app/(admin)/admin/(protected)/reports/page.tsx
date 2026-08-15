import { 
  getCategoryWiseSales, 
  getOrderDistributions, 
  getTopSellingFoods,
  getSalesCharts,
  getFinancialInsights
} from "@/server/queries/analytics";
import { DateFilter } from "@/components/admin/reports/DateFilter";
import { ExportButtons } from "@/components/admin/reports/ExportButtons";
import { CategorySalesChart, DistributionPieChart, DailySalesChart } from "@/components/admin/analytics/Charts";
import { TopFoodsTable } from "@/components/admin/analytics/TopFoodsTable";
import { FileBarChart2 } from "lucide-react";

export const dynamic = "force-dynamic";

function getDateRange(filter: string) {
  const now = new Date();
  let gte = new Date();
  let lte = new Date();
  let daysForSalesChart = 7;

  switch (filter) {
    case "today":
      gte.setHours(0, 0, 0, 0);
      daysForSalesChart = 1;
      break;
    case "yesterday":
      gte.setDate(gte.getDate() - 1);
      gte.setHours(0, 0, 0, 0);
      lte.setDate(lte.getDate() - 1);
      lte.setHours(23, 59, 59, 999);
      daysForSalesChart = 2; // to show diff maybe
      break;
    case "last7":
      gte.setDate(gte.getDate() - 7);
      gte.setHours(0, 0, 0, 0);
      daysForSalesChart = 7;
      break;
    case "last30":
      gte.setDate(gte.getDate() - 30);
      gte.setHours(0, 0, 0, 0);
      daysForSalesChart = 30;
      break;
    case "thisMonth":
      gte.setDate(1);
      gte.setHours(0, 0, 0, 0);
      daysForSalesChart = now.getDate();
      break;
    default:
      gte.setDate(gte.getDate() - 7);
      gte.setHours(0, 0, 0, 0);
      daysForSalesChart = 7;
  }

  return { dateRange: { gte, lte: filter === "yesterday" ? lte : undefined }, daysForSalesChart };
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const filter = typeof params.filter === "string" ? params.filter : "last7";
  const { dateRange, daysForSalesChart } = getDateRange(filter);

  const [categorySales, distributions, topFoods, dailySales, financials] = await Promise.all([
    getCategoryWiseSales(dateRange),
    getOrderDistributions(dateRange),
    getTopSellingFoods(dateRange),
    getSalesCharts(daysForSalesChart),
    getFinancialInsights(dateRange)
  ]);

  // Transform data for exports
  const exportCategorySales = categorySales.map(c => ({ "Category": c.name, "Revenue": c.value }));
  const exportTopFoods = topFoods.map((f, i) => ({
    "Rank": i + 1,
    "Item Name": f.name,
    "Category": f.category,
    "Quantity Sold": f.quantity,
    "Revenue Generated": f.revenue
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileBarChart2 className="w-7 h-7 text-primary" />
            Analytics Reports
          </h1>
          <p className="text-gray-400 text-sm mt-1">Deep dive into your business performance</p>
        </div>
        
        <DateFilter />
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111] rounded-2xl border border-white/10 p-5">
          <p className="text-gray-400 text-sm mb-1">Gross Revenue</p>
          <p className="text-2xl font-bold text-white">₹{financials.grossRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-[#111] rounded-2xl border border-white/10 p-5">
          <p className="text-gray-400 text-sm mb-1">Total Discount</p>
          <p className="text-2xl font-bold text-red-400">-₹{financials.totalDiscount.toFixed(2)}</p>
        </div>
        <div className="bg-[#111] rounded-2xl border border-white/10 p-5">
          <p className="text-gray-400 text-sm mb-1">Net Revenue</p>
          <p className="text-2xl font-bold text-green-400">₹{financials.netRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-[#111] rounded-2xl border border-white/10 p-5">
          <p className="text-gray-400 text-sm mb-1">Coupons Used</p>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-primary">{financials.couponsUsed}</p>
            {financials.mostUsedCoupon && (
              <p className="text-xs text-gray-500">Top: {financials.mostUsedCoupon.code}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Sales */}
        <div className="bg-[#111] rounded-2xl border border-white/10 p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Category-wise Sales</h2>
            <ExportButtons data={exportCategorySales} filenamePrefix={`CategorySales_${filter}`} />
          </div>
          <CategorySalesChart data={categorySales} />
        </div>

        {/* Order Status Distribution */}
        <div className="bg-[#111] rounded-2xl border border-white/10 p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Order Status Distribution</h2>
          <DistributionPieChart data={distributions.statusData} />
        </div>

        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-[#111] rounded-2xl border border-white/10 p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Revenue Trend</h2>
          <DailySalesChart data={dailySales} />
        </div>

        {/* Top Selling Foods */}
        <div className="lg:col-span-2 bg-[#111] rounded-2xl border border-white/10 p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Top Selling Foods</h2>
            <ExportButtons data={exportTopFoods} filenamePrefix={`TopFoods_${filter}`} />
          </div>
          <TopFoodsTable foods={topFoods} />
        </div>

      </div>
    </div>
  );
}
