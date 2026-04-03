"use client";

import { useState, useEffect } from "react";
import { FiShare2, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyActionsProps {
  propertyId: string;
  title: string;
  slug: string;
}

export default function PropertyActions({ propertyId, title, slug }: PropertyActionsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Fetch initial wishlist state
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/wishlist")
        .then(res => res.json())
        .then(data => {
          if (data.wishlist && data.wishlist.includes(propertyId)) {
            setIsSaved(true);
          }
        })
        .catch(err => console.error("Error fetching wishlist:", err));
    }
  }, [status, propertyId]);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: title,
      text: `Check out this premium property on Asmerat Real Estate: ${title}`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleSave = async () => {
    if (status !== "authenticated") {
      router.push("/api/auth/signin"); // Redirect to login
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.isSaved);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4 relative">
      {/* Share Button */}
      <div className="relative">
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all font-bold border border-foreground/10 cursor-pointer group active:scale-95"
        >
          <FiShare2 className="group-hover:text-blue-500 transition-colors" /> 
          <span className="hidden sm:inline">Share</span>
        </button>
        
        <AnimatePresence>
          {showCopied && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg z-50 whitespace-nowrap"
            >
              Link Copied!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save Button */}
      <button 
        onClick={handleSave}
        disabled={isLoading}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold border cursor-pointer active:scale-95 ${
          isSaved 
            ? "bg-red-500/10 border-red-500/20 text-red-500" 
            : "bg-foreground/5 border-foreground/10 text-foreground/70 hover:bg-foreground/10"
        }`}
      >
        <motion.div
           animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }}
           transition={{ duration: 0.3 }}
        >
          {isSaved ? <FaHeart /> : <FiHeart />}
        </motion.div>
        <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
      </button>
    </div>
  );
}
