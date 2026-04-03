"use client";

import { useState, useCallback } from "react";
import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [...images];
    const fileArray = Array.from(files);

    const readFile = (file: File) => {
      return new Promise<string>((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image!`);
          return reject();
        }
        
        // Limit to 2MB per image for Base64 storage
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 2MB for demo)`);
          return reject();
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    };

    try {
      const base64Strings = await Promise.all(fileArray.map(readFile));
      onChange([...newImages, ...base64Strings]);
      toast.success(`${fileArray.length} images added!`);
    } catch (err) {
      console.error("Upload error:", err);
    }
  }, [images, onChange]);

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files); }}
        className={`relative border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center gap-4 group cursor-pointer ${
          isDragging ? "border-blue-500 bg-blue-500/5" : "border-foreground/10 hover:border-blue-500/30 hover:bg-foreground/5"
        }`}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className={`p-5 rounded-3xl bg-foreground/5 transition-colors ${isDragging ? "bg-blue-500/10 text-blue-500" : "group-hover:text-blue-500"}`}>
          <FiUploadCloud size={32} />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">Drag & Drop Property Photos</p>
          <p className="text-sm text-foreground/40 font-medium">PNG, JPG or WebP (max 2MB per file)</p>
        </div>
      </div>

      {/* Previews Grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {images.map((src, idx) => (
              <motion.div 
                key={idx}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden group border border-foreground/10"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 active:scale-95"
                >
                  <FiX size={14} />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] font-black rounded uppercase tracking-tighter">
                  Image {idx + 1}
                </div>
              </motion.div>
            ))}
            
            {/* Slot placeholder if space */}
            <div className="border border-dashed border-foreground/10 rounded-2xl flex items-center justify-center text-foreground/10 aspect-square">
               <FiImage size={24} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
