import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HybridCoach AI",
  description:
    "HybridCoach AI is a workout assistant that helps you create personalized workout plans.",
  authors: [{ name: "Eric Daniels" }],
  keywords: [
    "workout",
    "fitness",
    "personal trainer",
    "hybrid training",
    "strength training",
    "cardio",
    "flexibility",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col bg-gray-900`}>
        <SessionProvider session={session}>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
