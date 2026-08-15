import { prisma } from "@/lib/prisma";

const REVENUE_WHERE = {
  paymentStatus: "COMPLETED" as const,
  orderStatus: { not: "CANCELLED" as const },
};

export async function getDashboardKPIs() {
  const [
    totalOrders,
    pending,
    accepted,
    preparing,
    outForDelivery,
    delivered,
    cancelled,
    revenueAgg,
    unreadOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: "PENDING" } }),
    prisma.order.count({ where: { orderStatus: "ACCEPTED" } }),
    prisma.order.count({ where: { orderStatus: "PREPARING" } }),
    prisma.order.count({ where: { orderStatus: "OUT_FOR_DELIVERY" } }),
    prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
    prisma.order.count({ where: { orderStatus: "CANCELLED" } }),
    prisma.order.aggregate({
      where: REVENUE_WHERE,
      _sum: { total: true },
    }),
    prisma.order.count({ where: { isRead: false } }),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayOrders, todayRevenueAgg] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.aggregate({
      where: { ...REVENUE_WHERE, createdAt: { gte: today } },
      _sum: { total: true },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.total || 0;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    pending,
    accepted,
    preparing,
    outForDelivery,
    delivered,
    cancelled,
    todayOrders,
    todayRevenue: todayRevenueAgg._sum.total || 0,
    averageOrderValue: aov,
    unreadOrders,
  };
}

export async function getSalesCharts(days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  // Get raw orders to group by date
  // For SQLite/Postgres compatibility we do this in memory if counts are small, 
  // but Prisma group by with raw queries is better.
  // Using pure Prisma with JS grouping for simplicity and safety:
  const orders = await prisma.order.findMany({
    where: {
      ...REVENUE_WHERE,
      createdAt: { gte: startDate },
    },
    select: { createdAt: true, total: true },
  });

  const dailyMap = new Map<string, number>();

  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dailyMap.set(dateStr, 0);
  }

  orders.forEach((o) => {
    const dateStr = o.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, dailyMap.get(dateStr)! + o.total);
    }
  });

  return Array.from(dailyMap.entries())
    .map(([date, revenue]) => ({ date, revenue }))
    .reverse();
}

export async function getOrderDistributions(dateRange?: { gte: Date; lte?: Date }) {
  const whereClause = dateRange ? { createdAt: dateRange } : {};

  const [statusGroup, paymentGroup] = await Promise.all([
    prisma.order.groupBy({
      by: ["orderStatus"],
      _count: true,
      where: whereClause,
    }),
    prisma.order.groupBy({
      by: ["paymentStatus"],
      _count: true,
      where: whereClause,
    }),
  ]);

  const statusData = statusGroup.map((g) => ({
    name: g.orderStatus,
    value: g._count,
  }));

  const paymentData = paymentGroup.map((g) => ({
    name: g.paymentStatus,
    value: g._count,
  }));

  return { statusData, paymentData };
}

export async function getTopSellingFoods(dateRange?: { gte: Date; lte?: Date }) {
  const whereClause = dateRange ? { order: { createdAt: dateRange, ...REVENUE_WHERE } } : { order: REVENUE_WHERE };

  const items = await prisma.orderItem.groupBy({
    by: ["foodId", "foodName"],
    _sum: { quantity: true, subtotal: true },
    where: whereClause,
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 10,
  });

  const foodIds = items.map(i => i.foodId);
  const foodsInfo = await prisma.food.findMany({
    where: { id: { in: foodIds } },
    select: { id: true, category: true, image: true }
  });

  const foodMap = new Map(foodsInfo.map(f => [f.id, f]));

  return items.map((i) => ({
    foodId: i.foodId,
    name: i.foodName,
    quantity: i._sum.quantity || 0,
    revenue: i._sum.subtotal || 0,
    category: foodMap.get(i.foodId)?.category || "Unknown",
    image: foodMap.get(i.foodId)?.image || "/images/placeholder-food.jpg",
  }));
}

export async function getCategoryWiseSales(dateRange?: { gte: Date; lte?: Date }) {
  const whereClause = dateRange ? { order: { createdAt: dateRange, ...REVENUE_WHERE } } : { order: REVENUE_WHERE };

  // Fetch all order items and their categories to sum up
  const items = await prisma.orderItem.findMany({
    where: whereClause,
    select: { subtotal: true, food: { select: { category: true } } },
  });

  const categoryMap = new Map<string, number>();

  items.forEach((item) => {
    const cat = item.food.category || "Other";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + item.subtotal);
  });

  return Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export async function getFinancialInsights(dateRange?: { gte: Date; lte?: Date }) {
  const whereClause = dateRange ? { createdAt: dateRange, ...REVENUE_WHERE } : REVENUE_WHERE;

  const agg = await prisma.order.aggregate({
    where: whereClause,
    _sum: {
      originalAmount: true,
      discountAmount: true,
      finalAmount: true,
      total: true,
    },
    _count: {
      couponCode: true,
    }
  });

  const couponUsage = await prisma.order.groupBy({
    by: ['couponCode'],
    where: {
      ...whereClause,
      couponCode: { not: null },
    },
    _count: {
      couponCode: true,
    },
    orderBy: {
      _count: {
        couponCode: 'desc',
      },
    },
    take: 1,
  });

  const mostUsedCoupon = couponUsage.length > 0 ? {
    code: couponUsage[0].couponCode,
    count: couponUsage[0]._count.couponCode
  } : null;

  const grossRevenue = agg._sum.originalAmount || agg._sum.total || 0;
  const netRevenue = agg._sum.finalAmount || agg._sum.total || 0;
  const totalDiscount = agg._sum.discountAmount || 0;

  return {
    grossRevenue,
    netRevenue,
    totalDiscount,
    couponsUsed: agg._count.couponCode || 0,
    mostUsedCoupon
  };
}
