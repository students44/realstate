"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-foreground/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Asmerat Real Estate
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
            <Link href="/properties" className="text-foreground/80 hover:text-foreground transition-colors">Properties</Link>
            
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-foreground/10 transition-colors">
              {theme === "dark" ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                {session.user?.role === "admin" && (
                   <Link href="/admin" className="text-foreground/80 hover:text-foreground transition-colors">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 rounded-md text-foreground hover:bg-foreground/10 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity">
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
             <button onClick={toggleTheme} className="p-2 mr-2 rounded-full hover:bg-foreground/10 transition-colors">
              {theme === "dark" ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-foreground/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-foreground/10">Home</Link>
            <Link href="/properties" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-foreground/10">Properties</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-foreground/10">Dashboard</Link>
                 {session.user?.role === "admin" && (
                   <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-foreground/10">Admin</Link>
                 )}
                 <button onClick={() => signOut()} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-foreground/10">
                  Logout
                </button>
              </>
            ) : (
               <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-foreground/10">Login</Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-foreground/10">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
