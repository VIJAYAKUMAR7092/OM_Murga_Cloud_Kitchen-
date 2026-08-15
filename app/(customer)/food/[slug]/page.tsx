import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Star } from "lucide-react";
import { FoodDetailsClient } from "./FoodDetailsClient";

export default async function FoodDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const food = await prisma.food.findUnique({
    where: { slug, isDeleted: false, isAvailable: true },
    include: {
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!food) {
    notFound();
  }

  const averageRating = food.reviews.length > 0
    ? (food.reviews.reduce((acc, curr) => acc + curr.rating, 0) / food.reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Food Info */}
        <div className="flex flex-col md:flex-row gap-8 items-start bg-card border border-border p-6 rounded-2xl">
          <div className="w-full md:w-1/2 aspect-square relative rounded-xl overflow-hidden bg-muted/20 border border-border/50">
            <Image 
              src={food.image || "/images/placeholder.webp"} 
              alt={food.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col h-full">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary border border-primary/30 bg-primary/10 px-2 py-1 rounded">
                {food.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 text-foreground">{food.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              {food.reviews.length > 0 ? (
                <>
                  <div className="flex gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <span className="font-bold text-lg">{averageRating}</span>
                  <span className="text-muted-foreground text-sm">({food.reviews.length} Reviews)</span>
                </>
              ) : (
                <span className="text-muted-foreground text-sm">No reviews yet</span>
              )}
            </div>

            <p className="text-muted-foreground mb-8 text-lg">{food.description}</p>
            
            <div className="mt-auto">
              <span className="text-3xl font-bold text-primary">₹{food.price}</span>
            </div>
            
            <div className="mt-6">
               <FoodDetailsClient food={food} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
            Approved Reviews
          </h2>

          {food.reviews.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
              No reviews yet. Be the first to order and review!
            </div>
          ) : (
            <div className="space-y-4">
              {food.reviews.map((review) => (
                <div key={review.id} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{review.customerName}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.review && (
                    <p className="text-muted-foreground mt-3 italic">&quot;{review.review}&quot;</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
