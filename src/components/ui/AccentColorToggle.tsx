"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";

const ACCENTS = [
  { id: "green", name: "Green", hex: "#84CC16" },
  { id: "purple", name: "Purple", hex: "#A855F7" },
  { id: "blue", name: "Blue", hex: "#3B82F6" },
  { id: "orange", name: "Orange", hex: "#F97316" },
  { id: "pink", name: "Pink", hex: "#EC4899" },
] as const;

type AccentId = typeof ACCENTS[number]["id"];

export default function AccentColorToggle() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeAccent, setActiveAccent] = React.useState<AccentId>("green");
  const [mounted, setMounted] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Initialize and load from localStorage
  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("nadhiv-portfolio-accent") as AccentId | null;
    if (saved && ACCENTS.some(a => a.id === saved)) {
      setActiveAccent(saved);
      document.documentElement.setAttribute("data-accent", saved);
    } else {
      document.documentElement.setAttribute("data-accent", "green");
    }

    // Close panel on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAccentChange = (accentId: AccentId) => {
    setActiveAccent(accentId);
    localStorage.setItem("nadhiv-portfolio-accent", accentId);
    document.documentElement.setAttribute("data-accent", accentId);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-center gap-3" ref={panelRef}>
      {/* Floating Vertical Swatches */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-center gap-3">
            {ACCENTS.map((accent, index) => {
              const isActive = activeAccent === accent.id;
              // Animate from bottom to top: reverse order for staggered delay
              const delay = (ACCENTS.length - 1 - index) * 0.04;

              return (
                <motion.button
                  key={accent.id}
                  onClick={() => handleAccentChange(accent.id)}
                  initial={{ opacity: 0, y: 15, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.7 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 24,
                    delay: delay
                  }}
                  className="relative group h-10 w-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg active:scale-90 transition-transform duration-150"
                  style={{ backgroundColor: accent.hex }}
                  aria-label={`Select ${accent.name} accent`}
                >
                  {/* Outer active indicator ring */}
                  <motion.div
                    className="absolute -inset-1 rounded-full border-2 border-primary/45"
                    initial={false}
                    animate={{
                      scale: isActive ? 1.08 : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  />

                  {/* Check icon */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Check className="h-4.5 w-4.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
                    </motion.div>
                  )}

                  {/* Dynamic Tooltip on the left */}
                  <span className="absolute right-13 bg-zinc-900/90 text-white dark:bg-white/95 dark:text-black text-[11px] font-semibold px-2 py-1 rounded-lg shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-white/10 dark:border-black/5">
                    {accent.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Palette Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="btn-primary !p-3.5 shadow-xl flex items-center justify-center cursor-pointer z-10"
        aria-label="Theme Customizer"
      >
        <Palette className={`h-5.5 w-5.5 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
      </motion.button>
    </div>
  );
}
