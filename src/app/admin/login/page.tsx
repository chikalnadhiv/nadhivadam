"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, signIn, isMocked } = useAuth();
  const toast = useToast();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // If already authenticated, redirect to dashboard immediately
  React.useEffect(() => {
    if (!authLoading && user) {
      router.replace("/admin/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back, Administrator!");
        router.replace("/admin/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm font-semibold tracking-wide animate-pulse">
            Authenticating Administrator...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden">
      {/* Background Gradient Accents */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] h-[30rem] w-[30rem] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[30rem] w-[30rem] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back Link */}
        <div className="mb-6 flex justify-start">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            Back to Portfolio
          </Link>
        </div>

        {/* Login Card */}
        <div className="glass rounded-3xl p-8 border border-border/40 bg-zinc-950/20 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-3 pointer-events-none">
            {isMocked && (
              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[9px] font-semibold text-indigo-400">
                Demo Auth Mode
              </span>
            )}
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-inner">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Admin <span className="gradient-text">Sign In</span>
            </h1>
            <p className="mt-2 text-xs text-muted-foreground max-w-[280px] leading-relaxed">
              Verify credentials to access the projects management dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nadhiv.dev"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/50 bg-secondary/20 text-sm placeholder:text-muted-foreground/50 text-foreground transition-all duration-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-background"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
                  Password
                </label>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/50 bg-secondary/20 text-sm placeholder:text-muted-foreground/50 text-foreground transition-all duration-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-background"
                  required
                />
              </div>
            </div>

            {/* Info alert in demo mode */}
            {isMocked && (
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-[11px] leading-relaxed text-indigo-300/90 font-medium">
                💡 **Demo Mode Active**: Supabase credentials are empty or placeholder. Use:
                <div className="mt-1 font-mono text-[10px] bg-black/30 p-1.5 rounded border border-indigo-500/10">
                  Email: admin@nadhiv.dev <br /> Password: password
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/35 active:scale-98 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
