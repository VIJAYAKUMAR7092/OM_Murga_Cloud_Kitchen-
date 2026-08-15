import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const MENU_ITEMS = [
  // LUNCH
  { name: "Non-Veg Meals", slug: "non-veg-meals-lunch", description: "Premium meal combo complete with chicken gravy, boiled egg, and authentic rasam.", price: 180, category: "Lunch", isVegetarian: false, isAvailable: true, isSystem: true, image: "/images/food/lunch/non-veg-meals.webp" },
  { name: "Tomato Rice", slug: "tomato-rice-lunch", description: "Tangy and spicy South Indian rice flavored with tomatoes and spices.", price: 80, category: "Lunch", isVegetarian: true, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "Sambar Rice", slug: "sambar-rice-lunch", description: "Comforting mix of rice and lentils cooked together with fresh vegetables.", price: 80, category: "Lunch", isVegetarian: true, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "Ghee Rice", slug: "ghee-rice-lunch", description: "Aromatic basmati rice cooked with pure ghee and whole spices.", price: 100, category: "Lunch", isVegetarian: true, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "CM's Chicken", slug: "cms-chicken-lunch", description: "Our secret signature chicken preparation, rich in flavor and spices.", price: 160, category: "Lunch", isVegetarian: false, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "Pepper Chicken", slug: "pepper-chicken-lunch", description: "Tender chicken pieces pan-roasted with fresh crushed black pepper and curry leaves.", price: 150, category: "Lunch", isVegetarian: false, isAvailable: true, isSystem: true, image: "/images/food/specials/pepper-chicken.webp" },
  { name: "Chilli Chicken", slug: "chilli-chicken-lunch", description: "Spicy, deep-fried chicken bites tossed with green chilies and bell peppers.", price: 150, category: "Lunch", isVegetarian: false, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "Boiled Egg", slug: "boiled-egg-lunch", description: "Perfectly hard-boiled egg.", price: 20, category: "Lunch", isVegetarian: false, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "Egg Bhurji", slug: "egg-bhurji-lunch", description: "Spiced Indian-style scrambled eggs with onions and green chilies.", price: 60, category: "Lunch", isVegetarian: false, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },

  // DINNER
  { name: "Idly", slug: "idly-dinner", description: "Soft fluffy white idlis served with traditional coconut chutney and sambar.", price: 40, category: "Dinner", isVegetarian: true, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "Dosa", slug: "dosa-dinner", description: "Crispy golden traditional South Indian crepe served with chutneys.", price: 50, category: "Dinner", isVegetarian: true, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "Onion Dosa", slug: "onion-dosa-dinner", description: "Crispy dosa topped with finely chopped onions and herbs.", price: 70, category: "Dinner", isVegetarian: true, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "Podi Dosa", slug: "podi-dosa-dinner", description: "Spicy and flavorful dosa coated with traditional lentil spice powder.", price: 65, category: "Dinner", isVegetarian: true, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "Ghee Dosa", slug: "ghee-dosa-dinner", description: "Rich and crispy dosa roasted in pure, aromatic ghee.", price: 80, category: "Dinner", isVegetarian: true, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "Muttai Dosa", slug: "muttai-dosa-dinner", description: "Protein-rich dosa layered with a perfectly spread egg.", price: 80, category: "Dinner", isVegetarian: false, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" },
  { name: "Special Dosa", slug: "special-dosa-dinner", description: "Our signature crispy dosa with special fillings and extra ghee.", price: 90, category: "Dinner", isVegetarian: true, isAvailable: true, isSystem: true, image: "/images/food/specials/special-dosa.webp" },
  { name: "Chapathi", slug: "chapathi-dinner", description: "Soft, whole wheat Indian flatbread.", price: 40, category: "Dinner", isVegetarian: true, isAvailable: true, isSystem: true, image: "/images/placeholder.webp" }
];

export async function GET() {
  try {
    const logs = [];
    
    // Seed Admin
    const email = "admin@ommurga.com";
    const plainPassword = "Admin@123";

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!existingAdmin) {
      const passwordHash = await hashPassword(plainPassword);
      await prisma.admin.create({
        data: { email, passwordHash },
      });
      logs.push(`Admin created: ${email}`);
    } else {
      logs.push("Admin already exists.");
    }

    // Seed Foods
    for (const item of MENU_ITEMS) {
      const existingFood = await prisma.food.findUnique({
        where: { slug: item.slug },
      });

      if (!existingFood) {
        await prisma.food.create({ data: item });
      }
    }
    logs.push("Foods seeded.");

    // Seed RestaurantSettings
    const existingSettings = await prisma.restaurantSettings.findUnique({
      where: { id: "singleton" },
    });

    if (!existingSettings) {
      await prisma.restaurantSettings.create({
        data: {
          id: "singleton",
          restaurantName: "Om Murga Cloud Kitchen",
          tagline: "Premium Food Delivery",
          description: "Experience the luxury of authentic taste delivered to your doorstep in Coimbatore.",
          phone: "9092077915",
          whatsapp: "9092077915",
          email: "contact@ommurga.com",
          address: "9, Annamalai Residency, Krishna Garden, Kalapatti Road, Veeriyampalayam, Coimbatore - 641048",
          googleMapsUrl: "https://maps.google.com",
          latitude: 11.0500,
          longitude: 77.0279,
          openingTime: "06:30",
          closingTime: "21:00",
          isOpen: true,
          deliveryRadius: 7.0,
          deliveryCharge: 50.0,
          minimumOrder: 0.0,
          logo: "/images/brand/official-logo.jpg",
          favicon: "/favicon.ico",
          heroBanner: "/images/hero-bg.webp",
          aboutImage: "/images/brand/murugan-vel.jpg",
          contactImage: "/images/contact-bg.webp",
        }
      });
      logs.push("RestaurantSettings seeded.");
    }

    return NextResponse.json({ success: true, message: "Database Seeded successfully!", logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
