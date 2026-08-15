"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Food } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteFoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  food: Food | null;
}

export function DeleteFoodDialog({ isOpen, onClose, food }: DeleteFoodDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!food) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/foods/${food.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete food");
      }

      toast.success(`${food.name} has been deleted successfully.`);
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Could not delete food. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && food && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-xl font-bold">Delete Food Item</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-300">
                Are you sure you want to delete <span className="text-white font-semibold">{food.name}</span>? 
              </p>
              <p className="text-gray-500 mt-2 text-sm">
                This item will be removed from the menu and customer app. This action can only be undone by an administrator through the database.
              </p>
            </div>

            <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-gray-300 font-medium hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete Item"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
