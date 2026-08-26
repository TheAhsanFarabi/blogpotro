"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  PenLine, Network, Settings, Sparkles, Home, 
  Compass, Bell, Feather, LogIn, Menu, X 
} from "lucide-react";
import { useState, useEffect } from "react";
import NewBlogModal from "./NewBlogModal";
import SettingsModal from "./SettingsModal";
import StreakWidget from "./StreakWidget";
import FocusMode from "./FocusMode";
import UserMenu from "./UserMenu";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/lib/services/notificationService";

export default function Navbar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      notificationService.getNotifications(profile.id).then((notifs) => {
        setUnreadNotifs(notifs.filter((n) => !n.is_read).length);
      });
    }
  }, [profile]);

  const navLinks = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/editor", label: "Studio", icon: Feather },
    { href: "/feed", label: "Constellation", icon: Network },
  ];

  return (
    <>
      <nav
        className="flex items-center justify-between px-3 sm:px-6 flex-shrink-0 sticky top-0 z-50 bg-paper-50 neo-border border-t-0 border-l-0 border-r-0"
        style={{
          height: 58,
          borderBottomWidth: 2,
        }}
      >

        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 relative flex items-center justify-center flex-shrink-0 bg-pastel-cream-solid rounded-lg neo-border-sm neo-shadow-xs group-hover:rotate-3 transition-transform">
              <Image 
                src="/logo.png" 
                alt="Blogpotro Logo" 
                fill 
                className="object-contain p-1"
                priority
              />
            </div>
            <span
              className="font-bold text-ink-primary tracking-tight whitespace-nowrap"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: 22 }}
            >
              blogpotro
            </span>
            <span
              className="hidden lg:block text-ink-primary font-bold px-1.5 py-0.2 rounded-md neo-border-sm bg-pastel-violet-solid uppercase tracking-wider"
              style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9 }}
            >
              social
            </span>
          </Link>
        </div>

        {/* Center: Main Social & Studio Nav Links (Desktop) */}
        <div
          className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-paper-200 neo-border-sm"
        >
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href === "/home" && pathname === "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-pastel-amber-solid text-ink-primary neo-border-sm neo-shadow-xs"
                    : "text-ink-secondary hover:text-ink-primary hover:bg-paper-300"
                }`}
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                <Icon size={13} strokeWidth={2.4} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Notifications link */}
          <Link
            href="/notifications"
            className={`relative p-2 rounded-lg bg-paper-200 neo-border-sm text-ink-secondary hover:text-ink-primary hover:bg-paper-300 neo-shadow-xs transition-all ${
              pathname === "/notifications" ? "bg-pastel-rose-solid text-ink-primary" : ""
            }`}
            title="Notifications"
          >
            <Bell size={14} strokeWidth={2.4} />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pastel-rose-solid text-rose neo-border-sm rounded-full text-[9px] font-black flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </Link>

          <StreakWidget />
          <div className="hidden sm:block">{pathname === "/editor" && <FocusMode />}</div>
          
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-paper-200 neo-border-sm text-ink-secondary hover:text-ink-primary hover:bg-paper-300 neo-shadow-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex-shrink-0"
            title="Settings"
          >
            <Settings size={14} strokeWidth={2.2} />
          </button>

          {/* New Thought Button */}
          <button
            onClick={() => setShowModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-pastel-amber-solid text-ink-primary neo-btn-sm flex-shrink-0"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <PenLine size={13} strokeWidth={2.5} />
            <span>New Thought</span>
          </button>

          {/* User Profile Menu or Sign In */}
          {profile ? (
            <UserMenu />
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-ink-primary neo-border-sm hover:bg-paper-200 neo-shadow-xs transition-all"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <LogIn size={13} strokeWidth={2.4} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-paper-200 neo-border-sm text-ink-primary"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[58px] bg-black/40 z-40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="bg-paper-50 border-b-2 border-ink p-4 space-y-2 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${
                    pathname === href
                      ? "bg-pastel-amber-solid text-ink-primary neo-border-sm neo-shadow-xs"
                      : "bg-paper-100 text-ink-secondary neo-border-sm"
                  }`}
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  <Icon size={14} strokeWidth={2.4} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowModal(true);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-pastel-amber-solid text-ink-primary neo-btn flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <PenLine size={14} strokeWidth={2.4} />
              <span>Draft New Thought</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewBlogModal open={showModal} onClose={() => setShowModal(false)} />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}