"use client";

import { useEffect, useState } from "react";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PropertyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  
  // Local state for filters
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "",
    purpose: searchParams.get("purpose") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
  });

  // Sync with URL when searchParams change (e.g. from hero search)
  useEffect(() => {
    setFilters({
      location: searchParams.get("location") || "",
      type: searchParams.get("type") || "",
      purpose: searchParams.get("purpose") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
    });
  }, [searchParams]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const resetFilters = {
      location: "",
      type: "",
      purpose: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
    };
    setFilters(resetFilters);
    router.push(pathname);
    setIsOpen(false);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Location</label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="City or address..." 
            value={filters.location}
            onChange={(e) => updateFilters({ location: e.target.value })}
            className="w-full pl-4 pr-10 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-blue-500 focus:outline-none transition-colors"
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30" />
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Property Type</label>
        <select 
          value={filters.type}
          onChange={(e) => updateFilters({ type: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
        >
          <option value="">Any Type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="plot">Plot</option>
        </select>
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Purpose</label>
        <div className="flex bg-foreground/5 rounded-lg p-1 border border-foreground/10">
          {["", "buy", "rent"].map((p) => (
            <button
              key={p}
              onClick={() => updateFilters({ purpose: p })}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                filters.purpose === p 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {p === "" ? "Any" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={filters.minPrice}
            onChange={(e) => updateFilters({ minPrice: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-blue-500 focus:outline-none" 
          />
          <span className="text-foreground/30">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={filters.maxPrice}
            onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-blue-500 focus:outline-none" 
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Bedrooms</label>
        <div className="flex flex-wrap gap-2">
          {["", "1", "2", "3", "4", "5+"].map((b) => (
            <button
              key={b}
              onClick={() => updateFilters({ bedrooms: b === "5+" ? "5" : b })}
              className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                (filters.bedrooms === b || (filters.bedrooms === "5" && b === "5+"))
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "bg-foreground/5 border-foreground/10 text-foreground/70 hover:border-foreground/30"
              }`}
            >
              {b === "" ? "Any" : b}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={applyFilters}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:opacity-95 transition-opacity shadow-lg shadow-blue-500/20"
      >
        Apply Filters
      </button>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center justify-center gap-2 w-full py-4 mb-6 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
      >
        <FiFilter /> Show Filters
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-24 bg-background/50 backdrop-blur-xl p-8 rounded-3xl border border-foreground/10 shadow-2xl">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-foreground/10">
          <h3 className="text-2xl font-bold text-foreground">Filters</h3>
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-500 hover:text-blue-600 font-bold transition-colors"
          >
            Clear All
          </button>
        </div>
        {filterContent}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-background z-[70] p-8 md:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-foreground">Filters</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-foreground/5 text-foreground/50"
                >
                  <FiX size={24} />
                </button>
              </div>
              {filterContent}
              <button 
                onClick={clearFilters}
                className="w-full mt-4 py-3 text-foreground/50 font-bold hover:text-foreground transition-colors"
              >
                Clear All
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

