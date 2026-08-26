"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { User, BookOpen, Bookmark, Bell, LogOut, ChevronDown, Feather } from "lucide-react";

export default function UserMenu() {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!profile) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-paper-200 neo-border-sm hover:bg-paper-300 neo-shadow-xs transition-all"
      >
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="w-6 h-6 rounded-full neo-border-sm object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-[11px] font-black text-ink-primary">
            {profile.display_name.charAt(0)}
          </div>
        )}
        <span className="text-xs font-bold text-ink-primary max-w-[100px] truncate hidden sm:inline" style={{ fontFamily: "var(--font-jetbrains)" }}>
          @{profile.username}
        </span>
        <ChevronDown size={12} strokeWidth={2.4} className="text-ink-muted" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-paper-50 neo-border neo-shadow-xl py-2 z-[100] animate-slide-up"
        >
          {/* User Header */}
          <div className="px-4 py-2.5 border-b-2 border-ink bg-paper-200">
            <div className="text-xs font-bold text-ink-primary truncate">{profile.display_name}</div>
            <div className="text-[10px] text-ink-muted font-bold truncate" style={{ fontFamily: "var(--font-jetbrains)" }}>
              @{profile.username}
            </div>
          </div>


          <div className="py-1">
            <Link
              href={`/@${profile.username}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-ink-primary hover:bg-paper-200 transition-colors"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <User size={14} strokeWidth={2.4} className="text-amber" />
              <span>Writer Profile</span>
            </Link>

            <Link
              href="/editor"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-ink-primary hover:bg-paper-200 transition-colors"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Feather size={14} strokeWidth={2.4} className="text-violet" />
              <span>Writing Studio</span>
            </Link>

            <Link
              href={`/@${profile.username}?tab=saved`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-ink-primary hover:bg-paper-200 transition-colors"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Bookmark size={14} strokeWidth={2.4} className="text-mint" />
              <span>Saved Articles</span>
            </Link>

            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-ink-primary hover:bg-paper-200 transition-colors"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Bell size={14} strokeWidth={2.4} className="text-rose" />
              <span>Notifications</span>
            </Link>
          </div>

          <div className="border-t-2 border-ink pt-1">
            <button
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose hover:bg-pastel-rose-light transition-colors text-left"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <LogOut size={14} strokeWidth={2.4} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
