"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  getProjects, deleteProject, Project,
  getSkills, deleteSkill, Skill,
  getMessages, markMessageRead, deleteMessage, Message,
  getProfile, updateProfile, Profile
} from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { Dialog } from "@/components/ui/Dialog";
import { ProjectForm } from "@/components/ProjectForm";
import { SkillForm } from "@/components/SkillForm";
import { 
  FolderGit2, 
  Plus, 
  ExternalLink, 
  Edit2, 
  Trash2, 
  LogOut, 
  Eye, 
  Database, 
  Layers, 
  Link2,
  FileCheck2,
  AlertTriangle,
  Loader2,
  Mail,
  User,
  Settings,
  MailOpen,
  MapPin,
  Calendar,
  Sparkles,
  Award
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

type DashboardTab = "projects" | "skills" | "inbox" | "profile";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut, isMocked } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = React.useState<DashboardTab>("projects");

  // --- Database Resource States ---
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [profile, setProfile] = React.useState<Profile | null>(null);

  // --- Loading States ---
  const [loadingData, setLoadingData] = React.useState(true);

  // --- Modal Dialog States ---
  const [isProjectFormOpen, setIsProjectFormOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | undefined>(undefined);
  const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(null);
  const [isDeletingProject, setIsDeletingProject] = React.useState(false);

  const [isSkillFormOpen, setIsSkillFormOpen] = React.useState(false);

  const [viewingMessage, setViewingMessage] = React.useState<Message | null>(null);

  // --- Profile Form Settings State ---
  const [fullName, setFullName] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [availability, setAvailability] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [introBio, setIntroBio] = React.useState("");
  const [bioP1, setBioP1] = React.useState("");
  const [bioP2, setBioP2] = React.useState("");
  const [bioP3, setBioP3] = React.useState("");
  const [expYears, setExpYears] = React.useState("");
  const [completedProjects, setCompletedProjects] = React.useState("");
  const [websitesLaunched, setWebsitesLaunched] = React.useState("");
  const [githubUrl, setGithubUrl] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");
  const [resumeUrl, setResumeUrl] = React.useState("");
  const [instagramUrl, setInstagramUrl] = React.useState("");
  const [twitterUrl, setTwitterUrl] = React.useState("");
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const [savingProfile, setSavingProfile] = React.useState(false);

  // Guard route: redirect unauthenticated users
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/admin/login");
    }
  }, [user, authLoading, router]);

  // Combined Resource Loader
  const loadDashboardData = React.useCallback(async () => {
    setLoadingData(true);
    try {
      const [fetchedProjects, fetchedSkills, fetchedMessages, fetchedProfile] = await Promise.all([
        getProjects(),
        getSkills(),
        getMessages(),
        getProfile()
      ]);

      setProjects(fetchedProjects);
      setSkills(fetchedSkills);
      setMessages(fetchedMessages);
      setProfile(fetchedProfile);

      // Populate Settings Inputs
      setFullName(fetchedProfile.full_name);
      setJobTitle(fetchedProfile.title);
      setAvailability(fetchedProfile.availability);
      setLocation(fetchedProfile.location);
      setEmail(fetchedProfile.email);
      setIntroBio(fetchedProfile.intro_bio);
      setBioP1(fetchedProfile.bio_p1);
      setBioP2(fetchedProfile.bio_p2);
      setBioP3(fetchedProfile.bio_p3);
      setExpYears(fetchedProfile.exp_years);
      setCompletedProjects(fetchedProfile.completed_projects);
      setWebsitesLaunched(fetchedProfile.websites_launched);
      setGithubUrl(fetchedProfile.github_url);
      setLinkedinUrl(fetchedProfile.linkedin_url);
      setResumeUrl(fetchedProfile.resume_url || "");
      setInstagramUrl(fetchedProfile.instagram_url || "");
      setTwitterUrl(fetchedProfile.twitter_url || "");
      setYoutubeUrl(fetchedProfile.youtube_url || "");
    } catch (err: any) {
      toast.error(err.message || "Failed to load dashboard data.");
    } finally {
      setLoadingData(false);
    }
  }, [toast]);

  React.useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error("Failed to sign out: " + error.message);
      } else {
        toast.success("Signed out successfully.");
        router.replace("/admin/login");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during sign out.");
    }
  };

  // --- PROJECTS WORKFLOW HANDLERS ---
  const handleProjectDelete = async () => {
    if (!projectToDelete) return;
    setIsDeletingProject(true);
    try {
      await deleteProject(projectToDelete.id);
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      toast.success(`Project "${projectToDelete.title}" deleted.`);
      setProjectToDelete(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project.");
    } finally {
      setIsDeletingProject(false);
    }
  };

  const handleProjectSuccess = (savedProject: Project) => {
    setIsProjectFormOpen(false);
    setEditingProject(undefined);
    const index = projects.findIndex(p => p.id === savedProject.id);
    if (index !== -1) {
      const updated = [...projects];
      updated[index] = savedProject;
      setProjects(updated);
    } else {
      setProjects([savedProject, ...projects]);
    }
  };

  // --- SKILLS WORKFLOW HANDLERS ---
  const handleSkillSuccess = (savedSkill: Skill) => {
    setIsSkillFormOpen(false);
    setSkills([...skills, savedSkill]);
  };

  const handleSkillDelete = async (id: string, name: string) => {
    try {
      await deleteSkill(id);
      setSkills(skills.filter(s => s.id !== id));
      toast.success(`Technology "${name}" removed.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to remove skill.");
    }
  };

  // --- MESSAGES WORKFLOW HANDLERS ---
  const handleMessageClick = async (msg: Message) => {
    setViewingMessage(msg);
    if (!msg.is_read) {
      try {
        await markMessageRead(msg.id, true);
        // Update local state instantly
        setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      } catch (err) {
        console.warn("Failed to mark message read on backend:", err);
      }
    }
  };

  const handleMessageDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent opening details
    try {
      await deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      toast.success("Message deleted successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete message.");
    }
  };

  // --- PROFILE WORKFLOW HANDLERS ---
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        full_name: fullName.trim(),
        title: jobTitle.trim(),
        availability: availability.trim(),
        location: location.trim(),
        email: email.trim(),
        intro_bio: introBio.trim(),
        bio_p1: bioP1.trim(),
        bio_p2: bioP2.trim(),
        bio_p3: bioP3.trim(),
        exp_years: expYears.trim(),
        completed_projects: completedProjects.trim(),
        websites_launched: websitesLaunched.trim(),
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        resume_url: resumeUrl.trim(),
        instagram_url: instagramUrl.trim(),
        twitter_url: twitterUrl.trim(),
        youtube_url: youtubeUrl.trim(),
      };

      const result = await updateProfile(payload);
      setProfile(result);
      toast.success("Profile bio settings updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile settings.");
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Computations for Stats ---
  const tabCounts = React.useMemo(() => {
    const unreadMessages = messages.filter(m => !m.is_read).length;
    return { unreadMessages };
  }, [messages]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm font-semibold tracking-wide animate-pulse">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-[20%] h-[35rem] w-[35rem] rounded-full bg-purple-500/3 blur-[120px] dark:bg-purple-500/3" />
        <div className="absolute bottom-0 right-[20%] h-[35rem] w-[35rem] rounded-full bg-indigo-500/3 blur-[120px] dark:bg-indigo-500/3" />
      </div>

      {/* Sticky Header Panel */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 md:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-lg tracking-tight hover:opacity-90 transition flex items-center gap-2">
              <span className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                🚀
              </span>
              Nadhiv<span className="gradient-text">.admin</span>
            </Link>
            
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              isMocked 
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" 
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            }`}>
              <Database className="h-3 w-3" />
              {isMocked ? "Demo Mode (Local)" : "Live Supabase"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye className="h-4 w-4" />
              View Site
            </Link>

            <div className="h-4 w-[1px] bg-border/60 hidden sm:block" />

            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">{user.email}</span>
              <span className="text-[10px] text-muted-foreground">Portfolio Admin</span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-rose-400 transition-colors bg-secondary/30 hover:bg-rose-500/10 border border-border/50 hover:border-rose-500/30 px-3.5 py-2 rounded-xl cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="relative z-10 flex-grow py-10">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Control <span className="gradient-text">Command Center</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Configure your portfolio projects, technologies stack, settings, and read incoming messages.
              </p>
            </div>
          </div>

          {/* Core Dashboard Tab controls */}
          <div className="flex overflow-x-auto pb-2 border-b border-border/40 mb-8 scrollbar-none gap-2">
            {[
              { id: "projects", label: "Projects Directory", icon: FolderGit2 },
              { id: "skills", label: "Skills Stack", icon: Layers },
              { 
                id: "inbox", 
                label: "Inbox Messages", 
                icon: Mail, 
                badge: tabCounts.unreadMessages > 0 ? tabCounts.unreadMessages : undefined 
              },
              { id: "profile", label: "Profile Bio & SEO", icon: Settings },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/10"
                      : "border-border/60 hover:border-primary/30 text-muted-foreground hover:text-foreground bg-secondary/10 hover:bg-secondary/30"
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                  {tab.badge !== undefined && (
                    <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {loadingData ? (
            /* Main loading state */
            <div className="glass rounded-3xl border border-border/40 bg-zinc-950/10 p-12 text-center flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">
                Retrieving dataset from Supabase server...
              </p>
            </div>
          ) : (
            /* Dynamic Content Renderer depending on Tab */
            <div className="space-y-6">
              
              {/* ========================================== */}
              {/* TAB A: PROJECTS */}
              {/* ========================================== */}
              {activeTab === "projects" && (
                <div className="glass rounded-3xl border border-border/40 bg-zinc-950/10 shadow-xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-sm font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                      <FolderGit2 className="h-4.5 w-4.5 text-primary" />
                      Projects Index ({projects.length})
                    </h2>
                    <button
                      onClick={() => {
                        setEditingProject(undefined);
                        setIsProjectFormOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover px-4 py-2 text-xs font-bold text-white shadow shadow-primary/20 transition cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Add Project
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="h-12 w-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground mb-3 mx-auto">
                        <FolderGit2 className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-foreground">No projects recorded</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[240px] leading-relaxed mx-auto">
                        Inject your first developer masterpiece into the database.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="glass flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-border/40 bg-zinc-950/5 hover:border-primary/30 hover:bg-background transition-all duration-300"
                        >
                          <div className="relative h-16 w-24 shrink-0 rounded-lg overflow-hidden bg-zinc-900 border border-border/40">
                            {project.image ? (
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover"
                                unoptimized={project.image.startsWith("blob:")}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary">
                                <FolderGit2 className="h-5 w-5" />
                              </div>
                            )}
                          </div>

                          <div className="flex-grow text-center sm:text-left min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                              <h3 className="text-sm font-bold text-foreground truncate">{project.title}</h3>
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors justify-center sm:justify-start"
                              >
                                <span className="truncate max-w-[120px]">{project.link}</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                              {project.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setEditingProject(project);
                                setIsProjectFormOpen(true);
                              }}
                              className="p-2 rounded-xl border border-border/60 hover:border-primary/45 text-muted-foreground hover:text-primary bg-secondary/20 hover:bg-primary/5 transition cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setProjectToDelete(project)}
                              className="p-2 rounded-xl border border-border/60 hover:border-rose-500/40 text-muted-foreground hover:text-rose-400 bg-secondary/20 hover:bg-rose-500/5 transition cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================== */}
              {/* TAB B: TECH STACK / SKILLS */}
              {/* ========================================== */}
              {activeTab === "skills" && (
                <div className="glass rounded-3xl border border-border/40 bg-zinc-950/10 shadow-xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-sm font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                      <Layers className="h-4.5 w-4.5 text-primary" />
                      Skills & Technologies Directory ({skills.length})
                    </h2>
                    <button
                      onClick={() => setIsSkillFormOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover px-4 py-2 text-xs font-bold text-white shadow shadow-primary/20 transition cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Add Skill
                    </button>
                  </div>

                  {skills.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="h-12 w-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground mb-3 mx-auto">
                        <Layers className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-foreground">No technologies recorded</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[240px] leading-relaxed mx-auto">
                        Inject custom skills to list them dynamically in your Tech Stack section.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {skills.map((skill) => {
                        const IconComponent = (Icons as any)[skill.icon] || Icons.Code2;
                        return (
                          <div
                            key={skill.id}
                            className="glass flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-zinc-950/5 hover:border-primary/30 hover:bg-background transition-all duration-300"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-foreground truncate">{skill.name}</h4>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider capitalize mt-0.5">
                                  {skill.category}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleSkillDelete(skill.id, skill.name)}
                              className="p-1.5 rounded-lg border border-border/60 hover:border-rose-500/40 text-muted-foreground hover:text-rose-400 bg-secondary/10 hover:bg-rose-500/5 transition cursor-pointer"
                              title="Delete skill"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================== */}
              {/* TAB C: INBOX MESSAGES */}
              {/* ========================================== */}
              {activeTab === "inbox" && (
                <div className="glass rounded-3xl border border-border/40 bg-zinc-950/10 shadow-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                      <Mail className="h-4.5 w-4.5 text-primary" />
                      Client Inbox Submissions ({messages.length})
                    </h2>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="h-12 w-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground mb-3 mx-auto">
                        <MailOpen className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-foreground">Inbox is completely clean</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[240px] leading-relaxed mx-auto">
                        Contact form messages from your home page will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => handleMessageClick(msg)}
                          className={`glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                            msg.is_read
                              ? "border-border/40 bg-zinc-950/5 hover:border-primary/20 hover:bg-background"
                              : "border-primary/40 bg-primary/5 hover:border-primary/60 hover:bg-primary/8 shadow-md"
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <span className="shrink-0 mt-1">
                              {msg.is_read ? (
                                <MailOpen className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <Mail className="h-5 w-5 text-primary animate-pulse" />
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-foreground truncate">{msg.name}</span>
                                {!msg.is_read && (
                                  <span className="rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[8px] font-black text-primary uppercase">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground truncate">{msg.email}</p>
                              <p className="text-xs text-muted-foreground/80 mt-1.5 line-clamp-1 leading-relaxed">
                                {msg.message}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : "Just now"}
                            </span>
                            <button
                              onClick={(e) => handleMessageDelete(e, msg.id)}
                              className="p-1.5 rounded-lg border border-border/60 hover:border-rose-500/40 text-muted-foreground hover:text-rose-400 bg-secondary/10 hover:bg-rose-500/5 transition cursor-pointer"
                              title="Delete message"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================== */}
              {/* TAB D: PROFILE & SOCIAL SETTINGS */}
              {/* ========================================== */}
              {activeTab === "profile" && (
                <form onSubmit={handleProfileSave} className="glass rounded-3xl border border-border/40 bg-zinc-950/10 shadow-xl p-6 space-y-6">
                  
                  {/* Tab Title */}
                  <div className="flex items-center justify-between pb-4 border-b border-border/40">
                    <h2 className="text-sm font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-2">
                      <User className="h-4.5 w-4.5 text-primary" />
                      About Profile & Settings Editor
                    </h2>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow shadow-primary/20 cursor-pointer disabled:opacity-50"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Saving Coordinates...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          Save Bio Settings
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Left Column: Coordinates */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-primary tracking-wider uppercase">Basic Coordinates</h3>
                      
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary"
                          required
                        />
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Job Title</label>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary"
                          required
                        />
                      </div>

                      {/* Location & Availability */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Location</label>
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Availability</label>
                          <input
                            type="text"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary"
                            required
                          />
                        </div>
                      </div>

                      {/* Email & Resume */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Public Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Resume / CV Link</label>
                        <input
                          type="text"
                          value={resumeUrl}
                          onChange={(e) => setResumeUrl(e.target.value)}
                          placeholder="https://drive.google.com/cv-pdf-url"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Right Column: Socials & Metrics */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-primary tracking-wider uppercase">Socials & Metric Stats</h3>

                      {/* Social handles */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">GitHub Profile URL</label>
                          <input
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">LinkedIn Profile URL</label>
                          <input
                            type="url"
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Instagram URL</label>
                          <input
                            type="url"
                            value={instagramUrl}
                            onChange={(e) => setInstagramUrl(e.target.value)}
                            placeholder="https://instagram.com/username"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Twitter / X URL</label>
                          <input
                            type="url"
                            value={twitterUrl}
                            onChange={(e) => setTwitterUrl(e.target.value)}
                            placeholder="https://twitter.com/username"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">YouTube Channel URL</label>
                        <input
                          type="url"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          placeholder="https://youtube.com/@channel"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      {/* Metric widgets */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Experience Years</label>
                          <input
                            type="text"
                            value={expYears}
                            onChange={(e) => setExpYears(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary text-center"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Projects Done</label>
                          <input
                            type="text"
                            value={completedProjects}
                            onChange={(e) => setCompletedProjects(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary text-center"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Websites Live</label>
                          <input
                            type="text"
                            value={websitesLaunched}
                            onChange={(e) => setWebsitesLaunched(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary text-center"
                            required
                          />
                        </div>
                      </div>

                      {/* Summary Bio */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Intro Bio Hook</label>
                        <textarea
                          value={introBio}
                          onChange={(e) => setIntroBio(e.target.value)}
                          rows={2}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Narrative Bio Editor Section */}
                  <div className="space-y-3.5 pt-4 border-t border-border/30">
                    <h3 className="text-xs font-bold text-primary tracking-wider uppercase">About Page Narrative Paragraphs</h3>
                    
                    <div className="space-y-3">
                      {/* Bio 1 */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Paragraph 1 (Who you are)</label>
                        <textarea
                          value={bioP1}
                          onChange={(e) => setBioP1(e.target.value)}
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                          required
                        />
                      </div>

                      {/* Bio 2 */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Paragraph 2 (Philosophy / Stack details)</label>
                        <textarea
                          value={bioP2}
                          onChange={(e) => setBioP2(e.target.value)}
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                          required
                        />
                      </div>

                      {/* Bio 3 */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Paragraph 3 (Interest details / Off-work hobby)</label>
                        <textarea
                          value={bioP3}
                          onChange={(e) => setBioP3(e.target.value)}
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/10 text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>
      </main>

      {/* Workspace footer */}
      <footer className="w-full border-t border-border/30 py-6 mt-10">
        <div className="mx-auto max-w-6xl px-6 md:px-8 text-center text-xs text-muted-foreground leading-normal">
          &copy; {new Date().getFullYear()} Nadhiv Adam Portfolio Admin Control Center. Developed with Next.js & Supabase.
        </div>
      </footer>

      {/* ========================================== */}
      {/* DIALOG 1: CREATE / EDIT PROJECT */}
      {/* ========================================== */}
      <Dialog
        isOpen={isProjectFormOpen}
        onClose={() => {
          setIsProjectFormOpen(false);
          setEditingProject(undefined);
        }}
        title={editingProject ? "Configure Project Settings" : "Deploy New Project Record"}
      >
        <ProjectForm
          project={editingProject}
          onSuccess={handleProjectSuccess}
          onCancel={() => {
            setIsProjectFormOpen(false);
            setEditingProject(undefined);
          }}
        />
      </Dialog>

      {/* ========================================== */}
      {/* DIALOG 2: CONFIRM PROJECT DELETE */}
      {/* ========================================== */}
      <Dialog
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="Confirm Irreversible Deletion"
      >
        <div className="text-left space-y-4">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-300">
            <span className="shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-rose-400 animate-pulse" />
            </span>
            <div className="text-xs font-semibold leading-relaxed">
              <strong>Warning:</strong> You are about to permanently purge the project <strong>&quot;{projectToDelete?.title}&quot;</strong> and its storage relations. This action is absolute and cannot be undone.
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you completely sure you want to proceed with deleting this record?
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
            <button
              onClick={() => setProjectToDelete(null)}
              disabled={isDeletingProject}
              className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary text-sm font-semibold transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleProjectDelete}
              disabled={isDeletingProject}
              className="flex items-center gap-1.5 bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-50"
            >
              {isDeletingProject ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Purging Record...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Project
                </>
              )}
            </button>
          </div>
        </div>
      </Dialog>

      {/* ========================================== */}
      {/* DIALOG 3: ADD NEW PORTFOLIO SKILL */}
      {/* ========================================== */}
      <Dialog
        isOpen={isSkillFormOpen}
        onClose={() => setIsSkillFormOpen(false)}
        title="Deploy New Technology Skill"
      >
        <SkillForm
          onSuccess={handleSkillSuccess}
          onCancel={() => setIsSkillFormOpen(false)}
        />
      </Dialog>

      {/* ========================================== */}
      {/* DIALOG 4: VIEW MESSAGE DETAILS */}
      {/* ========================================== */}
      <Dialog
        isOpen={!!viewingMessage}
        onClose={() => setViewingMessage(null)}
        title="Form Message Submission Details"
      >
        {viewingMessage && (
          <div className="text-left space-y-4">
            <div className="flex flex-col sm:flex-row justify-between border-b border-border/40 pb-3 gap-2">
              <div>
                <h4 className="text-sm font-bold text-foreground">{viewingMessage.name}</h4>
                <a
                  href={`mailto:${viewingMessage.email}`}
                  className="text-xs text-primary hover:underline font-mono"
                >
                  {viewingMessage.email}
                </a>
              </div>
              <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 self-start sm:self-center">
                <Calendar className="h-3.5 w-3.5" />
                {viewingMessage.created_at ? new Date(viewingMessage.created_at).toLocaleString() : "Just now"}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Message Body</label>
              <div className="rounded-xl border border-border/60 bg-secondary/15 p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {viewingMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
              <button
                onClick={() => setViewingMessage(null)}
                className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary text-sm font-semibold transition cursor-pointer"
              >
                Close details
              </button>
              <button
                onClick={async (e) => {
                  await handleMessageDelete(e, viewingMessage.id);
                  setViewingMessage(null);
                }}
                className="flex items-center gap-1.5 bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Purge Message
              </button>
            </div>
          </div>
        )}
      </Dialog>

    </div>
  );
}
