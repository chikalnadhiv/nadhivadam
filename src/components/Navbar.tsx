"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("home");
  const [scrolled, setScrolled] = React.useState(false);
  const [currentPathname, setCurrentPathname] = React.useState("");
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    setMounted(true);
    const pathname = window.location.pathname;
    setCurrentPathname(pathname);

    // Set active section based on pathname initial state
    if (pathname === "/") {
      setActiveSection("home");
    } else if (pathname === "/services") {
      setActiveSection("services");
    } else if (pathname === "/projects") {
      setActiveSection("projects");
    } else if (pathname === "/contact") {
      setActiveSection("contact");
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // High performance IntersectionObserver scrollspy to avoid forced reflows (offsetTop/offsetHeight)
    let observer: IntersectionObserver | null = null;
    if (pathname === "/") {
      const sections = ["home", "about", "skills", "services", "projects", "contact"];
      const elements = sections.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          rootMargin: "-25% 0px -55% 0px", // Trigger active state when section is in the view focus area
          threshold: 0,
        }
      );

      elements.forEach((el) => observer?.observe(el));
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer?.disconnect();
    };
  }, []);

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent">
      {/* Blurred Background Layer (fades out smoothly to avoid any sharp lines) */}
      <div
        className={`absolute inset-x-0 top-0 -z-10 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none
          ${scrolled
            ? "h-[88px] md:h-[96px] bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md opacity-100"
            : "h-0 opacity-0"
          }
        `}
        style={{
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        }}
      />

      {/* Scroll Progress Bar */}
      <motion.div
        className="h-[2px] bg-gradient-to-r from-primary via-accent to-secondary origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="flex justify-center px-8 md:px-0">
        <nav
          className={`
            my-4 rounded-3xl px-4 md:px-8 py-3
            flex items-center justify-between
            transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
            w-full md:max-w-6xl
            ${scrolled
              ? "bg-white dark:bg-zinc-900 shadow-md"
              : "bg-white dark:bg-zinc-900 shadow-sm"
            }
          `}
        >
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 md:gap-3 mr-6"
          >
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-0.5 hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <Image
                src="/ndhvlogo.png"
                alt="Nadhiv Adam Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm md:text-base font-bold tracking-tight">
                <span className="gradient-text">Nadhiv</span>
              </div>
              <div className="text-xs text-foreground/70 font-medium">Web Developer</div>
            </div>
          </a>

          {/* Desktop Nav Items (centered) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-8">
              {NAV_ITEMS.map((item, idx) => {
                const isHashLink = item.href.startsWith("#");
                const sectionId = isHashLink ? item.href.substring(1) : "";
                let isActive = false;
                if (currentPathname === "/") {
                  // Home: aktifkan hash link jika activeSection cocok
                  isActive = isHashLink && activeSection === sectionId;
                  // Home link aktif jika activeSection === 'home'
                  if (!isHashLink && item.href === "/") {
                    isActive = activeSection === "home";
                  }
                } else {
                  // Halaman lain: aktifkan hanya jika path sama persis
                  isActive = !isHashLink && currentPathname === item.href;
                }
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    whileHover={{ scale: 1.05, opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative inline-flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                      ${isActive
                        ? 'text-primary bg-primary/10 shadow-md shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                      }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-primary/0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.a>
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
              className="inline-flex items-center gap-2 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-colors duration-200"
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
            className="mx-4 z-40 flex flex-col gap-4 rounded-2xl p-6 shadow-xl md:hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
          >
            <AnimatePresence>
              {NAV_ITEMS.map((item, idx) => {
                const isHashLink = item.href.startsWith("#");
                const sectionId = isHashLink ? item.href.substring(1) : "";
                let isActive = false;
                if (window.location.pathname === "/") {
                  isActive = isHashLink && activeSection === sectionId;
                  if (!isHashLink && item.href === "/") {
                    isActive = activeSection === "home";
                  }
                } else {
                  isActive = !isHashLink && window.location.pathname === item.href;
                }
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.05 * idx, duration: 0.25 }}
                    whileHover={{ scale: 1.05, color: "var(--tw-color-primary)" }}
                    className={`text-lg font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground/80 hover:text-primary'
                      }`}
                  >
                    {item.label}
                  </motion.a>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

