import { FiHome, FiHeart, FiSettings, FiMessageSquare, FiPlusSquare } from "react-icons/fi";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: FiHome },
    { label: "Add Property", href: "/dashboard/properties/add", icon: FiPlusSquare },
    { label: "My Properties", href: "/dashboard/properties", icon: FiHome }, // Use similar for now
    { label: "Wishlist", href: "/dashboard/wishlist", icon: FiHeart },
    { label: "Messages", href: "/dashboard/messages", icon: FiMessageSquare },
    { label: "Profile", href: "/dashboard/profile", icon: FiSettings },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-foreground/5 border-r border-foreground/10 p-4">
        <div className="mb-8 p-4 bg-background rounded-xl border border-foreground/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xl uppercase">
            {session.user?.name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold truncate" title={session.user?.name || "User"}>
              {session.user?.name}
            </h3>
            <p className="text-sm text-foreground/50 truncate" title={session.user?.email || ""}>
              {session.user?.email}
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
