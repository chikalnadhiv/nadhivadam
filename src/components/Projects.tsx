"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { getProjects, Project } from "@/lib/supabase";
import { ExternalLink, FolderGit2 } from "lucide-react";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] as const, // easeOutCubic
    },
  },
};

export default function Projects() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProjects() {
      try {
        const fetched = await getProjects();
        setProjects(fetched);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <section id="projects" className="py-20 md:py-28 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="divider-gradient mx-auto mt-4" />
          <p className="mt-4 max-w-md text-muted-foreground text-sm sm:text-base">
            A curated selection of applications built with high-fidelity frontend design systems, serverless logic, and optimized performance.
          </p>
        </div>

        {/* Card Grid */}
        {loading ? (
          // Skeleton Loading States (standard divs, as they animate-pulse)
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="card-premium flex flex-col h-[420px] animate-pulse"
              >
                {/* Image Skeleton */}
                <div className="h-48 bg-gradient-to-r from-zinc-800 to-zinc-700 w-full" />
                {/* Content Skeleton */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-6 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg w-2/3" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg w-full" />
                      <div className="h-4 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg w-5/6" />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="h-6 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full w-16" />
                      <div className="h-6 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full w-20" />
                      <div className="h-6 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full w-16" />
                    </div>
                    <div className="h-10 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Real Project Cards from Supabase or Fallback with Staggered Entrance
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="group card-premium flex flex-col h-[420px]"
              >
                {/* Project Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-muted-foreground">
                      <FolderGit2 className="h-12 w-12 opacity-60" />
                    </div>
                  )}
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/40" />
                </div>

                {/* Project Details */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="text-lg font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">
                      {project.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((techItem) => (
                        <span
                          key={techItem}
                          className="rounded-full bg-gradient-to-r from-primary/10 to-indigo-500/10 px-3 py-1 text-xs font-semibold text-primary dark:text-purple-300 border border-primary/20 transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/15"
                        >
                          {techItem}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button Link */}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full w-full px-4 py-2.5 font-semibold text-xs transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
                    >
                      Explore Project
                      <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
