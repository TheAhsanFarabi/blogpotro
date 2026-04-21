"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PenLine, Network, Settings } from "lucide-react";
import { useState } from "react";
import NewBlogModal from "./NewBlogModal";
import SettingsModal from "./SettingsModal";
import StreakWidget from "./StreakWidget";
import FocusMode from "./FocusMode";

export default function Navbar() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <nav
        className="flex items-center justify-between px-3 sm:px-5 flex-shrink-0 sticky top-0 z-50 overflow-x-hidden"
        style={{
          height: 52,
          background: "rgba(13,13,18,0.97)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-7 h-7 relative flex items-center justify-center flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="Blogpotro Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <span
            className="hidden sm:block font-semibold text-ink-primary whitespace-nowrap"
            style={{ fontFamily: "var(--font-cormorant)", letterSpacing: "-0.02em", fontSize: 19 }}
          >
            blogpotro
          </span>
          <span
            className="hidden sm:block text-ink-muted px-1.5 py-0.5 rounded-full border"
            style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, background: "#141419", borderColor: "rgba(255,255,255,0.07)" }}
          >
            beta
          </span>
        </Link>

        {/* Center nav */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl mx-auto sm:mx-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Link
            href="/editor"
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs transition-all duration-150"
            style={pathname === "/editor" ? { background: "rgba(232,160,69,0.12)", color: "#e8a045" } : { color: "#5e5a55" }}
          >
            <PenLine size={13} /> <span className="hidden sm:inline">Editor</span>
          </Link>
          <Link
            href="/feed"
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs transition-all duration-150"
            style={pathname === "/feed" ? { background: "rgba(157,124,255,0.12)", color: "#9d7cff" } : { color: "#5e5a55" }}
          >
            <Network size={13} /> <span className="hidden sm:inline">Graph</span>
          </Link>
        </div>

        {/* Right side - Adjusted to keep the StreakWidget perfectly aligned */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <StreakWidget />
          <div className="hidden sm:block">{pathname === "/editor" && <FocusMode />}</div>
          
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-muted hover:text-ink-primary transition-all flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            title="Settings"
          >
            <Settings size={14} />
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110 flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #e8a045, #c87d2a)", color: "#07070a" }}
          >
            <PenLine size={12} strokeWidth={2.5} /> <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </nav>

      {/* Render both Modals */}
      <NewBlogModal open={showModal} onClose={() => setShowModal(false)} />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}