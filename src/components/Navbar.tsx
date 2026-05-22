"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("home");
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ["home", "about", "skills", "projects", "contact"];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Scroll Progress Bar */}
      <motion.div
        className="h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="flex justify-center px-4 md:px-0">
        <nav
          className={`
            my-4 rounded-3xl px-4 md:px-8 py-3
            flex items-center justify-between
            transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
            w-full md:max-w-6xl
            ${scrolled
              ? "bg-white/90 dark:bg-zinc-800/95 backdrop-blur-sm shadow-sm"
              : "bg-white/5 dark:bg-zinc-900/5"
            }
          `}
        >
          {/* Logo */}
          <a
            href="#home"
            className="text-lg md:text-xl font-bold tracking-tight mr-6"
          >
            <span className="gradient-text">Nadhiv Adam</span>
            <span className="text-foreground/70 font-normal text-sm ml-2 hidden sm:inline-block">Web Developer</span>
          </a>

          {/* Desktop Nav Items (centered) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => {
                const sectionId = item.href.substring(1);
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`relative inline-block group text-sm font-medium transition-colors duration-200
                      after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-primary after:rounded-full after:w-full after:origin-left after:transition-transform after:duration-300
                      ${isActive ? 'after:scale-x-100 text-primary font-semibold' : 'after:scale-x-0 text-muted-foreground hover:text-foreground'}`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Actions (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 text-foreground/60 hover:text-foreground transition-colors duration-200"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </button>

            <a
              href="#support"
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              Support us
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 text-foreground/75 hover:bg-foreground/5"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4.5 w-4.5 text-amber-400" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full p-2 text-foreground/75 hover:bg-foreground/5"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mx-4 z-40 flex flex-col gap-4 rounded-2xl p-6 shadow-xl md:hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

