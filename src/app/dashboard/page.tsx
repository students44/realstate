import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User";
import DashboardPropertyCard from "@/components/dashboard/DashboardPropertyCard";
import Link from "next/link";
import { FiPlus, FiArrowRight, FiClock, FiCheckSquare, FiHeart, FiMessageSquare } from "react-icons/fi";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  await dbConnect();

  // Fetch real-time stats
  const activeListings = await Property.countDocuments({ owner: session.user.id, status: "approved" });
  const pendingApprovals = await Property.countDocuments({ owner: session.user.id, status: "pending" });
  
  const user = await User.findById(session.user.id).select("wishlist").lean();
  const savedProperties = user?.wishlist?.length || 0;

  // Recent Listings (My Properties)
  const recentListings = await Property.find({ owner: session.user.id })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean() as any;

  const stats = [
    { label: "Active Listings", value: activeListings, icon: FiCheckSquare, color: "text-green-500" },
    { label: "Pending Approvals", value: pendingApprovals, icon: FiClock, color: "text-yellow-600" },
    { label: "Saved Properties", value: savedProperties, icon: FiHeart, color: "text-pink-500" },
    { label: "Messages", value: "0", icon: FiMessageSquare, color: "text-blue-500" }, // Mock for now
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2 whitespace-nowrap">
            Welcome, {session.user.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-foreground/60 text-lg font-medium">Dashboard overview and quick actions.</p>
        </div>
        <Link href="/dashboard/properties/add" className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group">
           <FiPlus />
           List New Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 hover:border-blue-500/30 transition-all group">
            <div className={`p-3 rounded-2xl bg-foreground/5 w-fit mb-4 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-4xl font-black text-foreground mb-1">{stat.value}</h3>
            <p className="font-bold text-foreground/40 uppercase tracking-widest text-[10px]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Recent Listings */}
        <section className="space-y-6">
           <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-bold">Recent Listings</h2>
              <Link href="/dashboard/properties" className="text-sm font-bold text-blue-500 hover:text-blue-600 flex items-center gap-2 group transition-colors italic">
                Manage All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           
           <div className="space-y-4">
              {recentListings.map((prop: any) => (
                <DashboardPropertyCard key={prop._id.toString()} property={prop} />
              ))}
              
              {recentListings.length === 0 && (
                <div className="p-16 border-2 border-dashed border-foreground/10 rounded-[2.5rem] text-center">
                   <p className="text-foreground/20 font-black text-xl uppercase italic">No listings yet.</p>
                   <Link href="/dashboard/properties/add" className="mt-4 text-sm font-bold text-blue-500 hover:underline inline-block">Start listing now</Link>
                </div>
              )}
           </div>
        </section>

        {/* Messaging Mock (Space for future feature) */}
        <section className="space-y-6">
           <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-bold">Inquiries & Messages</h2>
              <span className="text-[10px] font-black uppercase tracking-widest bg-foreground/5 px-3 py-1 rounded-full text-foreground/40 italic">Placeholder</span>
           </div>
           <div className="bg-foreground/5 border border-foreground/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
              <div className="p-6 bg-blue-500/10 text-blue-500 rounded-full mb-6">
                 <FiMessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Message Center Coming Soon</h3>
              <p className="text-foreground/50 max-w-xs mx-auto leading-relaxed">
                Connect directly with property seekers. We're building your secure inbox as we speak.
              </p>
           </div>
        </section>
      </div>
    </div>
  );
}
