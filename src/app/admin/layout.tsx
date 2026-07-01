import { FiHome, FiUsers, FiSettings, FiCheckSquare } from "react-icons/fi";
import SidebarNav from "../../components/SidebarNav";
import { auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const navItems: Array<{ label: string; href: string; icon: "home" | "check" | "users" | "settings" }> = [
    { label: "Overview", href: "/admin", icon: "home" },
    { label: "Manage Properties", href: "/admin/properties", icon: "check" },
    { label: "Manage Users", href: "/admin/users", icon: "users" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-background">
      <SidebarNav
        title="Admin Panel"
        subtitle="Master Control"
        avatarLabel="A"
        avatarColorClass="bg-blue-500 text-white"
        items={navItems}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
