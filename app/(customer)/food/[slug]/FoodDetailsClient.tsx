"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Check } from "lucide-react";

export function FoodDetailsClient({ food }: { food: any }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image || "/images/placeholder.webp"
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={added}
      className={`w-full py-4 rounded-xl font-bold transition-all ${
        added 
          ? "bg-green-600/20 text-green-500 border border-green-600/30 flex items-center justify-center gap-2"
          : "btn btn-primary"
      }`}
    >
      {added ? <><Check className="w-5 h-5" /> Added to Cart</> : "Add to Cart"}
    </button>
  );
}
