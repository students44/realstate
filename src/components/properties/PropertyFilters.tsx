"use client";

import { useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";

export default function PropertyFilters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-center gap-2 w-full py-3 mb-4 bg-foreground/5 rounded-lg border border-foreground/10 text-foreground font-medium"
      >
        <FiFilter /> {isOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className={`${isOpen ? "block" : "hidden"} md:block sticky top-24 bg-background/50 backdrop-blur-md p-6 rounded-2xl border border-foreground/10 shadow-lg`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-foreground/10">
          <h3 className="text-xl font-bold text-foreground">Filters</h3>
          <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">Clear All</button>
        </div>

        <div className="space-y-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Location</label>
            <input 
              type="text" 
              placeholder="City, neighborhood, or postcode" 
              className="w-full px-4 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Property Type</label>
            <select className="w-full px-4 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-blue-500 focus:outline-none transition-colors appearance-none">
              <option value="">Any</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="plot">Plot</option>
            </select>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Purpose</label>
            <div className="flex bg-foreground/5 rounded-lg p-1 border border-foreground/10">
              <button className="flex-1 py-2 text-sm font-medium rounded-md bg-background shadow-sm text-foreground">
                Any
              </button>
              <button className="flex-1 py-2 text-sm font-medium rounded-md text-foreground/70 hover:text-foreground">
                Buy
              </button>
              <button className="flex-1 py-2 text-sm font-medium rounded-md text-foreground/70 hover:text-foreground">
                Rent
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min" className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-blue-500 focus:outline-none" />
              <span className="text-foreground/50">-</span>
              <input type="number" placeholder="Max" className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
