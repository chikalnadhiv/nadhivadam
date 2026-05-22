"use client";

import * as React from "react";
import { createSkill, Skill } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import * as Icons from "lucide-react";
import { Sparkles, Loader2, Cpu, Code2, Boxes, Terminal, Database, CloudLightning, Workflow, GitBranch, Layers } from "lucide-react";

interface SkillFormProps {
  onSuccess: (skill: Skill) => void;
  onCancel: () => void;
}

const COMMON_ICONS = [
  { name: "Code2", label: "Code Icon", component: Code2 },
  { name: "Cpu", label: "Processor Icon", component: Cpu },
  { name: "Boxes", label: "Component Blocks", component: Boxes },
  { name: "Terminal", label: "Console Terminal", component: Terminal },
  { name: "Database", label: "Database Icon", component: Database },
  { name: "CloudLightning", label: "Cloud Engine", component: CloudLightning },
  { name: "Workflow", label: "API Workflow", component: Workflow },
  { name: "GitBranch", label: "Git Branch", component: GitBranch },
  { name: "Layers", label: "Layers / CSS Stack", component: Layers },
  { name: "Sparkles", label: "Sparkles / Animation", component: Sparkles },
];

export function SkillForm({ onSuccess, onCancel }: SkillFormProps) {
  const toast = useToast();

  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState<"frontend" | "backend" | "tools">("frontend");
  const [icon, setIcon] = React.useState("Code2");
  const [customIcon, setCustomIcon] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Skill name is required.");
      return;
    }

    const finalIcon = customIcon.trim() ? customIcon.trim() : icon;
    
    // Verify icon exists in Lucide
    if (!(Icons as any)[finalIcon]) {
      toast.error(`"${finalIcon}" is not a valid Lucide icon name. Please use a valid PascalCase Lucide icon (e.g. "Github").`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        category,
        icon: finalIcon,
      };

      const result = await createSkill(payload);
      toast.success(`Skill "${result.name}" added to Tech Stack!`);
      onSuccess(result);
    } catch (err: any) {
      toast.error(err.message || "Failed to add skill.");
    } finally {
      setSubmitting(false);
    }
  };

  // Resolve current active icon component for live preview
  const activeIconKey = customIcon.trim() ? customIcon.trim() : icon;
  const LiveIconComponent = (Icons as any)[activeIconKey] || Icons.HelpCircle;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      
      {/* Skill Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
          Skill Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Next.js, Node.js, Docker"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/10 text-sm placeholder:text-muted-foreground/40 text-foreground transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-background"
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
          Category
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["frontend", "backend", "tools"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border capitalize cursor-pointer transition-all ${
                category === cat
                  ? "bg-primary border-primary text-primary-foreground shadow"
                  : "border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Icon Selector Grid */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
          Choose Pre-selected Developer Icon
        </label>
        <div className="grid grid-cols-5 gap-2 p-3.5 rounded-2xl border border-border/80 bg-secondary/5">
          {COMMON_ICONS.map((ico) => {
            const IcoComponent = ico.component;
            const isSelected = icon === ico.name && !customIcon.trim();
            return (
              <button
                key={ico.name}
                type="button"
                onClick={() => {
                  setIcon(ico.name);
                  setCustomIcon("");
                }}
                className={`h-11 w-full rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-2 border-primary text-primary"
                    : "border border-border/40 hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                title={ico.label}
              >
                <IcoComponent className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Lucide Icon Text Input */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
            Or Type Custom Lucide Icon Name
          </label>
          <a
            href="https://lucide.dev/icons"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-primary hover:underline"
          >
            Browse Icons ↗
          </a>
        </div>
        <input
          type="text"
          value={customIcon}
          onChange={(e) => setCustomIcon(e.target.value)}
          placeholder="e.g. Github, Server, Monitor (PascalCase)"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/10 text-sm placeholder:text-muted-foreground/40 text-foreground transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-background"
        />
      </div>

      {/* Icon Symbol Preview Banner */}
      <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-secondary/10">
        <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
          <LiveIconComponent className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">Live Icon Symbol Preview</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
            lucide-react/{activeIconKey}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/30">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary text-sm font-semibold transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Add Skill
            </>
          )}
        </button>
      </div>
    </form>
  );
}
