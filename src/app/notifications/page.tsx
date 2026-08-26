"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import { NotificationItem } from "@/types/database";
import { notificationService } from "@/lib/services/notificationService";
import { useAuth } from "@/context/AuthContext";
import { Bell, Heart, MessageSquare, UserPlus, Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (profile) {
      notificationService.getNotifications(profile.id).then((data) => {
        setNotifications(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [profile]);

  const handleMarkAllRead = async () => {
    if (!profile) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await notificationService.markAllAsRead(profile.id);
  };

  const handleMarkOneRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    await notificationService.markAsRead(id);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pastel-rose-solid neo-border-sm flex items-center justify-center text-ink-primary">
              <Bell size={16} strokeWidth={2.4} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
              Notifications
            </h1>
          </div>

          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 rounded-lg bg-paper-50 neo-border-sm hover:bg-paper-200 text-xs font-bold text-ink-primary neo-shadow-xs flex items-center gap-1.5 transition-all"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Check size={13} strokeWidth={2.4} />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {!profile ? (
          <div className="p-8 text-center bg-paper-50 rounded-2xl neo-border neo-shadow-sm">
            <Bell size={36} className="mx-auto mb-3 opacity-40 text-ink-primary" />
            <h3 className="text-xl font-bold text-ink-primary mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
              Sign In to View Activity
            </h3>
            <p className="text-xs text-ink-secondary mb-4 font-medium">
              See who followed your writer profile, liked your essays, or contributed reflections.
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="px-4 py-2 rounded-xl bg-pastel-amber-solid text-xs font-bold text-ink-primary neo-btn inline-flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Sparkles size={13} strokeWidth={2.4} />
              <span>Sign in with Google</span>
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-xs text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
            Loading activity…
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center bg-paper-50 rounded-2xl neo-border text-ink-muted">
            <Bell size={32} className="mx-auto mb-2 opacity-30" />
            <h3 className="text-xl font-bold text-ink-primary mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
              No Notifications Yet
            </h3>
            <p className="text-xs font-medium">When writers interact with your published manuscripts, activity will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const actor = n.actor;
              const post = n.post;

              return (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkOneRead(n.id)}
                  className={`p-4 rounded-2xl neo-border-sm transition-all flex items-start gap-3.5 ${
                    n.is_read
                      ? "bg-paper-50 neo-shadow-xs"
                      : "bg-[#FEFCE8] neo-shadow border-l-4 border-l-amber"
                  }`}
                >
                  {/* Actor Avatar */}
                  <Link href={`/@${actor?.username || "writer"}`} className="flex-shrink-0">
                    {actor?.avatar_url ? (
                      <img src={actor.avatar_url} alt="" className="w-10 h-10 rounded-full neo-border-sm object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-sm font-bold text-ink-primary">
                        {actor?.display_name?.charAt(0) || "W"}
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-ink-primary leading-relaxed">
                      <Link href={`/@${actor?.username || "writer"}`} className="font-bold hover:underline">
                        {actor?.display_name || "A writer"}
                      </Link>{" "}
                      {n.type === "follow" && (
                        <span>started following your writer profile.</span>
                      )}
                      {n.type === "like" && (
                        <span>
                          liked your manuscript{" "}
                          <Link href={`/p/${post?.slug}`} className="font-bold underline">
                            "{post?.title || "your essay"}"
                          </Link>
                        </span>
                      )}
                      {n.type === "comment" && (
                        <span>
                          reflected on your essay{" "}
                          <Link href={`/p/${post?.slug}#comments`} className="font-bold underline">
                            "{post?.title || "your essay"}"
                          </Link>
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-ink-muted font-bold mt-1" style={{ fontFamily: "var(--font-jetbrains)" }}>
                      {formatDate(n.created_at)}
                    </div>
                  </div>

                  {/* Icon Indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    {n.type === "follow" && (
                      <div className="w-7 h-7 rounded-lg bg-pastel-mint-solid neo-border-sm flex items-center justify-center text-emerald-800">
                        <UserPlus size={13} strokeWidth={2.5} />
                      </div>
                    )}
                    {n.type === "like" && (
                      <div className="w-7 h-7 rounded-lg bg-pastel-rose-solid neo-border-sm flex items-center justify-center text-rose">
                        <Heart size={13} strokeWidth={2.5} className="fill-rose" />
                      </div>
                    )}
                    {n.type === "comment" && (
                      <div className="w-7 h-7 rounded-lg bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-amber">
                        <MessageSquare size={13} strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
