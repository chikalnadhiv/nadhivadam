import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  // JSON-LD Schema untuk Person
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nadhiv Adam",
    jobTitle: "Web Developer",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://nadhivadam.com",
    image: "/profile-image.jpg",
    sameAs: [
      "https://linkedin.com/in/nadhiv-adam",
      "https://github.com/nadhiv",
      "https://twitter.com/nadhivadam",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sukabumi",
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
        <Hero />
        
        {/* Subtle decorative section transition line */}
        <div className="w-full flex justify-center py-4">
          <div className="h-[1px] w-4/5 max-w-4xl bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </div>
        
        <About />

        <div className="w-full flex justify-center py-4">
          <div className="h-[1px] w-4/5 max-w-4xl bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </div>

        <TechStack />

        <div className="w-full flex justify-center py-4">
          <div className="h-[1px] w-4/5 max-w-4xl bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </div>

          <Services />
        
          <div className="w-full flex justify-center py-4">
            <div className="h-[1px] w-4/5 max-w-4xl bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          </div>

          <Projects />

        <div className="w-full flex justify-center py-4">
          <div className="h-[1px] w-4/5 max-w-4xl bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </div>

        <Contact />
      </main>

      {/* Global sleek Footer */}
      <Footer />
    </div>
  );
}
