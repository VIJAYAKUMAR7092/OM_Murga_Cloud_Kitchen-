import { Metadata } from "next";
import { ReviewsClient } from "@/components/admin/reviews/ReviewsClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Reviews Management | Admin",
};

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      food: { select: { name: true } },
      order: { select: { orderNumber: true } },
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Manage customer ratings and reviews.
        </p>
      </div>

      <ReviewsClient initialReviews={reviews} />
    </div>
  );
}
