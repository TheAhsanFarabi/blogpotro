import type { Metadata } from "next";
import "./globals.css";
import Preloader from "@/components/Preloader"; // Import the preloader

export const metadata: Metadata = {
  title: "BlogPotro — Write. Evolve. Connect.",
  description: "A thinking-first blog platform with version control, mind maps, AI scoring, lofi music, and writing streaks.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain-overlay">
        {/* Mount the preloader globally */}
        <Preloader />
        {children}
      </body>
    </html>
  );
}