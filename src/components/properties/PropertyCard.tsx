import { FiMapPin, FiMaximize, FiHeart } from "react-icons/fi";
import { FaBed, FaBath } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

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
}

export default function PropertyCard({ property }: PropertyProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group bg-foreground/5 rounded-2xl overflow-hidden border border-foreground/10 hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 relative">
      <Link href={`/properties/${property.slug}`} className="block relative h-64 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
            <span className="text-foreground/50">No Image Available</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4 flex gap-2">
          {property.isFeatured && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              Featured
            </span>
          )}
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            For {property.purpose}
          </span>
        </div>
        <button className="absolute top-4 right-4 p-2 bg-background/80 hover:bg-red-50 text-foreground/50 hover:text-red-500 rounded-full transition-colors shadow-md z-1">
          <FiHeart size={20} />
        </button>
        <div className="absolute bottom-4 left-4 right-4 z-1">
          <span className="text-2xl font-extrabold text-white drop-shadow-md">
            {formatPrice(property.price)}
          </span>
        </div>
        {/* Dark gradient overlay for price readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </Link>

      <div className="p-6">
        <Link href={`/properties/${property.slug}`}>
          <h3 className="text-xl font-bold text-foreground mb-2 hover:text-blue-500 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </Link>
        <div className="flex items-center text-foreground/60 mb-4 text-sm">
          <FiMapPin className="mr-1" />
          <span className="truncate">{property.location.address}, {property.location.city}</span>
        </div>

        <div className="flex justify-between items-center py-4 border-t border-foreground/10 text-foreground/80">
          <div className="flex items-center gap-2" title="Bedrooms">
            <FaBed className="text-blue-500" />
            <span className="font-semibold">{property.bedrooms || "-"}</span>
          </div>
          <div className="flex items-center gap-2" title="Bathrooms">
            <FaBath className="text-blue-500" />
            <span className="font-semibold">{property.bathrooms || "-"}</span>
          </div>
          <div className="flex items-center gap-2" title="Area">
            <FiMaximize className="text-blue-500" />
            <span className="font-semibold">{property.area} <span className="text-xs">{property.areaUnit}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
