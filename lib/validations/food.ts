import { z } from "zod";

export const foodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  slug: z.string().optional(),
  description: z.string().min(5, "Description must be at least 5 characters long"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(2, "Category is required"),
  isVegetarian: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  image: z.string().url("Image must be a valid URL").or(z.string().startsWith("/", "Image must be a valid path")),
});

export const foodAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});
