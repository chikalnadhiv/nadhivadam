import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nadhiv Adam | Web Developer Portfolio",
  description: "Welcome to the professional portfolio of Nadhiv Adam, a skilled Web Developer showcasing high-performance web apps, modern designs, and advanced frontend solutions.",
  authors: [{ name: "Nadhiv Adam" }],
  keywords: ["Nadhiv Adam", "Web Developer", "Next.js Portfolio", "React Developer", "Supabase", "Tailwind CSS", "Software Engineer"],
  openGraph: {
    title: "Nadhiv Adam | Web Developer Portfolio",
    description: "Welcome to the professional portfolio of Nadhiv Adam, a skilled Web Developer showcasing modern web apps, technical expertise, and responsive designs.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
