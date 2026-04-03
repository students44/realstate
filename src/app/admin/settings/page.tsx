"use client";

import { FiSave, FiSettings, FiGlobe, FiMail, FiPhone, FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully! (Demo Mode)");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-foreground mb-3">Platform Settings</h1>
        <p className="text-foreground/60 text-lg font-medium">Configure global site parameters and contact information.</p>
      </div>

      <form onSubmit={handleSave} className="max-w-4xl space-y-8">
        {/* General Settings */}
        <div className="bg-foreground/5 border border-foreground/10 rounded-[2.5rem] p-10 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-10 border-b border-foreground/5 pb-6">
            <div className="p-4 rounded-3xl bg-blue-500/10 text-blue-500">
              <FiGlobe size={24} />
            </div>
            <h2 className="text-2xl font-bold">General Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-foreground/40 uppercase tracking-widest pl-2">Site Name</label>
              <input 
                type="text" 
                defaultValue="Asmerat Real Estate"
                className="w-full px-6 py-4 rounded-2xl bg-background border border-foreground/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-foreground/40 uppercase tracking-widest pl-2">Currency Symbol</label>
              <input 
                type="text" 
                defaultValue="$"
                className="w-full px-6 py-4 rounded-2xl bg-background border border-foreground/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-foreground/5 border border-foreground/10 rounded-[2.5rem] p-10 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-10 border-b border-foreground/5 pb-6">
            <div className="p-4 rounded-3xl bg-purple-500/10 text-purple-500">
              <FiMail size={24} />
            </div>
            <h2 className="text-2xl font-bold">Contact & Support</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-foreground/40 uppercase tracking-widest pl-2">Admin Email</label>
              <div className="relative">
                <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30" />
                <input 
                  type="email" 
                  defaultValue="admin@asmerat.com"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-background border border-foreground/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-foreground/40 uppercase tracking-widest pl-2">Support Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30" />
                <input 
                  type="tel" 
                  defaultValue="+92 345 2645064"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-background border border-foreground/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="bg-foreground/5 border border-foreground/10 rounded-[2.5rem] p-10 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-10 border-b border-foreground/5 pb-6">
            <div className="p-4 rounded-3xl bg-green-500/10 text-green-500">
              <FiDollarSign size={24} />
            </div>
            <h2 className="text-2xl font-bold">Financials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-foreground/40 uppercase tracking-widest pl-2">Platform Fee (%)</label>
              <input 
                type="number" 
                defaultValue="2.5"
                step="0.1"
                className="w-full px-6 py-4 rounded-2xl bg-background border border-foreground/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-2 flex items-end">
               <button 
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
               >
                <FiSave size={20} />
                Save All Changes
               </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
