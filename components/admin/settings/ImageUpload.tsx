import React, { useRef, useState, useEffect } from "react";
import { Upload, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (file: File | null, previewUrl: string) => void;
  aspectRatio?: string;
}

export function ImageUpload({ label, value, onChange, aspectRatio = "video" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(value);

  useEffect(() => {
    setPreviewImage(value);
  }, [value]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    onChange(file, objectUrl);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(null);
    onChange(null, "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const heightClass = aspectRatio === "square" ? "aspect-square w-40" : "h-[140px] w-full";

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImageChange}
      />
      
      {previewImage ? (
        <div className={`relative rounded-xl border border-white/10 overflow-hidden group ${heightClass}`}>
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
          className={`rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer group ${heightClass}`}
        >
          <Upload className="w-8 h-8 mb-2 group-hover:text-primary transition-colors" />
          <span className="text-sm font-medium">Click to upload</span>
        </div>
      )}
    </div>
  );
}
