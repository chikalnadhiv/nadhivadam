"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Award, Code, Globe, User } from "lucide-react";
import type { Profile } from "@/lib/supabase";

interface AboutProps {
  profile: Profile;
}

export default function About({ profile }: AboutProps) {
  const stats = [
    { label: "Years Experience", value: profile.exp_years || "4+", icon: Award },
    { label: "Completed Projects", value: profile.completed_projects || "25+", icon: Code },
    { label: "Websites Launched", value: profile.websites_launched || "15+", icon: Globe },
  ];

  return (
    <section id="about" className="py-20 md:py-28 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="divider-gradient mx-auto mt-4" />
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Column 1: Narrative (Bio) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-4 text-primary">
              <User className="h-5 w-5" />
              <h3 className="text-xl font-bold tracking-tight">Who is {profile.full_name || "Nadhiv Adam"}?</h3>
            </div>
            
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
              {profile.bio_p1 || "I am an enthusiastic Web Developer deeply dedicated to creating user-centric, high-performance web applications. My path in coding started out of a fascination with making ideas tangible, and it has evolved into a career centered on writing robust typescript code, optimizing layouts, and creating premium experiences."}
            </p>
            
            <p className="mt-4 text-muted-foreground text-base leading-relaxed sm:text-lg">
              {profile.bio_p2 || "I love combining sophisticated aesthetics with reliable, modular architectures. Working with frameworks like Next.js, standardizing Tailwind configurations, and integrating real-time database backends like Supabase are my daily bread and butter. I pay immense attention to micro-animations, fast page loads, accessibility, and clean code principles."}
            </p>
            
            <p className="mt-4 text-muted-foreground text-base leading-relaxed sm:text-lg">
              {profile.bio_p3 || "When I'm not writing code or tweaking animations in Framer Motion, you can find me reviewing technical documentations, contributing to developer tools, or exploring next-generation design systems to continuously raise the bar."}
            </p>
          </motion.div>

          {/* Column 2: Metrics / Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="card-premium flex items-center gap-4 p-6"
                >
                  <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 p-4 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
