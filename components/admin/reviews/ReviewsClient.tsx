"use client";

import { useState } from "react";
import { Search, Star, Trash2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface Review {
  id: string;
  rating: number;
  review: string | null;
  customerName: string;
  customerPhone: string;
  isApproved: boolean;
  createdAt: Date;
  food: { name: string };
  order: { orderNumber: string };
}

export function ReviewsClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReviews = reviews.filter((r) => {
    const statusMatch = activeTab === "pending" ? !r.isApproved : r.isApproved;
    const searchMatch = 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rating.toString().includes(searchTerm);
    return statusMatch && searchMatch;
  });

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: !currentStatus } : r));
      toast.success(currentStatus ? "Review hidden from public" : "Review approved!");
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      
      setReviews(prev => prev.filter(r => r.id !== id));
      toast.success("Review deleted successfully");
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex bg-[#111] p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "pending" ? "bg-primary text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "approved" ? "bg-primary text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Approved
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/50 border-b border-white/10 text-gray-400">
              <tr>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Food Item</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium">Review</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-white">{review.customerName}</div>
                      <div className="text-xs text-gray-500">{review.customerPhone}</div>
                      <div className="text-xs text-gray-600 mt-0.5">Order #{review.order.orderNumber}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-white bg-white/5 px-2 py-1 rounded-md border border-white/10">
                        {review.food.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-primary text-primary" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-gray-400 line-clamp-2" title={review.review || ""}>
                        {review.review || <span className="italic opacity-50">No text provided</span>}
                      </p>
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleApproval(review.id, review.isApproved)}
                          className={`p-2 rounded-lg transition-colors ${
                            review.isApproved 
                              ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20" 
                              : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                          }`}
                          title={review.isApproved ? "Hide from public" : "Approve for public"}
                        >
                          {review.isApproved ? <EyeOff className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
