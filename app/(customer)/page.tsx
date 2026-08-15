import { Hero } from "@/components/customer/home/Hero";
import { FoodExperience } from "@/components/customer/food-experience/FoodExperience";
import { FeaturedDishes } from "@/components/customer/featured-dishes/FeaturedDishes";
import { WhyChoose } from "@/components/customer/why-choose/WhyChoose";
import { DeliveryAreas } from "@/components/customer/delivery-areas/DeliveryAreas";
import { Testimonials } from "@/components/customer/testimonials/Testimonials";
import { ContactCTA } from "@/components/customer/contact-cta/ContactCTA";
import { getCustomerFoods } from "@/server/queries/customer-foods";

export default async function Home() {
  const allFoods = await getCustomerFoods();
  // Select specific premium items for the homepage to maintain marketing aesthetics
  const premiumSlugs = [
    "special-dosa-breakfast",
    "veg-meals-lunch",
    "non-veg-meals-lunch",
    "pepper-chicken-lunch",
    "idly-breakfast",
    "poori-breakfast"
  ];
  
  const featuredDishes = premiumSlugs
    .map(slug => allFoods.find(f => f.slug === slug))
    .filter((f): f is NonNullable<typeof f> => f !== undefined)
    .slice(0, 6);
  
  // Fallback if some aren't found
  if (featuredDishes.length < 6) {
    const missing = 6 - featuredDishes.length;
    const additional = allFoods.filter(f => !featuredDishes.includes(f)).slice(0, missing);
    featuredDishes.push(...additional);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FoodExperience />
      <FeaturedDishes featuredDishes={featuredDishes} />
      <WhyChoose />
      <DeliveryAreas />
      <Testimonials />
      <ContactCTA />
    </div>
  );
}
