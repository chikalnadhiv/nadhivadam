"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { getProfile, Profile } from "@/lib/supabase";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] as const, // easeOutCubic
    },
  },
};

export default function Hero() {
  const [profile, setProfile] = React.useState<Profile | null>(null);

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile in Hero:", err);
      }
    }
    loadProfile();
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden pt-20"
    >
      {/* Dynamic Ambient Background Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] h-72 w-72 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/10 animate-blob" />
        <div className="absolute top-[30%] right-[10%] h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-500/10 animate-blob [animation-delay:2s]" />
        <div className="absolute bottom-[20%] left-[30%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl dark:bg-cyan-500/10 animate-blob [animation-delay:4s]" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-8"
      >
        {/* Short Welcoming Tag */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary dark:text-purple-400 backdrop-blur-md mb-6"
        >
          <span>{profile?.availability || "Available for Freelance & Full-time"}</span>
        </motion.div>

        {/* Catchy Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Hi, I am <br />
          <span className="gradient-text">{profile?.full_name || "Nadhiv Adam"}</span>
        </motion.h1>

        {/* Dynamic Subheading / Role */}
        <motion.h2
          variants={itemVariants}
          className="mt-6 text-xl font-medium text-foreground/80 sm:text-2xl md:text-3xl"
        >
          A <span className="font-semibold text-primary dark:text-purple-400">{profile?.title || "Web Developer"}</span> building fast, elegant digital experiences.
        </motion.h2>

        {/* Professional Bio Hook */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {profile?.intro_bio || "Specializing in designing and crafting premium frontends and robust full-stack applications. I bring designs to life with micro-interactions, pixel-perfection, and codebase patterns."}
        </motion.p>

        {/* SEO-Optimized Content */}
        <motion.div
          variants={itemVariants}
          className="mx-auto mt-8 max-w-2xl"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            As a <strong>Web Developer</strong> based in Sukabumi, Indonesia, I specialize in building high-performance digital experiences using modern technologies including <strong>React</strong>, <strong>Next.js</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong>. I combine frontend development expertise with UI/UX design principles to create responsive, accessible web applications that engage users and drive results.
          </p>
        </motion.div>

        {/* Action Buttons & Socials */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {/* Main CTA */}
          <a
            href="#projects"
            className="group relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
          >
            View Featured Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </a>

          {/* Secondary CTA */}
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold text-sm transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 hover:border-white/40 hover:shadow-lg active:scale-95"
          >
            <Mail className="h-4 w-4" />
            Let&apos;s Connect
          </a>
        </motion.div>

        {/* Social shortcuts */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex justify-center gap-6 mb-20 sm:mb-0"
        >
          <a 
            href={profile?.github_url || "https://github.com/nadhiv"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative rounded-full p-3 backdrop-blur-md transition-all duration-300 hover:scale-110 bg-white/10 hover:bg-white/20 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/70 border border-white/20 hover:border-white/40 text-foreground/70 hover:text-foreground" 
            aria-label="GitHub"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs font-semibold text-background opacity-0 transition-opacity group-hover:opacity-100">GitHub</span>
          </a>
          <a 
            href={profile?.linkedin_url || "https://linkedin.com/in/nadhiv"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative rounded-full p-3 backdrop-blur-md transition-all duration-300 hover:scale-110 bg-white/10 hover:bg-white/20 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/70 border border-white/20 hover:border-white/40 text-foreground/70 hover:text-foreground" 
            aria-label="LinkedIn"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs font-semibold text-background opacity-0 transition-opacity group-hover:opacity-100">LinkedIn</span>
          </a>
          <a 
            href={`mailto:${profile?.email || "nadhiv@example.com"}`} 
            className="group relative rounded-full p-3 backdrop-blur-md transition-all duration-300 hover:scale-110 bg-white/10 hover:bg-white/20 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/70 border border-white/20 hover:border-white/40 text-foreground/70 hover:text-foreground" 
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs font-semibold text-background opacity-0 transition-opacity group-hover:opacity-100">Email</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Elegant Bouncing Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-2 sm:bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <a href="#about" aria-label="Scroll Down">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-muted-foreground/30 p-1">
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-2 w-1.5 rounded-full bg-primary"
            />
          </div>
        </a>
      </motion.div>
    </section>
  );
}
