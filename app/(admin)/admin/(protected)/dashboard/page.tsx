import { 
  getDashboardKPIs, 
  getSalesCharts, 
  getOrderDistributions, 
  getTopSellingFoods 
} from "@/server/queries/analytics";
import { getOrders } from "@/server/queries/orders";
import { KPIList } from "@/components/admin/analytics/KPIList";
import { DailySalesChart, DistributionPieChart } from "@/components/admin/analytics/Charts";
import { TopFoodsTable } from "@/components/admin/analytics/TopFoodsTable";
import Link from "next/link";
import { ArrowRight, Activity, PieChart as PieChartIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    kpis, 
    dailySales, 
    distributions, 
    topFoods, 
    recentOrdersData
  ] = await Promise.all([
    getDashboardKPIs(),
    getSalesCharts(7),
    getOrderDistributions(),
    getTopSellingFoods(),
    getOrders({ limit: 5 })
  ]);

  const recentOrders = recentOrdersData.orders;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Live metrics and performance overview</p>
        </div>
        <Link 
          href="/admin/reports"
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black rounded-lg transition-colors text-sm font-bold"
        >
          View Full Reports
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <KPIList kpis={kpis} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Sales Area Chart */}
        <div className="lg:col-span-2 bg-[#111] rounded-2xl border border-white/10 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-white">Revenue (Last 7 Days)</h2>
          </div>
          <DailySalesChart data={dailySales} />
        </div>

        {/* Status Distributions */}
        <div className="space-y-6">
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <PieChartIcon className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-white">Order Status</h2>
            </div>
            <DistributionPieChart data={distributions.statusData} />
          </div>
          
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <PieChartIcon className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-white">Payment Status</h2>
            </div>
            <DistributionPieChart data={distributions.paymentData} />
          </div>
        </div>

      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Selling Foods */}
        <div className="bg-[#111] rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6">Top Selling Foods</h2>
          <TopFoodsTable foods={topFoods} />
        </div>

        {/* Recent Orders */}
        <div className="bg-[#111] rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-primary text-sm hover:underline">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#1A1A1A]">
                  <th className="p-3 text-sm font-medium text-gray-400">Order #</th>
                  <th className="p-3 text-sm font-medium text-gray-400">Customer</th>
                  <th className="p-3 text-sm font-medium text-gray-400">Status</th>
                  <th className="p-3 text-sm font-medium text-gray-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-500">No recent orders</td></tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 text-sm text-gray-300 font-medium">{order.orderNumber}</td>
                      <td className="p-3 text-sm text-gray-300">{order.customerName}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                          order.orderStatus === "DELIVERED" ? "bg-green-500/10 text-green-500" :
                          order.orderStatus === "CANCELLED" ? "bg-red-500/10 text-red-500" :
                          "bg-primary/10 text-primary"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-white font-bold text-right">₹{order.total.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
