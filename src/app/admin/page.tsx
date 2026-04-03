import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User";
import { FiClock, FiCheckSquare, FiAlertCircle, FiUsers } from "react-icons/fi";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await dbConnect();

  // Basic Stats
  const totalProperties = await Property.countDocuments();
  const approvedProperties = await Property.countDocuments({ status: "approved" });
  const pendingProperties = await Property.countDocuments({ status: "pending" });
  const totalUsers = await User.countDocuments();

  // Recent Activity
  const recentProperties = await Property.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("owner", "name");

  const stats = [
    { label: "Total Properties", value: totalProperties, icon: FiCheckSquare, color: "text-blue-500" },
    { label: "Pending Approvals", value: pendingProperties, icon: FiClock, color: "text-yellow-500" },
    { label: "Approved Listings", value: approvedProperties, icon: FiCheckSquare, color: "text-green-500" },
    { label: "Registered Users", value: totalUsers, icon: FiUsers, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-foreground mb-3">Admin Overview</h1>
        <p className="text-foreground/60 text-lg">Real-time platform performance and activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 hover:border-blue-500/30 transition-all group">
            <div className={`p-3 rounded-2xl bg-foreground/5 w-fit mb-4 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-4xl font-black text-foreground mb-1">{stat.value}</h3>
            <p className="font-bold text-foreground/40 uppercase tracking-widest text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Properties */}
        <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Recent Submissions</h2>
            <Link href="/admin/properties" className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentProperties.map((prop) => (
              <div key={prop._id.toString()} className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-foreground/5 hover:border-foreground/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center text-foreground/30 font-bold overflow-hidden">
                    {prop.images?.[0] ? (
                      <img src={prop.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                       "?"
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground line-clamp-1">{prop.title}</h4>
                    <p className="text-sm text-foreground/40">{prop.owner?.name || "Anonymous Owner"}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                   prop.status === "approved" ? "bg-green-500/10 text-green-500" :
                   prop.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                   "bg-red-500/10 text-red-500"
                }`}>
                  {prop.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links / Future Stats */}
        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-3xl p-8 flex flex-col justify-center">
            <div className="max-w-md">
              <h2 className="text-3xl font-black text-foreground mb-4">Master Controls</h2>
              <p className="text-foreground/60 mb-8 leading-relaxed">
                Manage your platform listings, verify users, and monitor activities. Asmerat Real Estate admin panel is updated in real-time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/admin/properties" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                  Review Pending
                </Link>
                <Link href="/admin/users" className="px-6 py-3 bg-foreground/10 text-foreground rounded-xl font-bold hover:bg-foreground/20 transition-colors">
                  Manage Users
                </Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
