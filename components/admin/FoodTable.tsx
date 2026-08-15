"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Food } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, UtensilsCrossed, Leaf, Drumstick, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface FoodTableProps {
  foods: Food[];
  onEdit: (food: Food) => void;
  onDelete: (food: Food) => void;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export function FoodTable({ foods, onEdit, onDelete, totalPages, currentPage, totalItems }: FoodTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      setIsToggling(id);
      const res = await fetch(`/api/admin/foods/${id}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update availability");
      }

      toast.success(`Food marked as ${!currentStatus ? 'available' : 'unavailable'}`);
      router.refresh();
    } catch (error) {
      toast.error("Could not update availability");
    } finally {
      setIsToggling(null);
    }
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-white/5 p-6 rounded-full mb-4 border border-white/10">
          <UtensilsCrossed className="w-12 h-12 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No foods found</h3>
        <p className="text-gray-400 max-w-sm">
          There are no food items matching your current filters. Try adjusting your search or add a new food item.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-sm uppercase tracking-wider text-gray-400">
              <th className="px-6 py-4 font-medium">Item</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Available</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            <AnimatePresence>
              {foods.map((food, idx) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={food.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                        {food.image.startsWith("/") || food.image.startsWith("http") ? (
                          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white group-hover:text-primary transition-colors flex items-center gap-2">
                          {food.name}
                          {food.isSystem && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                              System Dish
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 max-w-[200px] truncate" title={food.slug}>
                          {food.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                      {food.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">₹{food.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${food.isVegetarian ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {food.isVegetarian ? <Leaf className="w-3 h-3" /> : <Drumstick className="w-3 h-3" />}
                      {food.isVegetarian ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleAvailability(food.id, food.isAvailable)}
                      disabled={isToggling === food.id}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#111] disabled:opacity-50 ${food.isAvailable ? 'bg-primary' : 'bg-gray-600'}`}
                      role="switch"
                      aria-checked={food.isAvailable}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${food.isAvailable ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(food)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="Edit Food"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => !food.isSystem && onDelete(food)}
                        disabled={food.isSystem}
                        className={`p-2 rounded-lg transition-all ${food.isSystem ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'}`}
                        title={food.isSystem ? "System dishes cannot be deleted" : "Delete Food"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{foods.length}</span> of <span className="font-medium text-white">{totalItems}</span> results
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <div className="flex gap-1 items-center px-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                // Simple pagination logic for displaying limited pages
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${page === currentPage ? 'bg-primary text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      {page}
                    </button>
                  );
                }
                if (
                  page === currentPage - 2 || 
                  page === currentPage + 2
                ) {
                  return <span key={page} className="text-gray-500">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
