import { prisma } from "@/lib/prisma";
import { RestaurantSettingsInput } from "@/lib/validations/settings";

/**
 * Get the singleton restaurant settings.
 * Returns the default record if it doesn't exist.
 */
export async function getRestaurantSettings() {
  const settings = await prisma.restaurantSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings) {
    // If somehow deleted, recreate defaults
    return await prisma.restaurantSettings.create({
      data: { id: "singleton" },
    });
  }

  return settings;
}

/**
 * Update the singleton restaurant settings.
 */
export async function updateRestaurantSettings(data: RestaurantSettingsInput) {
  return await prisma.restaurantSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: {
      id: "singleton",
      ...data,
    },
  });
}
