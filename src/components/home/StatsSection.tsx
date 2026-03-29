"use client";

import { motion } from "framer-motion";
import { FiHome, FiKey, FiMap } from "react-icons/fi";

const stats = [
  { id: 1, value: "10K+", label: "Premium Properties", icon: FiHome },
  { id: 2, value: "5K+", label: "Happy Customers", icon: FiKey },
  { id: 3, value: "150+", label: "Cities Covered", icon: FiMap },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-background border-y border-foreground/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-8 rounded-2xl bg-foreground/5 border border-foreground/10 text-center hover:bg-foreground/10 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-blue-500 mb-6">
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-extrabold text-foreground mb-2">{stat.value}</h3>
              <p className="text-lg text-foreground/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
