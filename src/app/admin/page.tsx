import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User";

export default async function AdminDashboardPage() {
  await dbConnect();

  const totalProperties = await Property.countDocuments();
  const pendingProperties = await Property.countDocuments({ status: "pending" });
  const totalUsers = await User.countDocuments();

  const stats = [
    { label: "Total Properties", value: totalProperties },
    { label: "Pending Approvals", value: pendingProperties },
    { label: "Registered Users", value: totalUsers },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-foreground/60">Platform overview and general statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 relative overflow-hidden group">
            <h3 className="text-4xl font-black text-blue-500 mb-2">{stat.value}</h3>
            <p className="font-medium text-foreground/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
