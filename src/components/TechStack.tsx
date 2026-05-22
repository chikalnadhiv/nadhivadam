"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSkills, Skill } from "@/lib/supabase";
import * as Icons from "lucide-react";

// Map string keys to Lucide React Icons
function getIconComponent(iconName: string) {
  const IconComponent = (Icons as any)[iconName];
  // Fallback icon if the specified name is invalid
  return IconComponent || Icons.Code2;
}

// Function to resolve visual hover glow boundaries based on icon name
function getHoverStyles(iconName: string): string {
  switch (iconName) {
    case "Cpu":
      return "group-hover:border-zinc-400 group-hover:shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)]";
    case "Boxes":
      return "group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_-3px_rgba(34,211,238,0.2)]";
    case "Code2":
      return "group-hover:border-blue-500 group-hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]";
    case "Layers":
      return "group-hover:border-sky-400 group-hover:shadow-[0_0_15px_-3px_rgba(56,189,248,0.2)]";
    case "Sparkles":
      return "group-hover:border-fuchsia-400 group-hover:shadow-[0_0_15px_-3px_rgba(232,121,249,0.2)]";
    case "Terminal":
      return "group-hover:border-green-500 group-hover:shadow-[0_0_15px_-3px_rgba(34,197,94,0.2)]";
    case "CloudLightning":
      return "group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_-3px_rgba(52,211,153,0.2)]";
    case "Database":
      return "group-hover:border-blue-400 group-hover:shadow-[0_0_15px_-3px_rgba(96,165,250,0.2)]";
    case "Workflow":
      return "group-hover:border-indigo-400 group-hover:shadow-[0_0_15px_-3px_rgba(129,140,248,0.2)]";
    case "GitBranch":
      return "group-hover:border-orange-500 group-hover:shadow-[0_0_15px_-3px_rgba(249,115,22,0.2)]";
    default:
      return "group-hover:border-primary/45 group-hover:shadow-[0_0_15px_-3px_rgba(168,85,247,0.25)]";
  }
}

export default function TechStack() {
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [activeTab, setActiveTab] = React.useState<"all" | "frontend" | "backend" | "tools">("all");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadSkills() {
      try {
        const fetched = await getSkills();
        setSkills(fetched);
      } catch (err) {
        console.error("Failed to load skills:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

  const filteredTech = skills.filter(
    (item) => activeTab === "all" || item.category === activeTab
  );

  return (
    <section id="skills" className="py-20 md:py-28 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <div className="divider-gradient mx-auto mt-4" />
          <p className="mt-4 max-w-md text-muted-foreground text-sm sm:text-base">
            The core tools, languages, and technologies I utilize to bring fully interactive digital interfaces to life.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-10">
          <div className="glass flex gap-1 rounded-full p-1 text-sm bg-white/5 dark:bg-black/10 border border-white/10 dark:border-white/5">
            {(["all", "frontend", "backend", "tools"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 font-medium transition-all duration-300 capitalize cursor-pointer ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30"
                    : "text-foreground/60 hover:text-foreground hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div 
                key={idx} 
                className="card-premium h-[130px] animate-pulse flex flex-col items-center justify-center p-6"
              >
                <div className="h-10 w-10 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-xl mb-3" />
                <div className="h-4 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <AnimatePresence mode="popLayout">
              {filteredTech.map((item, index) => {
                const Icon = getIconComponent(item.icon);
                const hoverStyle = getHoverStyles(item.icon);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.02,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    whileHover={{ y: -6, scale: 1.08 }}
                    className={`group card-premium relative flex flex-col items-center justify-center p-6 text-center ${hoverStyle}`}
                  >
                    <div className="mb-4 rounded-xl bg-gradient-to-br from-primary/15 to-indigo-500/10 p-3 text-foreground/70 transition-all duration-300 group-hover:from-primary/25 group-hover:to-indigo-500/20 group-hover:text-primary group-hover:shadow-lg group-hover:shadow-primary/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold tracking-tight text-foreground truncate max-w-full transition-colors duration-300 group-hover:text-primary">{item.name}</h3>
                    <span className="mt-1 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">{item.category}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
