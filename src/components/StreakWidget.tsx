"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useBlogStore } from "@/store/useBlogStore";
import { Flame, Target, TrendingUp, Calendar, X, Quote } from "lucide-react";

// The motivational quotes that will cycle as the user's streak changes
const MOTIVATION = [
  "A writer writes. Always. Keep the momentum going.",
  "You can't edit a blank page. Get the words out.",
  "The art of writing is the art of discovering what you believe.",
  "Consistency beats intensity. Show up every day.",
  "Your future self will thank you for the words you write today.",
  "Start writing. The inspiration will follow."
];

function GitHubCalendar({ days }: { days: string[] }) {
  const daySet = new Set(days);
  
  // Build the GitHub-style calendar array
  const weeks = useMemo(() => {
    const finalCells = [];
    const tempCells = [];
    const TOTAL_DAYS = 90; // Last 90 days (~3 months)

    // Generate the last 90 days based on UTC strings to match local storage
    for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().slice(0, 10);
      tempCells.push({ 
        date: dateStr, 
        hasData: daySet.has(dateStr), 
        isToday: i === 0 
      });
    }

    // Pad the beginning so the grid aligns correctly with Sunday (0)
    const firstDateObj = new Date(Date.now() - (TOTAL_DAYS - 1) * 86400000);
    const emptyCellsCount = firstDateObj.getDay(); 
    for (let i = 0; i < emptyCellsCount; i++) {
      finalCells.push(null);
    }
    
    finalCells.push(...tempCells);

    // Group into columns (weeks) of 7 days (Sun - Sat)
    const weeksArr = [];
    for (let i = 0; i < finalCells.length; i += 7) {
      weeksArr.push(finalCells.slice(i, i + 7));
    }
    return weeksArr;
  }, [days]);

  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((cell, ci) => {
            if (!cell) return <div key={`empty-${ci}`} className="w-3.5 h-3.5" />; // Empty padding
            return (
              <div
                key={cell.date}
                title={`${cell.date}${cell.hasData ? " (Wrote)" : ""}`}
                className="w-3.5 h-3.5 rounded-[3px] transition-all duration-300"
                style={{
                  background: cell.hasData ? "#6bcb77" : "rgba(255,255,255,0.04)", // GitHub Green
                  border: cell.isToday 
                    ? `1px solid ${cell.hasData ? "#4ade80" : "rgba(255,255,255,0.3)"}` 
                    : "1px solid transparent",
                  opacity: cell.hasData ? (cell.isToday ? 1 : 0.8) : 1,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function StreakWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const streak = useBlogStore((s) => s.streak);

  // We need to wait until mounted to use React Portals safely in Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  const DAILY_GOAL = 200;
  const progress = Math.min((streak.todayWords / DAILY_GOAL) * 100, 100);
  const isOnFire = streak.currentStreak >= 3;
  
  // Pick a dynamic quote based on their streak number
  const quote = MOTIVATION[streak.currentStreak % MOTIVATION.length];

  return (
    <>
      {/* Nav trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:brightness-110 flex-shrink-0"
        style={{
          background: isOnFire ? "rgba(248,113,113,0.1)" : "rgba(255,255,255,0.04)",
          border: isOnFire ? "1px solid rgba(248,113,113,0.25)" : "1px solid rgba(255,255,255,0.08)",
          color: isOnFire ? "#f87171" : "#6b6880",
        }}
        title="Writing Streak"
      >
        <Flame size={13} style={{ color: isOnFire ? "#f87171" : "#5e5a55" }} />
        <span style={{ fontFamily: "var(--font-jetbrains)" }}>{streak.currentStreak}</span>
      </button>

      {/* Modal Popup - Teleported to document.body via Portal to escape Navbar CSS restrictions */}
      {mounted && open && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-slide-up"
            style={{ background: "#0d0d12", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between border-b"
              style={{
                borderColor: "rgba(255,255,255,0.07)",
                background: isOnFire ? "rgba(248,113,113,0.06)" : "rgba(232,160,69,0.04)",
              }}
            >
              <div className="flex items-center gap-2">
                <Flame size={20} className={isOnFire ? "animate-pulse" : ""} style={{ color: isOnFire ? "#f87171" : "#e8a045" }} />
                <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 22, color: "#f4f1eb", fontWeight: 600 }}>
                  Writer's Streak
                </h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-ink-muted hover:text-ink-primary p-1">
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              
              {/* Motivational Quote Section */}
              <div className="mb-6 p-4 rounded-xl flex gap-3 items-start" style={{ background: "rgba(157,124,255,0.05)", border: "1px solid rgba(157,124,255,0.15)" }}>
                <Quote size={18} className="mt-0.5 flex-shrink-0" style={{ color: "#9d7cff" }} />
                <p className="text-sm italic leading-relaxed" style={{ color: "#b89dff", fontFamily: "var(--font-cormorant)", fontSize: 17 }}>
                  "{quote}"
                </p>
              </div>

              {/* Big streak number & Stats Grid */}
              <div className="flex items-center gap-6 mb-8">
                <div className="text-center flex-shrink-0">
                  <div
                    className="text-7xl font-bold mb-1 leading-none"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      color: isOnFire ? "#f87171" : "#e8a045",
                      textShadow: isOnFire ? "0 0 30px rgba(248,113,113,0.3)" : "0 0 30px rgba(232,160,69,0.3)",
                    }}
                  >
                    {streak.currentStreak}
                  </div>
                  <div className="text-xs text-ink-muted uppercase tracking-widest mt-2" style={{ fontFamily: "var(--font-jetbrains)" }}>
                    {streak.currentStreak === 1 ? "Day" : "Days"} {isOnFire ? "🔥" : "✦"}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3">
                  {[
                    { label: "Best", value: streak.longestStreak + "d", icon: TrendingUp, color: "#e8a045" },
                    { label: "Today", value: streak.todayWords + "w", icon: Target, color: "#6bcb77" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex items-center gap-1.5 mb-1.5 text-xs text-ink-muted">
                        <Icon size={12} style={{ color }} /> {label}
                      </div>
                      <div className="text-lg font-semibold" style={{ color, fontFamily: "var(--font-jetbrains)" }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Heatmap Calendar */}
              <div>
                <div className="flex items-center justify-between mb-3 text-xs text-ink-muted">
                  <div className="flex items-center gap-1.5"><Calendar size={12} /> Contributions</div>
                  <span>Last 90 days</span>
                </div>
                
                {/* The Calendar */}
                <div className="p-4 rounded-xl mb-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <GitHubCalendar days={streak.writingDays} />
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-1.5 text-[10px] text-ink-muted">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded-[2px]" style={{ background: "rgba(255,255,255,0.04)" }} />
                  <div className="w-2.5 h-2.5 rounded-[2px]" style={{ background: "rgba(107,203,119,0.4)" }} />
                  <div className="w-2.5 h-2.5 rounded-[2px]" style={{ background: "rgba(107,203,119,0.7)" }} />
                  <div className="w-2.5 h-2.5 rounded-[2px]" style={{ background: "#6bcb77" }} />
                  <span>More</span>
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}