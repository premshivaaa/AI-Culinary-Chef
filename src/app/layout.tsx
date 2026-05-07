import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/AppHeader";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Culinary Chef",
  description: "Generate creative recipes from your ingredients using Gemini AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
