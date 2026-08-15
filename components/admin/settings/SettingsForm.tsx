"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { restaurantSettingsSchema, RestaurantSettingsInput } from "@/lib/validations/settings";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";

export function SettingsForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const [files, setFiles] = useState<Record<string, File | null>>({
    logo: null,
    favicon: null,
    heroBanner: null,
    aboutImage: null,
    contactImage: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RestaurantSettingsInput>({
    resolver: zodResolver(restaurantSettingsSchema),
    defaultValues: initialData,
  });

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "branding");
    
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const onSubmit = async (data: RestaurantSettingsInput) => {
    try {
      setIsSubmitting(true);
      
      const payload = { ...data };
      
      // Upload pending files
      for (const key of Object.keys(files)) {
        if (files[key]) {
          const url = await uploadFile(files[key] as File);
          payload[key as keyof RestaurantSettingsInput] = url as never;
        }
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update settings");
      }

      toast.success("Settings updated successfully!");
      router.refresh();
      
      // Reset files so we don't re-upload
      setFiles({
        logo: null,
        favicon: null,
        heroBanner: null,
        aboutImage: null,
        contactImage: null,
      });

    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (key: string, file: File | null, url: string) => {
    setFiles(prev => ({ ...prev, [key]: file }));
    if (url) {
      setValue(key as any, url, { shouldValidate: true });
    }
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "contact", label: "Contact" },
    { id: "delivery", label: "Delivery" },
    { id: "branding", label: "Branding" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row h-full min-h-[600px]">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 bg-black/40 border-r border-white/10 flex-shrink-0 p-4 space-y-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              activeTab === tab.id 
                ? "bg-primary text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 relative pb-24">
        {activeTab === "general" && (
          <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">General Settings</h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Restaurant Name</label>
                <input {...register("restaurantName")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                {errors.restaurantName && <p className="text-red-400 text-xs">{errors.restaurantName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Tagline</label>
                <input {...register("tagline")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                {errors.tagline && <p className="text-red-400 text-xs">{errors.tagline.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea {...register("description")} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                {errors.description && <p className="text-red-400 text-xs">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Opening Time</label>
                  <input {...register("openingTime")} type="time" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                  {errors.openingTime && <p className="text-red-400 text-xs">{errors.openingTime.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Closing Time</label>
                  <input {...register("closingTime")} type="time" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                  {errors.closingTime && <p className="text-red-400 text-xs">{errors.closingTime.message}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" {...register("isOpen")} className="w-5 h-5 accent-primary" />
                <label className="text-sm font-medium text-gray-300">Restaurant is Open (accepting orders)</label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Contact & Location</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Phone</label>
                <input {...register("phone")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">WhatsApp</label>
                <input {...register("whatsapp")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                {errors.whatsapp && <p className="text-red-400 text-xs">{errors.whatsapp.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input {...register("email")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Full Address</label>
              <textarea {...register("address")} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
              {errors.address && <p className="text-red-400 text-xs">{errors.address.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Google Maps URL</label>
              <input {...register("googleMapsUrl")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
              {errors.googleMapsUrl && <p className="text-red-400 text-xs">{errors.googleMapsUrl.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Latitude</label>
                <input {...register("latitude", { valueAsNumber: true })} type="number" step="any" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Longitude</label>
                <input {...register("longitude", { valueAsNumber: true })} type="number" step="any" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white pt-6 border-t border-white/10">Social Media</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Facebook URL</label>
                <input {...register("facebook")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Instagram URL</label>
                <input {...register("instagram")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">YouTube URL</label>
                <input {...register("youtube")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "delivery" && (
          <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Delivery & Minimums</h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Delivery Radius (km)</label>
                <input {...register("deliveryRadius", { valueAsNumber: true })} type="number" step="0.1" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                {errors.deliveryRadius && <p className="text-red-400 text-xs">{errors.deliveryRadius.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Standard Delivery Charge (₹)</label>
                <input {...register("deliveryCharge", { valueAsNumber: true })} type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                {errors.deliveryCharge && <p className="text-red-400 text-xs">{errors.deliveryCharge.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Minimum Order Value (₹)</label>
                <input {...register("minimumOrder", { valueAsNumber: true })} type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" />
                {errors.minimumOrder && <p className="text-red-400 text-xs">{errors.minimumOrder.message}</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "branding" && (
          <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Branding & Assets</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ImageUpload 
                label="Restaurant Logo" 
                value={watch("logo")} 
                onChange={(file, url) => handleFileChange("logo", file, url)} 
                aspectRatio="square"
              />
              <ImageUpload 
                label="Favicon (Square)" 
                value={watch("favicon")} 
                onChange={(file, url) => handleFileChange("favicon", file, url)} 
                aspectRatio="square"
              />
              <ImageUpload 
                label="Hero Banner Image" 
                value={watch("heroBanner")} 
                onChange={(file, url) => handleFileChange("heroBanner", file, url)} 
              />
              <ImageUpload 
                label="About Section Image" 
                value={watch("aboutImage")} 
                onChange={(file, url) => handleFileChange("aboutImage", file, url)} 
              />
              <ImageUpload 
                label="Contact Section Banner" 
                value={watch("contactImage")} 
                onChange={(file, url) => handleFileChange("contactImage", file, url)} 
              />
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#111] bg-opacity-95 backdrop-blur flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-semibold text-sm px-8 py-3 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Settings
          </button>
        </div>
      </div>
    </form>
  );
}
