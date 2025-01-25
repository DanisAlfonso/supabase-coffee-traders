import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import ThemeToggle from "./components/theme/ThemeToggle";
import Header from "./components/layout/Header";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Selvas Coffee - Premium European Coffee Trading",
  description: "Discover exceptional coffee beans sourced from the world's finest growing regions, traded across Europe with quality and sustainability in mind.",
} satisfies Metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-200`}
      >
        <AuthProvider>
          <ThemeProvider>
            <Header />
            {children}
            <ThemeToggle />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
