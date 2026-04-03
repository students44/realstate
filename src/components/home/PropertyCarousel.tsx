"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import PropertyCard from "../properties/PropertyCard";

interface PropertyCarouselProps {
  properties: any[];
}

export default function PropertyCarousel({ properties }: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleItems(1);
      else if (window.innerWidth < 1024) setVisibleItems(2);
      else setVisibleItems(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = () => {
    if (currentIndex < properties.length - visibleItems) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!properties || properties.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Latest Properties</h2>
          <p className="text-foreground/60">Explore our most recent listings</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={prev}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full border border-foreground/10 transition-all ${
              currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-foreground hover:text-background"
            }`}
          >
            <FiChevronLeft size={24} />
          </button>
          <button 
            onClick={next}
            disabled={currentIndex >= properties.length - visibleItems}
            className={`p-3 rounded-full border border-foreground/10 transition-all ${
              currentIndex >= properties.length - visibleItems ? "opacity-30 cursor-not-allowed" : "hover:bg-foreground hover:text-background"
            }`}
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="relative overflow-visible">
        <motion.div 
          className="flex gap-6"
          animate={{ x: `calc(-${currentIndex * (100 / visibleItems)}% - ${currentIndex * 1.5}rem)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {properties.map((property) => (
            <div 
              key={property._id} 
              className="flex-shrink-0"
              style={{ width: `calc(${100 / visibleItems}% - ${(visibleItems - 1) * 1.5 / visibleItems}rem)` }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
