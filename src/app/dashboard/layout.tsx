import { FiHome, FiHeart, FiSettings, FiMessageSquare, FiPlusSquare } from "react-icons/fi";
import SidebarNav from "../../components/SidebarNav";
import { auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const navItems: Array<{ label: string; href: string; icon: "home" | "plus" | "heart" | "message" | "settings" }> = [
    { label: "Overview", href: "/dashboard", icon: "home" },
    { label: "Add Property", href: "/dashboard/properties/add", icon: "plus" },
    { label: "My Properties", href: "/dashboard/properties", icon: "home" },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: "heart" },
    { label: "Messages", href: "/dashboard/messages", icon: "message" },
    { label: "Profile", href: "/dashboard/profile", icon: "settings" },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-background">
      <SidebarNav
        title={session.user?.name || "User"}
        subtitle={session.user?.email || ""}
        avatarLabel={session.user?.name?.charAt(0) || "U"}
        avatarColorClass="bg-blue-500/20 text-blue-500"
        items={navItems}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
