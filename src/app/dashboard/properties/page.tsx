import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import DashboardPropertyCard from "@/components/dashboard/DashboardPropertyCard";
import Link from "next/link";
import { FiPlus, FiGrid } from "react-icons/fi";

export default async function MyPropertiesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  await dbConnect();

  const properties = await Property.find({ owner: session.user.id })
    .sort({ createdAt: -1 })
    .lean() as any;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 text-blue-500 mb-2">
            <FiGrid size={20} />
            <span className="font-black uppercase tracking-widest text-xs italic">Asset Management</span>
          </div>
          <h1 className="text-4xl font-black text-foreground mb-2">My Properties</h1>
          <p className="text-foreground/60 text-lg font-medium">You have {properties.length} listings on Asmerat.</p>
        </div>
        <Link href="/dashboard/properties/add" className="px-8 py-3 bg-foreground text-background rounded-2xl font-black flex items-center gap-3 hover:opacity-90 transition-all shadow-xl active:scale-95">
           <FiPlus />
           Add New Listing
        </Link>
      </div>

      <div className="space-y-6">
        {properties.map((prop: any) => (
          <DashboardPropertyCard key={prop._id.toString()} property={prop} />
        ))}

        {properties.length === 0 && (
          <div className="py-32 border-2 border-dashed border-foreground/10 rounded-[3rem] text-center flex flex-col items-center justify-center bg-foreground/5">
             <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center text-foreground/20 mb-6">
                <FiGrid size={40} />
             </div>
             <h3 className="text-2xl font-black text-foreground mb-4">No Listings Found</h3>
             <p className="text-foreground/50 max-w-sm mb-8 leading-relaxed">
               You haven't listed any properties yet. Start reaching thousands of potential buyers today.
             </p>
             <Link href="/dashboard/properties/add" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:opacity-90 transition-all active:scale-95">
                List Your First Property
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
