import { 
  IndianRupee, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Truck, 
  PackageCheck, 
  XCircle, 
  Calendar, 
  TrendingUp, 
  CreditCard 
} from "lucide-react";

export function KPIList({ kpis }: { kpis: any }) {
  const cards = [
    { title: "Total Revenue", value: `₹${kpis.totalRevenue.toFixed(2)}`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { title: "Today's Revenue", value: `₹${kpis.todayRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
    { title: "Avg Order Value", value: `₹${kpis.averageOrderValue.toFixed(2)}`, icon: CreditCard, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    
    { title: "Total Orders", value: kpis.totalOrders, icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
    { title: "Today's Orders", value: kpis.todayOrders, icon: Calendar, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20" },
    
    { title: "Pending", value: kpis.pending, icon: Clock, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
    { title: "Accepted", value: kpis.accepted, icon: CheckCircle2, color: "text-teal-400", bg: "bg-teal-400/10", border: "border-teal-400/20" },
    { title: "Preparing", value: kpis.preparing, icon: ChefHat, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
    { title: "Out For Delivery", value: kpis.outForDelivery, icon: Truck, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
    { title: "Delivered", value: kpis.delivered, icon: PackageCheck, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    { title: "Cancelled", value: kpis.cancelled, icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
    { title: "Unread Orders", value: kpis.unreadOrders, icon: Clock, color: "text-red-500", bg: "bg-red-500/20", border: "border-red-500/50" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((metric) => {
        const Icon = metric.icon;
        return (
          <div 
            key={metric.title} 
            className={`bg-[#111] rounded-2xl p-5 border ${metric.border} shadow-lg transition-transform hover:-translate-y-1 duration-300 ${metric.title === "Unread Orders" && metric.value > 0 ? 'animate-pulse ring-2 ring-red-500/50' : ''}`}
          >
            <div className={`p-2 rounded-xl inline-block mb-3 ${metric.bg}`}>
              <Icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">{metric.title}</p>
            <h3 className={`text-2xl font-bold truncate ${metric.title === "Unread Orders" && metric.value > 0 ? 'text-red-500' : 'text-white'}`} title={metric.value.toString()}>{metric.value}</h3>
          </div>
        );
      })}
    </div>
  );
}
