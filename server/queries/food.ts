import { prisma } from "@/lib/prisma";

export async function getFoods(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isVegetarian?: boolean;
  isAvailable?: boolean;
}) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {
    isDeleted: false,
  };

  if (params.search) {
    where.name = {
      contains: params.search,
      mode: "insensitive",
    };
  }

  if (params.category) {
    where.category = params.category;
  }

  if (params.isVegetarian !== undefined) {
    where.isVegetarian = params.isVegetarian;
  }

  if (params.isAvailable !== undefined) {
    where.isAvailable = params.isAvailable;
  }

  const [items, total] = await Promise.all([
    prisma.food.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.food.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getFoodById(id: string) {
  return prisma.food.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });
}

export async function getFoodCounts() {
  const [total, available, unavailable] = await Promise.all([
    prisma.food.count({ where: { isDeleted: false } }),
    prisma.food.count({ where: { isDeleted: false, isAvailable: true } }),
    prisma.food.count({ where: { isDeleted: false, isAvailable: false } }),
  ]);
  
  return {
    total,
    available,
    unavailable,
  };
}
