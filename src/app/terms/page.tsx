import Link from "next/link";
import Image from "next/image";
import { BookOpen, FileCheck, ArrowLeft, Feather, Award, ShieldAlert, Sparkles, Scale } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | BlogPotro",
  description: "BlogPotro Terms of Service and Author Agreement - You own your words.",
};

export default function TermsPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neo-border-sm bg-pastel-amber-solid text-ink-primary text-xs font-bold uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-jetbrains)" }}>
              <Scale size={14} strokeWidth={2.5} />
              <span>Author Terms</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-ink-primary tracking-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-2 font-medium" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Last Updated: August 2026 · Effective for all BlogPotro writers
            </p>
          </div>

          {/* Section 1: 100% Intellectual Property Ownership */}
          <div className="p-5 rounded-2xl bg-[#FEFCE8] neo-border neo-shadow-sm flex gap-4 items-start">
            <Award className="text-amber flex-shrink-0 mt-1" size={24} strokeWidth={2.4} />
            <div>
              <h3 className="text-base font-bold text-ink-primary mb-1" style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px" }}>
                1. 100% Author Ownership & Intellectual Property
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
                You retain complete and exclusive ownership, copyright, and intellectual property rights over every word, manuscript, essay, and title you create on BlogPotro. By publishing an essay publicly on BlogPotro, you grant us only a non-exclusive license to display, index, and distribute your work across the platform and constellation graph.
              </p>
            </div>
          </div>

          {/* Section 2: Code of Conduct & Literary Discourse */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
              2. Community Code of Conduct
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
              BlogPotro is designed as a sanctuary for deep, considerate, and reflective writing. To maintain this environment, you agree not to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-ink-secondary font-medium pl-2">
              <li>Publish content that promotes hate speech, harassment, defamation, or violence.</li>
              <li>Post automated spam, deceptive advertising, or malicious phishing links.</li>
              <li>Infringe upon the copyright or intellectual property of other writers.</li>
              <li>Abuse commentary or reflection features for harassment or brigading.</li>
            </ul>
          </div>

          {/* Section 3: Account Responsibility */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
              3. Account & Handle Registration
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
              You are responsible for maintaining the security of your authentication credentials. BlogPotro reserves the right to reclaim inactive or impersonating @handles to protect legitimate author pen names.
            </p>
          </div>

          {/* Section 4: Service Availability & Local-First Resilience */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
              4. Local-First Service Resilience
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
              Because BlogPotro operates as a local-first platform, your local drafts remain accessible offline in your browser even if network connectivity is interrupted. While we strive for 99.9% uptime on cloud features, we recommend periodically exporting local manuscript backups for archival safety.
            </p>
          </div>

          {/* Section 5: Changes to Terms */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
              5. Updates to Terms
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
              We may update these terms occasionally to reflect new platform features or legal requirements. Material changes will always be communicated with transparent revision notes.
            </p>
          </div>

          {/* Contact */}
          <div className="pt-6 border-t-2 border-dashed border-paper-300">
            <h2 className="text-xl font-bold text-ink-primary mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
              Legal Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary font-medium">
              Questions regarding these Terms & Conditions can be sent to{" "}
              <a href="mailto:legal@blogpotro.com" className="font-bold text-ink-primary underline hover:text-amber">
                legal@blogpotro.com
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
        <span>✦ BLOGPOTRO — THE EDITORIAL SOCIAL WRITING PLATFORM ✦</span>
      </footer>
    </div>
  );
}
