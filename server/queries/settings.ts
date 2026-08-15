import { prisma } from "@/lib/prisma";
import { RestaurantSettingsInput } from "@/lib/validations/settings";

/**
 * Get the singleton restaurant settings.
 * Returns the default record if it doesn't exist.
 */
export async function getRestaurantSettings() {
  return await prisma.restaurantSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
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
