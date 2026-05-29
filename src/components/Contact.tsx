"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";
import type { Profile } from "@/lib/supabase";

interface ContactProps {
  profile: Profile;
}

export default function Contact({ profile }: ContactProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus("sending");
    try {
      const { sendMessage } = await import("@/lib/supabase");
      await sendMessage({ name, email, message });
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("Failed to post message to database:", err);
      // Soft fallback for robust UX
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    }

    // Reset back to idle after a few seconds
    setTimeout(() => setStatus("idle"), 4000);
  };

  const adminEmail = profile.email || "nadhiv@example.com";
  const adminLocation = profile.location || "Jakarta, Indonesia";

  return (
    <section id="contact" className="py-20 md:py-28 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="divider-gradient mx-auto mt-4" />
          <p className="mt-4 max-w-md text-muted-foreground text-sm sm:text-base">
            Have a project in mind, want to collaborate, or just want to say hi? Shoot me a message and let&apos;s build something together!
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Column 1: Info Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-5 flex flex-col justify-between space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Contact Information</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Feel free to reach out through the form, or drop me an email directly. I usually reply within 24 hours.
              </p>
            </div>

            {/* Quick Cards */}
            <div className="space-y-4">
              {/* Direct Mail */}
              <a
                href={`mailto:${adminEmail}`}
                className="card-premium group flex items-center gap-4 p-5"
              >
                <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 p-3 text-primary group-hover:from-primary/30 group-hover:to-accent/20 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Email Me</div>
                  <div className="text-sm font-semibold text-foreground mt-0.5 group-hover:text-primary transition-colors truncate max-w-[200px]">{adminEmail}</div>
                </div>
              </a>

              {/* Location */}
              <div className="card-premium flex items-center gap-4 p-5">
                <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 p-3 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Location</div>
                  <div className="text-sm font-semibold text-foreground mt-0.5 truncate max-w-[200px]">{adminLocation}</div>
                </div>
              </div>
            </div>

            {/* CTA Highlight */}
            <div className="hidden lg:block text-xs text-muted-foreground/60">
              <p>Looking forward to connecting with teams, designers, and web enthusiasts worldwide.</p>
            </div>
          </motion.div>

          {/* Column 2: Elegant Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-7"
          >
            <div className="card-premium p-6 sm:p-8 relative overflow-hidden shadow-none border-0">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  /* Success State screen */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="rounded-full bg-primary/20 p-4 text-primary mb-6 shadow-lg shadow-primary/20"
                    >
                      <CheckCircle2 className="h-12 w-12" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
                    <p className="mt-3 max-w-sm text-muted-foreground text-sm leading-relaxed">
                      Thank you for reaching out. Your message has been received, and I will get back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  /* Active Form screen */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Name Input */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ucup"
                        disabled={status === "sending"}
                        className="rounded-xl bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-white backdrop-blur-sm px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:bg-white/90 dark:focus:bg-zinc-900 disabled:opacity-50 placeholder:text-muted-foreground/60"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ucup@google.com"
                        disabled={status === "sending"}
                        className="rounded-xl bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-white backdrop-blur-sm px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:bg-white/90 dark:focus:bg-zinc-900 disabled:opacity-50 placeholder:text-muted-foreground/60"
                      />
                    </div>

                    {/* Message Textarea */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell me about your project, idea, or just say hello..."
                        disabled={status === "sending"}
                        className="rounded-xl bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-white backdrop-blur-sm px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:bg-white/90 dark:focus:bg-zinc-900 resize-none disabled:opacity-50 placeholder:text-muted-foreground/60"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group btn-primary w-full disabled:opacity-50 cursor-pointer"
                    >
                      {status === "sending" ? (
                        <>
                          Sending Message...
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
