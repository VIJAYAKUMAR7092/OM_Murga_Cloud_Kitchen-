import { prisma } from "@/lib/prisma";

export async function getCustomers({
  page = 1,
  limit = 10,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  // Prisma doesn't have native distinct with counts easily grouped for this specific need,
  // we'll fetch orders grouped by phone number to get unique customers
  
  let where = {};
  if (search) {
    where = {
      OR: [
        { customerName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  // Get distinct phone numbers (our customer identifier)
  const groupedOrders = await prisma.order.groupBy({
    by: ['phone'],
    where,
    _count: {
      id: true
    },
    _sum: {
      total: true
    },
    _max: {
      createdAt: true
    },
    orderBy: {
      _max: {
        createdAt: 'desc'
      }
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalGroups = await prisma.order.groupBy({
    by: ['phone'],
    where
  });

  const total = totalGroups.length;

  // Now fetch the actual details for these phone numbers
  const customerPhones = groupedOrders.map(g => g.phone);
  
  const latestOrders = await prisma.order.findMany({
    where: {
      phone: { in: customerPhones }
    },
    orderBy: {
      createdAt: 'desc'
    },
    distinct: ['phone'],
    select: {
      phone: true,
      customerName: true,
      email: true
    }
  });

  const customers = groupedOrders.map(group => {
    const details = latestOrders.find(o => o.phone === group.phone);
    return {
      phone: group.phone,
      name: details?.customerName || 'Unknown',
      email: details?.email || null,
      totalOrders: group._count.id,
      totalSpent: group._sum.total || 0,
      lastOrderAt: group._max.createdAt
    };
  });

  return {
    customers,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
}
