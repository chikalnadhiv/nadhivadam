"use client";

import * as React from "react";
import { uploadProjectImage, Project } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { ImagePlus, Link2, Plus, Sparkles, Trash2, X, Loader2, FileUp } from "lucide-react";
import Image from "next/image";

interface ProjectFormProps {
  project?: Project;
  onSuccess: (project: Project) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const toast = useToast();

  const [title, setTitle] = React.useState(project?.title || "");
  const [description, setDescription] = React.useState(project?.description || "");
  const [image, setImage] = React.useState(project?.image || "");
  const [link, setLink] = React.useState(project?.link || "");
  
  // Tech stack array input states
  const [tech, setTech] = React.useState<string[]>(project?.tech || []);
  const [currentTech, setCurrentTech] = React.useState("");

  // Upload/Submit states
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);

  // File Input Ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle tech stack tags additions
  const handleAddTech = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const cleanTech = currentTech.trim();
    if (!cleanTech) return;

    if (tech.includes(cleanTech)) {
      toast.info(`"${cleanTech}" is already added.`);
      return;
    }

    setTech([...tech, cleanTech]);
    setCurrentTech("");
  };

  const handleRemoveTech = (indexToRemove: number) => {
    setTech(tech.filter((_, idx) => idx !== indexToRemove));
  };

  // Keyboard navigation for tech tags input
  const handleTechInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTech(e);
    }
  };

  // Upload Image Handler
  const handleImageUpload = async (file: File) => {
    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be under 5MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const publicUrl = await uploadProjectImage(file, (progress) => {
        setUploadProgress(progress);
      });
      setImage(publicUrl);
      toast.success("Project screenshot uploaded successfully!");
    } catch (err: any) {
      toast.error(`Image upload failed: ${err.message || err}`);
      setUploadProgress(null);
    } finally {
      setUploading(false);
    }
  };

  // File Select Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Trigger File Dialog
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!title.trim()) {
      toast.error("Project title is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Project description is required.");
      return;
    }
    if (!image) {
      toast.error("A project screenshot is required.");
      return;
    }
    if (tech.length === 0) {
      toast.error("Please add at least one technology stack tag.");
      return;
    }
    if (!link.trim()) {
      toast.error("A project external link is required.");
      return;
    }

    setSubmitting(true);
    try {
      const { createProject, updateProject } = await import("@/lib/supabase");
      const projectPayload = {
        title: title.trim(),
        description: description.trim(),
        image,
        tech,
        link: link.trim(),
      };

      let result: Project;
      if (project?.id) {
        result = await updateProject(project.id, projectPayload);
        toast.success("Project updated successfully!");
      } else {
        result = await createProject(projectPayload);
        toast.success("New project created successfully!");
      }
      onSuccess(result);
    } catch (err: any) {
      toast.error(err.message || "Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
          Project Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Cyberpunk Hub"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/10 text-sm placeholder:text-muted-foreground/40 text-foreground transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-background"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed description of the features, systems architecture, and technology implementations..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/10 text-sm placeholder:text-muted-foreground/40 text-foreground transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-background resize-none"
          required
        />
      </div>

      {/* Screenshot Upload with Storage Integration */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
          Project Screenshot
        </label>

        {image ? (
          /* Preview Banner */
          <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-border group bg-zinc-900">
            <Image
              src={image}
              alt="Project preview"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-102"
              unoptimized={image.startsWith("blob:")}
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center gap-1.5 bg-background border border-border hover:bg-secondary text-foreground text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <FileUp className="h-3.5 w-3.5" />
                Change File
              </button>
              <button
                type="button"
                onClick={() => setImage("")}
                className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* Dropzone */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`h-44 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
              isDragOver
                ? "border-primary bg-primary/5 scale-101"
                : uploading
                ? "border-border bg-secondary/5 cursor-wait"
                : "border-border hover:border-primary/50 hover:bg-secondary/10"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-150"
                    style={{ width: `${uploadProgress ?? 0}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Uploading screenshot... {uploadProgress ?? 0}%
                </p>
              </div>
            ) : (
              <>
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground mb-3 border border-border">
                  <ImagePlus className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Drag and drop screenshot, or <span className="text-primary hover:underline">browse</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Supports PNG, JPG, WebP up to 5MB
                </p>
              </>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Tech Stack Array Badging Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
          Technologies Stack
        </label>
        
        {/* Badges Container */}
        {tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl border border-border/80 bg-secondary/10 mb-2">
            {tech.map((badge, index) => (
              <span
                key={`${badge}-${index}`}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary dark:text-purple-300"
              >
                {badge}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(index)}
                  className="rounded-full p-0.5 text-primary hover:bg-primary/20 hover:text-foreground transition cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input Add Field */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={currentTech}
            onChange={(e) => setCurrentTech(e.target.value)}
            onKeyDown={handleTechInputKeyDown}
            placeholder="Type technology (e.g. Next.js) and press Enter"
            className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-border bg-secondary/10 text-sm placeholder:text-muted-foreground/40 text-foreground transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-background"
          />
          <button
            type="button"
            onClick={handleAddTech}
            className="absolute right-2 bg-primary hover:bg-primary-hover text-white rounded-lg p-1.5 transition cursor-pointer"
            aria-label="Add tech stack"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Project URL Link */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
          Project Link (GitHub / Live Site)
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
            <Link2 className="h-4 w-4" />
          </span>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://github.com/username/repo-name"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-secondary/10 text-sm placeholder:text-muted-foreground/40 text-foreground transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-background"
            required
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] w-full bg-border/40 my-2" />

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting || uploading}
          className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary text-sm font-semibold transition cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {project?.id ? "Save Changes" : "Create Project"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
