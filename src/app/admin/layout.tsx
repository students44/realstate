import { FiHome, FiUsers, FiMessageSquare, FiSettings, FiCheckSquare } from "react-icons/fi";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: FiHome },
    { label: "Manage Properties", href: "/admin/properties", icon: FiCheckSquare },
    { label: "Manage Users", href: "/admin/users", icon: FiUsers },
    { label: "Settings", href: "/admin/settings", icon: FiSettings },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-foreground/5 border-r border-foreground/10 p-4">
        <div className="mb-8 p-4 bg-background rounded-xl border border-blue-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl uppercase">
            A
          </div>
          <div>
            <h3 className="font-bold">Admin Panel</h3>
            <p className="text-sm text-foreground/50">Master Control</p>
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
