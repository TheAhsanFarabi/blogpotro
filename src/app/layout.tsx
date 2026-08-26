import type { Metadata } from "next";
import "./globals.css";
import Preloader from "@/components/Preloader";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "BlogPotro — Write. Evolve. Connect.",
  description: "A social writing platform where people privately develop ideas, publish thoughtful manuscripts, and connect in a global constellation.",
  openGraph: {
    title: "BlogPotro — Social Writing Platform",
    description: "Private by default. Public by choice. Develop ideas privately and publish thoughtful essays to the world.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain-overlay">
        <AuthProvider>
          <Preloader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}