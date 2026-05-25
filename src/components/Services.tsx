"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Globe, BarChart3, Code2, Layers, Briefcase } from "lucide-react";

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
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  },
};

const serviceData = [
  {
    id: "company-profile",
    title: "Website Company Profile",
    description:
      "Bangun kehadiran online profesional dengan website company profile yang menarik dan informatif. Sempurna untuk bisnis yang ingin menunjukkan kredibilitas kepada calon klien.",
    benefits: [
      "Desain custom sesuai identitas bisnis Anda",
      "Responsive design untuk semua perangkat",
      "Optimasi SEO untuk ranking di Google",
      "Fast loading & performa optimal",
      "Mudah diupdate dengan admin panel",
    ],
    icon: Globe,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    id: "landing-page",
    title: "Landing Page Conversion",
    description:
      "Landing page yang dirancang khusus untuk meningkatkan konversi. Saya ahli dalam membuat landing page yang menarik perhatian dan mendorong action dari pengunjung.",
    benefits: [
      "High conversion rate optimization",
      "A/B testing friendly structure",
      "Call-to-action yang efektif",
      "Integrasi dengan email marketing",
      "Analytics tracking built-in",
    ],
    icon: Zap,
    color: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
  },
  {
    id: "web-app",
    title: "Web App & Dashboard",
    description:
      "Aplikasi web custom seperti POS system, dashboard admin, atau SaaS platform. Saya menggunakan teknologi terkini untuk membangun sistem yang scalable dan user-friendly.",
    benefits: [
      "Custom features sesuai kebutuhan bisnis",
      "Real-time data synchronization",
      "User authentication & security",
      "Mobile-responsive dashboard",
      "Database optimization & backup",
    ],
    icon: BarChart3,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    id: "seo-optimization",
    title: "Optimasi Website & SEO",
    description:
      "Tingkatkan visibility website Anda di mesin pencari dengan strategi SEO yang tepat. Saya memastikan website Anda tampil di halaman pertama Google untuk keyword yang relevan.",
    benefits: [
      "Technical SEO audit & improvement",
      "Keyword research & optimization",
      "On-page & off-page SEO",
      "Page speed optimization",
      "Backlink strategy development",
    ],
    icon: Code2,
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
  },
];

const whyChoose = [
  {
    title: "Berpengalaman",
    description: "Lebih dari 4 tahun mengembangkan website untuk berbagai industri di Indonesia",
    icon: Briefcase,
  },
  {
    title: "Teknologi Terkini",
    description: "Menggunakan Next.js, React, TypeScript, dan stack modern lainnya untuk performa maksimal",
    icon: Layers,
  },
  {
    title: "Lokal, Terpercaya",
    description: "Web Developer dari Sukabumi yang memahami kebutuhan bisnis lokal Indonesia",
    icon: Globe,
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
              Layanan Kami
            </p>
            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Solusi <span className="gradient-text">web development</span><br />
              untuk bisnis Anda
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Dari website company profile hingga web app custom yang powerful, saya membantu bisnis Anda tampil profesional, meningkat konversi, dan siap tumbuh bersama teknologi terkini.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-8 md:grid-cols-2"
        >
          {serviceData.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={`card-premium flex h-full flex-col p-8 border ${service.borderColor}`}
              >
                <div
                  className={`mb-6 w-fit rounded-xl bg-gradient-to-br ${service.color} p-4 text-foreground/80`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                <p className="mt-4 flex-grow text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                  {service.benefits.slice(0, 2).map((benefit, index) => (
                    <div key={`${service.id}-${index}`} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                  <p className="pt-2 text-xs font-medium text-primary/80 hover:text-primary transition-colors">
                    +{service.benefits.length - 2} benefit lainnya
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {whyChoose.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-premium p-7 text-center hover:border-primary/50"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
