"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Food } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Loader2, Upload, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { foodSchema } from "@/lib/validations/food";
import { z } from "zod";
import toast from "react-hot-toast";

type FoodFormValues = z.input<typeof foodSchema>;

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: Food | null;
}

export function FoodModal({ isOpen, onClose, food }: FoodModalProps) {
  const router = useRouter();
  const isEditing = !!food;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FoodFormValues>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      category: "Breakfast",
      isVegetarian: false,
      isAvailable: true,
      image: "/placeholder.jpg",
    },
  });

  const watchName = watch("name");
  const watchSlug = watch("slug");

  useEffect(() => {
    if (!isEditing && watchName && (!watchSlug || watchSlug === generateSlug(watchName.slice(0, -1)))) {
      setValue("slug", generateSlug(watchName), { shouldValidate: true });
    }
  }, [watchName, isEditing, setValue, watchSlug]);

  useEffect(() => {
    if (isOpen) {
      if (food) {
        reset({
          name: food.name,
          slug: food.slug,
          description: food.description,
          price: food.price,
          category: food.category,
          isVegetarian: food.isVegetarian,
          isAvailable: food.isAvailable,
          image: food.image,
        });
        setPreviewImage(food.image.startsWith("/") || food.image.startsWith("http") ? food.image : null);
      } else {
        reset({
          name: "",
          slug: "",
          description: "",
          price: 0,
          category: "Breakfast",
          isVegetarian: false,
          isAvailable: true,
          image: "/placeholder.jpg",
        });
        setPreviewImage(null);
      }
      setSelectedFile(null);
    }
  }, [isOpen, food, reset]);

  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    
    // For now, we just keep the form image state as placeholder.
    // In Phase 24, this will be uploaded and a real URL will be set.
    setValue("image", objectUrl, { shouldValidate: true });
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(null);
    setSelectedFile(null);
    setValue("image", "/placeholder.jpg", { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FoodFormValues) => {
    try {
      setIsSubmitting(true);
      
      let finalImageUrl = data.image;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Failed to upload image");
        }
        
        finalImageUrl = uploadData.url;
      }

      const payload = { ...data, image: finalImageUrl };

      const url = isEditing ? `/api/admin/foods/${food?.id}` : `/api/admin/foods`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(isEditing ? "Food updated successfully" : "Food created successfully");
      router.refresh();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header (Sticky) */}
            <div className="flex-none flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#111] z-10">
              <h2 className="text-xl font-bold text-white">
                {isEditing ? "Edit Food Item" : "Add New Food"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <form id="food-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Food Name</label>
                    <input
                      {...register("name")}
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                      placeholder="e.g. Chicken Biryani"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs">{errors.name.message as string}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">URL Slug</label>
                    <input
                      {...register("slug")}
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                      placeholder="e.g. chicken-biryani"
                    />
                    {errors.slug && (
                      <p className="text-red-400 text-xs">{errors.slug.message as string}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Category</label>
                    <select
                      {...register("category")}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer appearance-none text-sm"
                    >
                      {food?.category && !["Breakfast", "Lunch", "Dinner"].includes(food.category) && (
                        <option value={food.category} disabled className="bg-[#111]">
                          {food.category} (Warning: Unknown)
                        </option>
                      )}
                      <option value="Breakfast" className="bg-[#111]">Breakfast</option>
                      <option value="Lunch" className="bg-[#111]">Lunch</option>
                      <option value="Dinner" className="bg-[#111]">Dinner</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-400 text-xs">{errors.category.message as string}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Price (₹)</label>
                    <input
                      {...register("price", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="text-red-400 text-xs">{errors.price.message as string}</p>
                    )}
                  </div>

                  {/* Veg Toggle */}
                  <div className="space-y-1.5 flex flex-col justify-center mt-2 md:mt-0">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          {...register("isVegetarian")}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 transition-colors"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Vegetarian</span>
                    </label>
                  </div>

                  {/* Availability Toggle */}
                  <div className="space-y-1.5 flex flex-col justify-center mt-2 md:mt-0">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          {...register("isAvailable")}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary transition-colors"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Available to Order</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Description</label>
                  <textarea
                    {...register("description")}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none custom-scrollbar text-sm"
                    placeholder="Describe the food item..."
                  />
                  {errors.description && (
                    <p className="text-red-400 text-xs">{errors.description.message as string}</p>
                  )}
                </div>

                {/* Image Upload UI */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Food Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageChange}
                  />
                  
                  {previewImage ? (
                    <div className="relative w-full h-[140px] md:h-[180px] rounded-xl border border-white/10 overflow-hidden group">
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 bg-white/10 hover:bg-primary hover:text-black text-white rounded-full transition-colors"
                          title="Change Image"
                        >
                          <Upload className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-2 bg-white/10 hover:bg-red-500 hover:text-white text-white rounded-full transition-colors"
                          title="Remove Image"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-[140px] md:h-[180px] rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer group"
                    >
                      <Upload className="w-8 h-8 mb-2 group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium">Click to upload image</span>
                      <span className="text-xs text-gray-600 mt-1">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                  {errors.image && (
                    <p className="text-red-400 text-xs">{errors.image.message as string}</p>
                  )}
                </div>

              </form>
            </div>

            {/* Footer (Sticky) */}
            <div className="flex-none p-5 border-t border-white/10 bg-[#111] z-10 flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-lg text-sm text-gray-300 font-medium hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="food-form"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-semibold text-sm px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Save Food"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
