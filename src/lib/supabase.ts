import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Check if credentials are set and not the default template placeholders
const isConfigured = 
  !!(supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  !supabaseUrl.includes('your-supabase-project') &&
  !supabaseAnonKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'));

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// ==========================================
// 1. Interfaces & Types
// ==========================================

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  created_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'tools';
  icon: string; // Lucide icon name as a string
  color?: string; // Custom hover styles or Tailwind classes
  created_at?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  title: string;
  intro_bio: string;
  bio_p1: string;
  bio_p2: string;
  bio_p3: string;
  exp_years: string;
  completed_projects: string;
  websites_launched: string;
  github_url: string;
  linkedin_url: string;
  email: string;
  location: string;
  availability: string;
  resume_url?: string;
  updated_at?: string;
}

// ==========================================
// 2. High-Quality Fallback Seed Data
// ==========================================

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Aetherium Analytics',
    description: 'A real-time SaaS platform featuring collaborative visual dashboards, serverless compute metrics, and predictive anomaly detection.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Recharts', 'Supabase'],
    link: 'https://github.com/nadhiv/aetherium-analytics',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Veloce Commerce',
    description: 'High-performance headless e-commerce store with incremental static regeneration, sub-second loads, stripe payment flows, and merchant dashboard.',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Stripe'],
    link: 'https://github.com/nadhiv/veloce-commerce',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Nexus AI Canvas',
    description: 'Collaborative, visual whiteboarding workspace featuring AI-powered vector graphics generation, intelligent shape recognition, and multi-user sync.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    tech: ['React', 'TypeScript', 'Framer Motion', 'OpenAI API', 'WebSockets'],
    link: 'https://github.com/nadhiv/nexus-ai-canvas',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_SKILLS: Skill[] = [
  // Frontend
  { id: 's1', name: "Next.js", category: "frontend", icon: "Cpu" },
  { id: 's2', name: "React", category: "frontend", icon: "Boxes" },
  { id: 's3', name: "TypeScript", category: "frontend", icon: "Code2" },
  { id: 's4', name: "Tailwind CSS", category: "frontend", icon: "Layers" },
  { id: 's5', name: "Framer Motion", category: "frontend", icon: "Sparkles" },
  // Backend
  { id: 's6', name: "Node.js", category: "backend", icon: "Terminal" },
  { id: 's7', name: "Supabase", category: "backend", icon: "CloudLightning" },
  { id: 's8', name: "PostgreSQL", category: "backend", icon: "Database" },
  { id: 's9', name: "REST APIs", category: "backend", icon: "Workflow" },
  // Tools
  { id: 's10', name: "Git", category: "tools", icon: "GitBranch" },
];

export const DEFAULT_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000000',
  full_name: 'Nadhiv Adam',
  title: 'Web Developer',
  intro_bio: 'Specializing in designing and crafting premium frontends and robust full-stack applications. I bring designs to life with micro-interactions, pixel-perfection, and semantic codebase patterns.',
  bio_p1: 'I am an enthusiastic Web Developer deeply dedicated to creating user-centric, high-performance web applications. My path in coding started out of a fascination with making ideas tangible, and it has evolved into a career centered on writing robust typescript code, optimizing layouts, and creating premium experiences.',
  bio_p2: 'I love combining sophisticated aesthetics with reliable, modular architectures. Working with frameworks like Next.js, standardizing Tailwind configurations, and integrating real-time database backends like Supabase are my daily bread and butter. I pay immense attention to micro-animations, fast page loads, accessibility, and clean code principles.',
  bio_p3: 'When I\'m not writing code or tweaking animations in Framer Motion, you can find me reviewing technical documentations, contributing to developer tools, or exploring next-generation design systems to continuously raise the bar.',
  exp_years: '4+',
  completed_projects: '25+',
  websites_launched: '15+',
  github_url: 'https://github.com/nadhiv',
  linkedin_url: 'https://linkedin.com/in/nadhiv',
  email: 'nadhiv@example.com',
  location: 'Jakarta, Indonesia',
  availability: 'Available for Freelance & Full-time',
  resume_url: '',
  updated_at: new Date().toISOString()
};

// ==========================================
// 3. Local Storage Helpers (Fallback Driver)
// ==========================================

const LS_KEYS = {
  PROJECTS: 'nadhiv_portfolio_projects',
  SKILLS: 'nadhiv_portfolio_skills',
  MESSAGES: 'nadhiv_portfolio_messages',
  PROFILE: 'nadhiv_portfolio_profile'
};

function getLS<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return defaultValue;
  }
}

function saveLS<T>(key: string, data: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// ==========================================
// 4. Projects CRUD Operations
// ==========================================

export async function getProjects(): Promise<Project[]> {
  if (!supabase) {
    console.warn('Supabase is not configured yet. Falling back to localStorage for projects.');
    return getLS<Project[]>(LS_KEYS.PROJECTS, MOCK_PROJECTS);
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  } catch (err) {
    console.error('Failed to fetch projects from Supabase. Falling back to localStorage:', err);
    return getLS<Project[]>(LS_KEYS.PROJECTS, MOCK_PROJECTS);
  }
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  if (!supabase) {
    const local = getLS<Project[]>(LS_KEYS.PROJECTS, MOCK_PROJECTS);
    const newProject: Project = {
      ...project,
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString()
    };
    saveLS(LS_KEYS.PROJECTS, [newProject, ...local]);
    return newProject;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Project;
}

export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>): Promise<Project> {
  if (!supabase) {
    const local = getLS<Project[]>(LS_KEYS.PROJECTS, MOCK_PROJECTS);
    const index = local.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    
    const updated: Project = { ...local[index], ...updates };
    local[index] = updated;
    saveLS(LS_KEYS.PROJECTS, local);
    return updated;
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Project;
}

export async function deleteProject(id: string): Promise<void> {
  if (!supabase) {
    const local = getLS<Project[]>(LS_KEYS.PROJECTS, MOCK_PROJECTS);
    const filtered = local.filter(p => p.id !== id);
    saveLS(LS_KEYS.PROJECTS, filtered);
    return;
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ==========================================
// 5. Skills CRUD Operations
// ==========================================

export async function getSkills(): Promise<Skill[]> {
  if (!supabase) {
    return getLS<Skill[]>(LS_KEYS.SKILLS, MOCK_SKILLS);
  }

  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return MOCK_SKILLS;
    return data as Skill[];
  } catch (err) {
    console.error('Failed to fetch skills from Supabase. Falling back to localStorage:', err);
    return getLS<Skill[]>(LS_KEYS.SKILLS, MOCK_SKILLS);
  }
}

export async function createSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<Skill> {
  if (!supabase) {
    const local = getLS<Skill[]>(LS_KEYS.SKILLS, MOCK_SKILLS);
    const newSkill: Skill = {
      ...skill,
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString()
    };
    saveLS(LS_KEYS.SKILLS, [...local, newSkill]);
    return newSkill;
  }

  const { data, error } = await supabase
    .from('skills')
    .insert([skill])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Skill;
}

export async function deleteSkill(id: string): Promise<void> {
  if (!supabase) {
    const local = getLS<Skill[]>(LS_KEYS.SKILLS, MOCK_SKILLS);
    const filtered = local.filter(s => s.id !== id);
    saveLS(LS_KEYS.SKILLS, filtered);
    return;
  }

  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ==========================================
// 6. Messages CRUD Operations
// ==========================================

export async function getMessages(): Promise<Message[]> {
  if (!supabase) {
    return getLS<Message[]>(LS_KEYS.MESSAGES, []);
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Message[];
  } catch (err) {
    console.error('Failed to fetch messages from Supabase. Falling back to localStorage:', err);
    return getLS<Message[]>(LS_KEYS.MESSAGES, []);
  }
}

export async function sendMessage(message: Omit<Message, 'id' | 'is_read' | 'created_at'>): Promise<Message> {
  if (!supabase) {
    const local = getLS<Message[]>(LS_KEYS.MESSAGES, []);
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substring(2, 11),
      is_read: false,
      created_at: new Date().toISOString()
    };
    saveLS(LS_KEYS.MESSAGES, [newMessage, ...local]);
    return newMessage;
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Message;
}

export async function markMessageRead(id: string, is_read: boolean): Promise<Message> {
  if (!supabase) {
    const local = getLS<Message[]>(LS_KEYS.MESSAGES, []);
    const index = local.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Message not found');
    
    const updated = { ...local[index], is_read };
    local[index] = updated;
    saveLS(LS_KEYS.MESSAGES, local);
    return updated;
  }

  const { data, error } = await supabase
    .from('messages')
    .update({ is_read })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Message;
}

export async function deleteMessage(id: string): Promise<void> {
  if (!supabase) {
    const local = getLS<Message[]>(LS_KEYS.MESSAGES, []);
    const filtered = local.filter(m => m.id !== id);
    saveLS(LS_KEYS.MESSAGES, filtered);
    return;
  }

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ==========================================
// 7. Profile CRUD Operations
// ==========================================

export async function getProfile(): Promise<Profile> {
  if (!supabase) {
    return getLS<Profile>(LS_KEYS.PROFILE, DEFAULT_PROFILE);
  }

  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Table is empty, seed it with defaults
        const { data: seeded, error: seedError } = await supabase
          .from('profile')
          .insert([DEFAULT_PROFILE])
          .select()
          .single();
        if (seedError) throw seedError;
        return seeded as Profile;
      }
      throw error;
    }
    return data as Profile;
  } catch (err) {
    console.error('Failed to fetch profile from Supabase. Falling back to localStorage:', err);
    return getLS<Profile>(LS_KEYS.PROFILE, DEFAULT_PROFILE);
  }
}

export async function updateProfile(updates: Partial<Omit<Profile, 'id' | 'updated_at'>>): Promise<Profile> {
  const profileId = '00000000-0000-0000-0000-000000000000';
  
  if (!supabase) {
    const local = getLS<Profile>(LS_KEYS.PROFILE, DEFAULT_PROFILE);
    const updated: Profile = {
      ...local,
      ...updates,
      updated_at: new Date().toISOString()
    };
    saveLS(LS_KEYS.PROFILE, updated);
    return updated;
  }

  // Check if profile exists, if not seed it first
  const { data: existing } = await supabase.from('profile').select('id').single();
  
  const targetId = existing?.id || profileId;
  const payload = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('profile')
    .update(payload)
    .eq('id', targetId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Profile;
}

// ==========================================
// 8. Storage Image & Document Uploader
// ==========================================

export async function uploadProjectImage(
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!supabase) {
    onProgress?.(30);
    await new Promise(resolve => setTimeout(resolve, 200));
    onProgress?.(70);
    await new Promise(resolve => setTimeout(resolve, 200));
    onProgress?.(100);
    return URL.createObjectURL(file);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const interval = setInterval(() => {
    onProgress?.(Math.floor(Math.random() * 40) + 30);
  }, 100);

  const { error } = await supabase.storage
    .from('project-images')
    .upload(filePath, file);

  clearInterval(interval);
  
  if (error) throw new Error(error.message);

  onProgress?.(100);

  const { data: publicUrlData } = supabase.storage
    .from('project-images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
