import { prisma } from "@/lib/prisma";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function createFood(data: any) {
  let slug = data.slug;
  if (!slug) {
    slug = generateSlug(data.name);
  }

  const existing = await prisma.food.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new Error("A food item with this slug already exists");
  }

  return prisma.food.create({
    data: {
      ...data,
      slug,
    },
  });
}

export async function updateFood(id: string, data: any) {
  // Verify it exists and is not deleted
  const existing = await prisma.food.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existing) {
    throw new Error("Food not found");
  }

  let slug = data.slug || existing.slug;
  if (data.name && !data.slug && data.name !== existing.name) {
    slug = generateSlug(data.name);
  }

  if (slug !== existing.slug) {
    const duplicate = await prisma.food.findUnique({
      where: { slug },
    });
    if (duplicate && duplicate.id !== id) {
      throw new Error("A food item with this slug already exists");
    }
  }

  return prisma.food.update({
    where: { id },
    data: {
      ...data,
      slug,
    },
  });
}

export async function toggleFoodAvailability(id: string, isAvailable: boolean) {
  const existing = await prisma.food.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existing) {
    throw new Error("Food not found");
  }

  return prisma.food.update({
    where: { id },
    data: {
      isAvailable,
    },
  });
}

export async function deleteFood(id: string) {
  const existing = await prisma.food.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existing) {
    throw new Error("Food not found");
  }

  if (existing.isSystem) {
    throw new Error("System dishes cannot be deleted");
  }

  return prisma.food.update({
    where: { id },
    data: {
      isDeleted: true,
      slug: `${existing.slug}-deleted-${Date.now()}` // free up the slug for reuse
    },
  });
}
