import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Changed fonts
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ZeroDay Classes — Odisha Exam Prep & Coding",
  description: "Free OSSC CGL mock tests, Odisha government job alerts, and coding tutorials. Prepare smarter with ZeroDay Classes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
