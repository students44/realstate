"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiUsers, FiSettings, FiCheckSquare, FiHeart, FiMessageSquare, FiPlusSquare } from "react-icons/fi";

type SidebarIconName = "home" | "check" | "users" | "settings" | "heart" | "message" | "plus";

type SidebarItem = {
  label: string;
  href: string;
  icon: SidebarIconName;
};

type SidebarNavProps = {
  title: string;
  subtitle: string;
  items: SidebarItem[];
  avatarLabel: string;
  avatarColorClass?: string;
};

export default function SidebarNav({ title, subtitle, items, avatarLabel, avatarColorClass = "bg-blue-500 text-white" }: SidebarNavProps) {
  const pathname = usePathname() || "/";

  const isActive = (href: string) => {
    if (pathname === href) return true;
    return pathname.startsWith(href + "/");
  };

  const renderIcon = (name: SidebarIconName) => {
    switch (name) {
      case "home":
        return FiHome;
      case "check":
        return FiCheckSquare;
      case "users":
        return FiUsers;
      case "settings":
        return FiSettings;
      case "heart":
        return FiHeart;
      case "message":
        return FiMessageSquare;
      case "plus":
        return FiPlusSquare;
      default:
        return FiHome;
    }
  };

  return (
    <aside className="w-full md:w-64 bg-foreground/5 border-r border-foreground/10 p-4">
      <div className="mb-8 p-4 bg-background rounded-3xl border border-blue-500/20 shadow-sm">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl uppercase ${avatarColorClass}`}>
          {avatarLabel}
        </div>
        <div className="mt-4">
          <h3 className="font-bold text-foreground">{title}</h3>
          <p className="text-sm text-foreground/50">{subtitle}</p>
        </div>
      </div>

      z
    </aside>
  );
}
