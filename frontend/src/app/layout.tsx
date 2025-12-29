import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blogify - Your Space to Write, Express, and Inspire",
  description: "A simple and user-friendly platform where anyone can share their thoughts, ideas, and stories.",
  keywords: ["blog", "writing", "technology", "programming", "tutorials"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <UserProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
