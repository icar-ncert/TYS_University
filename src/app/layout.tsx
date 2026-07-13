import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TYS University | ERP & Management System",
  description: "TYS University - Enterprise-grade University Management ERP with multi-tenant architecture, academic sessions, and comprehensive modules for admissions, examinations, finance, HR, and more.",
  keywords: ["TYS University", "University ERP", "Education Management", "Student Information System", "Multi-tenant"],
  authors: [{ name: "TYS University" }],
  openGraph: {
    title: "TYS University | ERP & Management System",
    description: "Enterprise-grade University Management ERP",
    siteName: "TYS University",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
