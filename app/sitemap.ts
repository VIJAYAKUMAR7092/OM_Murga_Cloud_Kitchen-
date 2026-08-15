import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ommurugacloudkitchen.com';

  const staticRoutes = [
    '',
    '/menu',
    '/track-order',
    '/cart',
    '/checkout',
    '/order-success'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    // Fetch foods for dynamic routes
    const foods = await prisma.food.findMany({
      where: { isAvailable: true, isDeleted: false },
      select: { id: true, updatedAt: true }
    });

    dynamicRoutes = foods.map((food) => ({
      url: `${baseUrl}/menu#${food.id}`, // Anchor link since we don't have separate food detail pages right now
      lastModified: food.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Prisma error in sitemap, defaulting to static routes:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
