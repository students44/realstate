"use client";

import { FiEdit, FiTrash2, FiEye, FiMapPin } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DashboardPropertyCardProps {
  property: {
    _id: string;
    title: string;
    price: number;
    slug: string;
    status: string;
    images: string[];
    location?: { address: string; city: string };
  };
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

export default function DashboardPropertyCard({ 
  property, 
  showActions = true, 
  onDelete 
}: DashboardPropertyCardProps) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const res = await fetch(`/api/properties/${property._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Listing deleted!");
        onDelete?.(property._id);
        router.refresh();
      } else {
        toast.error("Failed to delete listing");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-4 flex flex-col sm:flex-row items-center gap-6 hover:border-blue-500/30 transition-all group">
      {/* Thumbnail */}
      <div className="w-full sm:w-32 h-32 rounded-2xl bg-foreground/10 overflow-hidden shrink-0 relative">
        <img 
          src={property.images?.[0] || "https://placehold.co/400x400?text=No+Image"} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute top-2 left-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
           ${property.price.toLocaleString()}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${
             property.status === "approved" ? "bg-green-500/10 text-green-500" :
             property.status === "pending" ? "bg-yellow-500/10 text-yellow-600" :
             "bg-red-500/10 text-red-500"
          }`}>
             {property.status}
          </span>
          <Link href={`/properties/${property.slug}`} className="text-lg font-bold text-foreground hover:text-blue-500 transition-colors truncate block">
            {property.title}
          </Link>
        </div>
        
        <div className="flex items-center gap-2 text-foreground/40 text-sm font-medium">
          <FiMapPin size={14} className="shrink-0" />
          <span className="truncate">{property.location?.address}, {property.location?.city}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link 
          href={`/properties/${property.slug}`}
          className="p-3 bg-foreground/5 hover:bg-blue-500/10 text-foreground/60 hover:text-blue-500 rounded-xl transition-all"
          title="View Listing"
        >
          <FiEye size={18} />
        </Link>
        
        {showActions && (
          <>
            <Link 
              href={`/dashboard/properties/edit/${property._id}`}
              className="p-3 bg-foreground/5 hover:bg-blue-500/10 text-foreground/60 hover:text-blue-500 rounded-xl transition-all"
              title="Edit Listing"
            >
              <FiEdit size={18} />
            </Link>
            <button 
              onClick={handleDelete}
              className="p-3 bg-foreground/5 hover:bg-red-500/10 text-foreground/60 hover:text-red-500 rounded-xl transition-all cursor-pointer"
              title="Delete Listing"
            >
              <FiTrash2 size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
