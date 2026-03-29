"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiSearch, FiMapPin, FiHome } from "react-icons/fi";

export default function HeroSection() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background Particles */}
      {init && (
        <div className="absolute inset-0 z-0 opacity-50 dark:opacity-30">
          <Particles
            id="tsparticles"
            options={{
              background: { color: { value: "transparent" } },
              fpsLimit: 60,
              interactivity: {
                events: { onClick: { enable: true, mode: "push" }, onHover: { enable: true, mode: "repulse" }, resize: { enable: true } },
                modes: { push: { quantity: 2 }, repulse: { distance: 100, duration: 0.4 } },
              },
              particles: {
                color: { value: "#8b5cf6" }, // Purple-ish
                links: { color: "#3b82f6", distance: 150, enable: true, opacity: 0.3, width: 1 },
                move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
                number: { density: { enable: true, width: 800, height: 800 }, value: 60 },
                opacity: { value: 0.5 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
              },
              detectRetina: true,
            }}
          />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6"
        >
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Dream Home</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-foreground/70 mb-10 max-w-3xl"
        >
          Discover premium properties, luxury apartments, and prime plots. Your journey to perfect living starts here.
        </motion.p>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-4xl bg-background/80 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-foreground/10 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" />
            <input type="text" placeholder="Location" className="w-full pl-10 pr-4 py-3 rounded-lg bg-foreground/5 border border-transparent focus:border-blue-500 focus:outline-none transition-colors" />
          </div>
          <div className="flex-1 relative">
            <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" />
            <select className="w-full pl-10 pr-4 py-3 rounded-lg bg-foreground/5 border border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none">
              <option value="">Property Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="plot">Plot</option>
            </select>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <FiSearch /> Search
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 flex gap-4"
        >
          <Link href="/properties" className="px-6 py-3 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform">
            Browse All Properties
          </Link>
          <Link href="/dashboard/properties/add" className="px-6 py-3 rounded-full border border-foreground/20 text-foreground font-medium hover:bg-foreground/5 transition-colors">
            List Your Property
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
