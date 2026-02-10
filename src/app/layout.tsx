import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Changed fonts
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ZeroDay Classes",
  description: "Master Zero-Day vulnerabilities before they happen.",
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
