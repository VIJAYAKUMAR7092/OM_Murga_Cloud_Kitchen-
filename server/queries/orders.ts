import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

export async function getOrders({
  page = 1,
  limit = 10,
  search,
  status,
  payment,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  payment?: string;
}) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.orderStatus = status as OrderStatus;
  }

  if (payment) {
    if (["COD", "ONLINE"].includes(payment)) {
      where.paymentMethod = payment as PaymentMethod;
    } else {
      where.paymentStatus = payment as PaymentStatus;
    }
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            food: {
              select: {
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          food: {
            select: {
              image: true,
            },
          },
        },
      },
    },
  });
}

export async function getOrderMetrics() {
  const [totalOrders, pendingOrders, deliveredOrders, revenueResult] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: {
        orderStatus: "PENDING",
      },
    }),
    prisma.order.count({
      where: {
        orderStatus: "DELIVERED",
      },
    }),
    prisma.order.aggregate({
      where: {
        paymentStatus: "COMPLETED", // Only PAID orders
      },
      _sum: {
        total: true,
      },
    }),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const revenueTodayResult = await prisma.order.aggregate({
    where: {
      paymentStatus: "COMPLETED", // Only PAID orders
      createdAt: {
        gte: today,
      },
    },
    _sum: {
      total: true,
    },
  });

  return {
    total: totalOrders,
    pending: pendingOrders,
    delivered: deliveredOrders,
    revenueOverall: revenueResult._sum.total || 0,
    revenueToday: revenueTodayResult._sum.total || 0,
  };
}
