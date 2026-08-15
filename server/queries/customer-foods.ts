import { prisma } from "@/lib/prisma";

export async function getCustomerFoods() {
  try {
    return await prisma.food.findMany({
      where: {
        isDeleted: false,
        isAvailable: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        category: true,
        isVegetarian: true,
        isAvailable: true,
        image: true,
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching customer foods:", error);
    return [];
  }
}

export async function getCustomerCategories() {
  try {
    const foods = await prisma.food.findMany({
      where: {
        isDeleted: false,
        isAvailable: true,
      },
      select: {
        category: true,
      },
      distinct: ["category"],
      orderBy: {
        category: "asc",
      },
    });
    return foods.map((f) => f.category);
  } catch (error) {
    console.error("Error fetching customer categories:", error);
    return [];
  }
}
