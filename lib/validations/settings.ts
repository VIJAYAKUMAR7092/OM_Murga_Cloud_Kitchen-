import { z } from "zod";

export const restaurantSettingsSchema = z.object({
  restaurantName: z.string().min(2, "Restaurant name is required"),
  tagline: z.string().min(2, "Tagline is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  
  phone: z.string().regex(/^[0-9+\-\s]{10,15}$/, "Invalid phone number format"),
  whatsapp: z.string().regex(/^[0-9+\-\s]{10,15}$/, "Invalid WhatsApp number format"),
  email: z.string().email("Invalid email address"),
  
  address: z.string().min(10, "Address is required"),
  googleMapsUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  
  openingTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be in HH:MM format"),
  closingTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be in HH:MM format"),
  isOpen: z.boolean(),
  
  deliveryRadius: z.number().min(0),
  deliveryCharge: z.number().min(0),
  minimumOrder: z.number().min(0),
  
  facebook: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  instagram: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  youtube: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  
  logo: z.string().min(1, "Logo is required"),
  favicon: z.string().min(1, "Favicon is required"),
  heroBanner: z.string().min(1, "Hero banner is required"),
  aboutImage: z.string().min(1, "About image is required"),
  contactImage: z.string().min(1, "Contact image is required"),
});

export type RestaurantSettingsInput = z.infer<typeof restaurantSettingsSchema>;
