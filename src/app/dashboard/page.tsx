import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  const stats = [
    { label: "Active Listings", value: "3" },
    { label: "Pending Approvals", value: "1" },
    { label: "Saved Properties", value: "12" },
    { label: "Unread Messages", value: "5" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          Welcome back, {session?.user?.name?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-foreground/60">Here is an overview of your real estate activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24">
                 <path d="M12 3v18m9-9H3" />
              </svg>
            </div>
            <h3 className="text-4xl font-black text-blue-500 mb-2">{stat.value}</h3>
            <p className="font-medium text-foreground/70">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
           <h3 className="text-xl font-bold mb-4">Recent Messages</h3>
           <div className="space-y-4">
              <div className="p-4 bg-background rounded-xl border border-foreground/5">
                 <div className="flex justify-between items-start mb-2">
                    <span className="font-bold">John Doe</span>
                    <span className="text-xs text-foreground/50">2 hours ago</span>
                 </div>
                 <p className="text-sm text-foreground/70 truncate">I'm interested in the Modern Glass Villa...</p>
              </div>
               <div className="p-4 bg-background rounded-xl border border-foreground/5 opacity-70">
                 <div className="flex justify-between items-start mb-2">
                    <span className="font-bold">Sarah Smith</span>
                    <span className="text-xs text-foreground/50">Yesterday</span>
                 </div>
                 <p className="text-sm text-foreground/70 truncate">Is the price negotiable on the downtown apt?</p>
              </div>
           </div>
        </div>

        <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
           <h3 className="text-xl font-bold mb-4">Your Listings Status</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-background rounded-xl border border-foreground/5">
                 <span className="font-medium truncate max-w-[60%]">Luxury Penthouse NY</span>
                 <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase">Approved</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-background rounded-xl border border-foreground/5">
                 <span className="font-medium truncate max-w-[60%]">Suburban Family Home</span>
                 <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-bold uppercase">Pending</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
