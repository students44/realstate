"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div>
      {/* Main Image */}
      <div 
        className="relative h-[60vh] md:h-[70vh] w-full rounded-2xl overflow-hidden cursor-pointer group"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={images[currentIndex]}
          alt={`${title} - image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">
            Click to view all {images.length} photos
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 mt-6 overflow-x-auto pb-4 snap-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-24 w-36 flex-shrink-0 snap-center rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === idx ? "border-blue-500 scale-105 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white p-2 z-50"
            onClick={() => setIsLightboxOpen(false)}
          >
            <FiX size={32} />
          </button>
          
          <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
            {images.length > 1 && (
              <button 
                className="absolute left-4 md:left-8 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
              >
                <FiChevronLeft size={32} />
              </button>
            )}
            
            <img
              src={images[currentIndex]}
              alt={`${title} - fullscreen`}
              className="max-h-[90vh] max-w-full object-contain"
            />
            
            {images.length > 1 && (
              <button 
                className="absolute right-4 md:right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
              >
                <FiChevronRight size={32} />
              </button>
            )}
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 tracking-widest text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
