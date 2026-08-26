"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center paper-grid"
          style={{ background: "#FAF7F2" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-5 p-8 bg-paper-50 rounded-2xl neo-border neo-shadow-lg"
          >
            {/* Custom Logo pulsing in the center */}
            <motion.div 
              className="relative w-28 h-28 p-2 bg-[#FEF9C3] rounded-xl neo-border neo-shadow-sm flex items-center justify-center"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image 
                src="/logo.png" 
                alt="Loading..." 
                fill 
                className="object-contain p-2" 
                priority
              />
            </motion.div>
            
            <div className="text-center">
              <h2 
                className="text-2xl font-bold tracking-tight text-ink-primary"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                BlogPotro
              </h2>
              <p 
                className="text-xs text-ink-muted uppercase tracking-widest mt-0.5"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Editorial Workspace
              </p>
            </div>

            {/* Animated Loading Bar */}
            <div className="w-52 h-2.5 rounded-full overflow-hidden neo-border bg-paper-200">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="h-full bg-pastel-amber"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}