import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { FiSearch, FiMail, FiCalendar, FiShield } from "react-icons/fi";

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { q } = await searchParams;
  await dbConnect();

  // Search query
  let query: any = {};
  if (q) {
    query = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    };
  }

  const users = await User.find(query).sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">User Registry</h1>
          <p className="text-foreground/60 text-lg font-medium">Manage and monitor platform members.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
          <form method="get" action="/admin/users" className="contents">
            <input 
              type="text" 
              name="q"
              defaultValue={q as string || ""}
              placeholder="Search users..." 
              className="w-full pl-12 pr-4 py-3 bg-foreground/5 border border-foreground/10 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
            />
          </form>
        </div>
      </div>

      <div className="bg-foreground/5 border border-foreground/10 rounded-[2rem] overflow-hidden shadow-sm backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/5 text-foreground/40 border-b border-foreground/10 text-[10px] uppercase font-black tracking-widest">
                <th className="p-6">User Details</th>
                <th className="p-6">Contact Info</th>
                <th className="p-6">Role</th>
                <th className="p-6">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5 font-medium">
              {users.map((user: any) => (
                <tr key={user._id.toString()} className="hover:bg-foreground/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{user.name}</h4>
                        <span className="text-[10px] text-foreground/30 font-black uppercase tracking-tighter">ID: {String(user._id).slice(-6)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-foreground/70">
                      <FiMail size={14} className="text-blue-500" />
                      {user.email}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${
                      user.role === "admin" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }`}>
                      <FiShield size={12} />
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-foreground/40 text-sm">
                      <FiCalendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString("en-US", { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center font-bold text-foreground/20">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
