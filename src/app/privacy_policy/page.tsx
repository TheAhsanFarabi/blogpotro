import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Lock, ArrowLeft, Feather, HardDrive, Globe, EyeOff, UserCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | BlogPotro",
  description: "BlogPotro Privacy Policy - Private by default, public by choice.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-paper-100 paper-grid flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-4 flex items-center justify-between border-b-2 border-ink bg-paper-50/90 backdrop-blur-sm sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 relative flex items-center justify-center bg-pastel-cream-solid rounded-xl neo-border-sm neo-shadow-xs group-hover:rotate-3 transition-transform">
            <Image src="/logo.png" alt="Logo" fill className="object-contain p-1.5" priority />
          </div>
          <span className="font-bold text-2xl text-ink-primary tracking-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
            blogpotro
          </span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-ink-primary bg-paper-100 neo-border-sm hover:bg-pastel-amber-solid transition-colors"
          style={{ fontFamily: "var(--font-jetbrains)" }}
        >
          <ArrowLeft size={13} strokeWidth={2.4} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-paper-50 rounded-3xl neo-border neo-shadow-xl p-6 sm:p-12 space-y-8">
          
          {/* Header Block */}
          <div className="border-b-2 border-ink pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neo-border-sm bg-pastel-mint-solid text-ink-primary text-xs font-bold uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-jetbrains)" }}>
              <ShieldCheck size={14} strokeWidth={2.5} />
              <span>Privacy Philosophy</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-ink-primary tracking-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-2 font-medium" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Last Updated: August 2026 · Effective Immediately
            </p>
          </div>

          {/* Core Principle Callout */}
          <div className="p-5 rounded-2xl bg-[#FEFCE8] neo-border neo-shadow-sm flex gap-4 items-start">
            <Lock className="text-amber flex-shrink-0 mt-1" size={24} strokeWidth={2.4} />
            <div>
              <h3 className="text-base font-bold text-ink-primary mb-1" style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px" }}>
                Our Fundamental Promise: Private by Default, Public by Choice
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
                BlogPotro was architected from day one as a local-first writing sanctuary. Your unfinished thoughts, unpublished drafts, version histories, and revision notes remain strictly on your local device unless you explicitly hit <strong>"Publish Essay"</strong>.
              </p>
            </div>
          </div>

          {/* Section 1: Information We Collect */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
              1. Information We Collect & Store
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-paper-100 neo-border-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  <HardDrive size={16} className="text-emerald-700" />
                  <span>On Your Local Device Only</span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed font-medium">
                  Draft manuscripts, local autosaves, revision timeline snapshots, writing streak timestamps, and editor UI preferences are stored in your browser’s local storage. We have zero access to your unminted drafts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-paper-100 neo-border-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  <Globe size={16} className="text-violet" />
                  <span>On Our Cloud (Supabase)</span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed font-medium">
                  When you sign in and choose to publish, we store your public profile (pen name, @username, avatar, bio), published essays, comments, likes, and followers.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Google Authentication */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
              2. Third-Party Authentication (Google OAuth)
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
              When you authenticate using Google OAuth, Google provides us with your verified email address, full name, and avatar image URL. We use this information exclusively to create and identify your author account. We do not request, read, or store your contacts, Google Drive files, or any external Google data.
            </p>
          </div>

          {/* Section 3: No Tracking & No Ad Profiling */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
              3. No Advertising & No Third-Party Tracking
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
              BlogPotro does not employ third-party behavioral advertising pixels, surveillance analytics, or data brokers. We do not sell, rent, or monetize your personal writing, reading habits, or identity to advertisers.
            </p>
          </div>

          {/* Section 4: Data Sovereignty & Deletion */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
              4. Your Data Sovereignty & Deletion Rights
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
              You own 100% of your thoughts and words:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-ink-secondary font-medium pl-2">
              <li>You can export or clear your local drafts at any time directly in your Studio settings.</li>
              <li>You can edit, unlist, or delete your published essays at any time from your author profile.</li>
              <li>You can request a full account deletion and complete erasure of your cloud data by contacting our team.</li>
            </ul>
          </div>

          {/* Section 5: Contact */}
          <div className="pt-6 border-t-2 border-dashed border-paper-300">
            <h2 className="text-xl font-bold text-ink-primary mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
              Contact & Privacy Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary font-medium">
              If you have any questions regarding this Privacy Policy or your data rights, reach out to us at{" "}
              <a href="mailto:privacy@blogpotro.com" className="font-bold text-ink-primary underline hover:text-amber">
                privacy@blogpotro.com
              </a>.
            </p>
          </div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 border-t-2 border-ink bg-paper-50 text-center text-xs font-bold text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
        <div className="flex justify-center gap-6 mb-2">
          <Link href="/privacy_policy" className="hover:text-ink-primary underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-ink-primary underline">Terms & Conditions</Link>
          <Link href="/" className="hover:text-ink-primary underline">Home</Link>
        </div>
        <span>✦ BLOGPOTRO — PRIVATE BY DEFAULT. PUBLIC BY CHOICE. ✦</span>
      </footer>
    </div>
  );
}
