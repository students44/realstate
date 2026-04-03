"use client";

import { motion } from "framer-motion";
import { FiMapPin, FiMaximize, FiHeart } from "react-icons/fi";
import { FaBed, FaBath } from "react-icons/fa";
import Link from "next/link";

interface PropertyProps {
  property: {
    _id: string;
    title: string;
    slug: string;
    price: number;
    propertyType: string;
    purpose: string;
    bedrooms?: number;
    bathrooms?: number;
    area: number;
    areaUnit: string;
    location: {
      address: string;
      city: string;
    };
    images: string[];
    isFeatured?: boolean;
  };
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-foreground/5 rounded-3xl overflow-hidden border border-foreground/10 hover:shadow-2xl hover:border-blue-500/50 transition-all duration-500 relative"
    >
      <Link href={`/properties/${property.slug}`} className="block relative h-72 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
            <span className="text-foreground/50">No Image Available</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4 flex gap-2">
          {property.isFeatured && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Featured
            </span>
          )}
          <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
            For {property.purpose}
          </span>
        </div>
        <button className="absolute top-4 right-4 p-3 bg-background/80 backdrop-blur-md hover:bg-red-500 text-foreground/50 hover:text-white rounded-full transition-all shadow-lg z-10">
          <FiHeart size={20} />
        </button>
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <span className="text-3xl font-extrabold text-white drop-shadow-2xl">
            {formatPrice(property.price)}
          </span>
        </div>
        {/* Dark gradient overlay for price readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </Link>

      <div className="p-8">
        <Link href={`/properties/${property.slug}`}>
          <h3 className="text-2xl font-bold text-foreground mb-3 hover:text-blue-500 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </Link>
        <div className="flex items-center text-foreground/60 mb-6 text-sm">
          <FiMapPin className="mr-2 text-blue-500" />
          <span className="truncate">{property.location.address}, {property.location.city}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-foreground/10 text-foreground/80">
          <div className="flex flex-col items-center gap-1" title="Bedrooms">
            <FaBed className="text-blue-500 text-xl" />
            <span className="font-bold text-lg">{property.bedrooms || "-"}</span>
            <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Beds</span>
          </div>
          <div className="flex flex-col items-center gap-1" title="Bathrooms">
            <FaBath className="text-blue-500 text-xl" />
            <span className="font-bold text-lg">{property.bathrooms || "-"}</span>
            <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Baths</span>
          </div>
          <div className="flex flex-col items-center gap-1" title="Area">
            <FiMaximize className="text-blue-500 text-xl" />
            <span className="font-bold text-lg">{property.area}</span>
            <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">{property.areaUnit}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

