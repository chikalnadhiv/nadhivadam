import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AccentColorToggle from "@/components/ui/AccentColorToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nadhiv Adam - Web Developer Sukabumi",
  description: "Portfolio Nadhiv Adam, Web Developer dari Sukabumi yang fokus pada UI/UX development dengan teknologi modern Next.js, React, dan Tailwind CSS.",
  keywords: ["Nadhiv Adam", "Web Developer Sukabumi", "Frontend Developer Indonesia", "Next.js", "React", "UI/UX Developer"],
  authors: [{ name: "Nadhiv Adam" }],
  creator: "Nadhiv Adam",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://nadhivadam.my.id"),
  
  openGraph: {
    title: "Nadhiv Adam - Web Developer Sukabumi",
    description: "Portfolio Nadhiv Adam, Web Developer dari Sukabumi yang fokus pada UI/UX development dengan teknologi modern.",
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://nadhivadam.my.id",
    siteName: "Nadhiv Adam Portfolio",
    images: [
      {
        url: "/ndhvlogo.png",
        width: 1024,
        height: 1024,
        alt: "Nadhiv Adam - Web Developer Sukabumi Logo",
        type: "image/png",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Nadhiv Adam - Web Developer Sukabumi",
    description: "Portfolio Nadhiv Adam, Web Developer dari Sukabumi yang fokus pada UI/UX development.",
    images: ["/og-image.jpg"],
    creator: "@nadhivadam",
  },
  
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://nadhivadam.my.id",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('nadhiv-portfolio-accent');
                  if (saved) {
                    document.documentElement.setAttribute('data-accent', saved);
                  } else {
                    document.documentElement.setAttribute('data-accent', 'blue');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <Providers>
          {children}
          <AccentColorToggle />
        </Providers>
      </body>
    </html>
  );
}
