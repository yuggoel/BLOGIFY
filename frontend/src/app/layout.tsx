
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import { Header, Footer } from "@/components";

export const metadata: Metadata = {
  title: "Blogify - Share Your Stories",
  description: "A modern blogging platform for writers, thinkers, and creators.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <UserProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
