"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useBlogStore } from "@/store/useBlogStore";
import { Flame, Target, TrendingUp, Calendar, X, Quote } from "lucide-react";

// Motivational quotes cycling through writing sessions
const MOTIVATION = [
  "A writer writes. Always. Keep the momentum alive.",
  "You can't edit a blank page. Let the raw words tumble out.",
  "The art of writing is the art of discovering what you truly believe.",
  "Consistency beats intensity. Show up at the desk every single day.",
  "Your future self will thank you for the prose you crafted today.",
  "Begin the paragraph. The muse will join you halfway."
];

function GitHubCalendar({ days }: { days: string[] }) {
  const daySet = new Set(days);
  
  const weeks = useMemo(() => {
    const finalCells = [];
    const tempCells = [];
    const TOTAL_DAYS = 90;

    for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().slice(0, 10);
      tempCells.push({ 
        date: dateStr, 
        hasData: daySet.has(dateStr), 
        isToday: i === 0 
      });
    }

    const firstDateObj = new Date(Date.now() - (TOTAL_DAYS - 1) * 86400000);
    const emptyCellsCount = firstDateObj.getDay(); 
    for (let i = 0; i < emptyCellsCount; i++) {
      finalCells.push(null);
    }
    
    finalCells.push(...tempCells);

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
            if (!cell) return <div key={`empty-${ci}`} className="w-3.5 h-3.5" />;
            return (
              <div
                key={cell.date}
                title={`${cell.date}${cell.hasData ? " (Manuscript written)" : ""}`}
                className="w-3.5 h-3.5 rounded-[3px] transition-all duration-150"
                style={{
                  background: cell.hasData ? "#10B981" : "#EAE3D5",
                  border: cell.isToday 
                    ? "1.5px solid #18181B" 
                    : cell.hasData ? "1px solid #065F46" : "1px solid #DBD2C0",
                  transform: cell.isToday ? "scale(1.1)" : "none",
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOnFire = streak.currentStreak >= 3;
  const quote = MOTIVATION[streak.currentStreak % MOTIVATION.length];

  return (
    <>
      {/* Nav trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
          isOnFire
            ? "bg-pastel-rose-solid text-ink-primary neo-border-sm neo-shadow-xs"
            : "bg-paper-200 text-ink-primary neo-border-sm hover:bg-paper-300 neo-shadow-xs"
        }`}
        style={{ fontFamily: "var(--font-jetbrains)" }}
        title="Writing Streak Tracker"
      >
        <Flame size={14} strokeWidth={2.4} className={isOnFire ? "text-rose animate-bounce" : "text-amber"} />
        <span>{streak.currentStreak}d</span>
      </button>

      {/* Modal Popup */}
      {mounted && open && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(24, 24, 27, 0.65)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden bg-paper-50 neo-border neo-shadow-xl animate-slide-up"
          >
            {/* Header */}
            <div
              className={`px-6 py-4 flex items-center justify-between border-b-2 border-ink ${
                isOnFire ? "bg-pastel-rose-light" : "bg-pastel-amber-light"
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame size={20} strokeWidth={2.5} className={isOnFire ? "text-rose" : "text-amber"} />
                <h3 className="font-bold text-2xl text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Writer's Daily Streak
                </h3>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="p-1 rounded-lg bg-paper-50 neo-border-sm text-ink-secondary hover:text-ink-primary neo-shadow-xs"
              >
                <X size={16} strokeWidth={2.4} />
              </button>
            </div>

            <div className="p-6">
              
              {/* Motivational Quote Box */}
              <div className="mb-6 p-4 rounded-xl neo-border-sm bg-[#FEFCE8] flex gap-3 items-start neo-shadow-xs">
                <Quote size={18} className="mt-0.5 flex-shrink-0 text-amber" strokeWidth={2.4} />
                <p className="text-sm italic leading-relaxed text-ink-primary" style={{ fontFamily: "var(--font-cormorant)", fontSize: 18 }}>
                  "{quote}"
                </p>
              </div>

              {/* Big streak number & Stats Grid */}
              <div className="flex items-center gap-6 mb-7">
                <div className="text-center flex-shrink-0 p-4 bg-paper-100 rounded-2xl neo-border neo-shadow-sm min-w-[120px]">
                  <div
                    className="text-6xl font-bold leading-none text-ink-primary"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {streak.currentStreak}
                  </div>
                  <div className="text-xs font-bold text-ink-muted uppercase tracking-wider mt-2" style={{ fontFamily: "var(--font-jetbrains)" }}>
                    {streak.currentStreak === 1 ? "Day Active" : "Days Active"} {isOnFire ? "🔥" : "✦"}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 gap-2.5">
                  {[
                    { label: "Best Streak", value: streak.longestStreak + " days", icon: TrendingUp, bg: "bg-pastel-amber-light", badge: "bg-pastel-amber-solid" },
                    { label: "Today's Words", value: streak.todayWords + " words", icon: Target, bg: "bg-pastel-mint-light", badge: "bg-pastel-mint-solid" },
                  ].map(({ label, value, icon: Icon, bg, badge }) => (
                    <div key={label} className={`rounded-xl p-3 neo-border-sm ${bg} flex items-center justify-between`}>
                      <div className="flex items-center gap-2 text-xs font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                        <Icon size={14} strokeWidth={2.4} /> {label}
                      </div>
                      <div className={`text-xs font-black px-2 py-0.5 rounded neo-border-sm ${badge} text-ink-primary`} style={{ fontFamily: "var(--font-jetbrains)" }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Calendar */}
              <div>
                <div className="flex items-center justify-between mb-2.5 text-xs font-bold text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  <div className="flex items-center gap-1.5"><Calendar size={13} strokeWidth={2.2} /> Writing Activity</div>
                  <span>Last 90 days</span>
                </div>
                
                {/* The Calendar Grid */}
                <div className="p-4 rounded-xl neo-border-sm bg-paper-100 mb-3">
                  <GitHubCalendar days={streak.writingDays} />
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  <span>Rest</span>
                  <div className="w-3 h-3 rounded-[2px] bg-[#EAE3D5] border border-[#DBD2C0]" />
                  <div className="w-3 h-3 rounded-[2px] bg-[#6EE7B7] border border-[#059669]" />
                  <div className="w-3 h-3 rounded-[2px] bg-[#10B981] border border-[#047857]" />
                  <span>Written</span>
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