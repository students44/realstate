import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Property from "@/models/Property"; // Ensure model is registered
import DashboardPropertyCard from "@/components/dashboard/DashboardPropertyCard";
import { FiHeart, FiSearch } from "react-icons/fi";
import Link from "next/link";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  await dbConnect();

  // Fetch user and populate wishlist
  const user = await User.findById(session.user.id)
    .populate({
      path: "wishlist",
      model: Property,
    })
    .lean();

  const wishlistItems = user?.wishlist || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 text-pink-500 mb-2">
            <FiHeart size={20} className="fill-current" />
            <span className="font-black uppercase tracking-widest text-xs italic">Favorites & Saves</span>
          </div>
          <h1 className="text-4xl font-black text-foreground mb-2">My Wishlist</h1>
          <p className="text-foreground/60 text-lg font-medium">You have {wishlistItems.length} properties saved for later.</p>
        </div>
        <Link href="/properties" className="px-8 py-3 bg-foreground text-background rounded-2xl font-black flex items-center gap-3 hover:opacity-90 transition-all shadow-xl active:scale-95">
           <FiSearch />
           Explore More
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wishlistItems.map((prop: any) => (
          <DashboardPropertyCard 
            key={prop._id.toString()} 
            property={prop} 
            showActions={false} // Users don't manage others' properties
          />
        ))}

        {wishlistItems.length === 0 && (
          <div className="col-span-1 md:col-span-2 py-32 border-2 border-dashed border-foreground/10 rounded-[3rem] text-center flex flex-col items-center justify-center bg-foreground/5">
             <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center text-foreground/20 mb-6">
                <FiHeart size={40} />
             </div>
             <h3 className="text-2xl font-black text-foreground mb-4">Your Wishlist is Empty</h3>
             <p className="text-foreground/50 max-w-sm mb-8 leading-relaxed">
               Start exploring our collection of high-end properties and save your favorites here.
             </p>
             <Link href="/properties" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:opacity-90 transition-all active:scale-95">
                Browse Properties
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
