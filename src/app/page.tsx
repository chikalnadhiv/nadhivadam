import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getProfile, getProjects, getSkills } from "@/lib/supabase";

export default async function Home() {
  // Fetch all data in parallel on the server — eliminates client-side waterfall
  const [profile, projects, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
  ]);

  // JSON-LD Schema untuk Person
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    jobTitle: profile.title,
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://nadhivadam.com",
    image: "/profile-image.jpg",
    sameAs: [
      profile.linkedin_url,
      profile.github_url,
      "https://twitter.com/nadhivadam",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location || "Sukabumi",
      addressCountry: "Indonesia",
    },
    knowsAbout: [
      "Frontend Development",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "UI/UX Design",
    ],
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dynamic Ambient Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] left-[20%] h-[40rem] w-[40rem] rounded-full bg-purple-500/5 blur-[120px] dark:bg-purple-500/5" />
        <div className="absolute top-[40%] -right-[10%] h-[35rem] w-[35rem] rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-500/5" />
        <div className="absolute -bottom-[10%] left-[10%] h-[45rem] w-[45rem] rounded-full bg-cyan-500/5 blur-[120px] dark:bg-cyan-500/5" />
      </div>

      {/* Navigation header */}
      <Navbar />

      {/* Main Sections */}
      <main className="relative z-10 flex-grow">
        <Hero profile={profile} />

        <About profile={profile} />

        <TechStack skills={skills} />

        <Services />

        <Projects projects={projects} />

        <Contact profile={profile} />
      </main>

      {/* Global sleek Footer */}
      <Footer profile={profile} />
    </div>
  );
}
