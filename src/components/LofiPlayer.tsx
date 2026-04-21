"use client";

import { useState, useRef, useEffect } from "react";
import { Music2, Play, Pause, SkipForward, Volume2, VolumeX, ChevronDown, ChevronUp, Radio } from "lucide-react";

const STATIONS = [
  {
    id: "lofi-chill",
    name: "Lofi Chill Beats",
    mood: "Focus",
    emoji: "☕",
    color: "#e8a045",
    // YouTube embed URLs for lofi streams (publicly available)
    youtubeId: "jfKfPfyJRdk",
  },
  {
    id: "jazzy",
    name: "Jazzy Cafe Vibes",
    mood: "Creative",
    emoji: "🎷",
    color: "#9d7cff",
    youtubeId: "kgx4WGK0oNU",
  },
  {
    id: "rainy",
    name: "Rain + Lofi",
    mood: "Deep Work",
    emoji: "🌧",
    color: "#6bcb77",
    youtubeId: "mPZkdNFkNps",
  },
  {
    id: "study",
    name: "Study Session",
    mood: "Productive",
    emoji: "📚",
    color: "#f87171",
    youtubeId: "5qap5aO4i9A",
  },
];

export default function LofiPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentStation, setCurrentStation] = useState(0);
  const [volume, setVolume] = useState(60);
  const [showStations, setShowStations] = useState(false);
  const [tick, setTick] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Timer for session duration
  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const station = STATIONS[currentStation];

  const nextStation = () => {
    setCurrentStation((c) => (c + 1) % STATIONS.length);
    setElapsed(0);
    setTick((t) => t + 1);
  };

  const selectStation = (i: number) => {
    setCurrentStation(i);
    setElapsed(0);
    setTick((t) => t + 1);
    setShowStations(false);
    if (!playing) setPlaying(true);
  };

  // Waveform bars animation
  const bars = [3, 6, 4, 7, 5, 8, 4, 6, 3, 7, 5, 4];

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
          style={{
            background: playing ? `linear-gradient(135deg, ${station.color}cc, ${station.color}88)` : "rgba(20,20,26,0.95)",
            border: `1px solid ${playing ? station.color + "60" : "rgba(255,255,255,0.12)"}`,
            boxShadow: playing ? `0 0 20px ${station.color}40` : "0 4px 20px rgba(0,0,0,0.5)",
          }}
          title="Lofi Player"
        >
          <Music2 size={18} style={{ color: playing ? "#fff" : "#6b6880" }} />
        </button>
      )}

      {/* Player panel */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-40 w-72 rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "#0d0d12", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 60px rgba(0,0,0,0.7)" }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ background: `linear-gradient(135deg, ${station.color}22, transparent)`, borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-2">
              <Radio size={13} style={{ color: station.color }} />
              <span className="text-xs font-medium text-ink-primary" style={{ fontFamily: "var(--font-jakarta)" }}>
                Lofi Station
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
                {fmt(elapsed)}
              </span>
              <button onClick={() => setOpen(false)} className="text-ink-muted hover:text-ink-primary transition-colors">
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {/* Now playing */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-3">
              {/* Album art placeholder */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{
                  background: `${station.color}18`,
                  border: `1px solid ${station.color}30`,
                }}
              >
                {station.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-primary truncate" style={{ fontFamily: "var(--font-jakarta)" }}>
                  {station.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: station.color }}>
                  {station.mood} mode
                </p>
              </div>
            </div>

            {/* Waveform visualizer */}
            <div className="flex items-end gap-0.5 h-8 mt-3 mb-2">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all"
                  style={{
                    height: playing ? `${h * (0.5 + 0.5 * Math.abs(Math.sin((Date.now() / 300) + i)))}px` : "3px",
                    background: playing ? station.color : "rgba(255,255,255,0.1)",
                    opacity: playing ? 0.7 + 0.3 * (i % 3) / 2 : 1,
                    animation: playing ? `pulseSoft ${0.4 + i * 0.07}s ease-in-out infinite alternate` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={() => setMuted((m) => !m)} className="text-ink-muted hover:text-ink-primary transition-colors">
                  {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(+e.target.value); setMuted(false); }}
                  className="w-16 h-1 rounded-full accent-amber appearance-none cursor-pointer"
                  style={{ accentColor: station.color }}
                />
              </div>

              {/* Play / Skip */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setPlaying((p) => !p); if (!playing) setTick((t) => t + 1); }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
                  style={{ background: station.color, color: "#07070a" }}
                >
                  {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" style={{ marginLeft: 1 }} />}
                </button>
                <button
                  onClick={nextStation}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#6b6880" }}
                >
                  <SkipForward size={14} />
                </button>
              </div>
            </div>

            {/* Station list toggle */}
            <button
              onClick={() => setShowStations((s) => !s)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all hover:brightness-110"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#6b6880" }}
            >
              <span>Change station</span>
              {showStations ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {showStations && (
              <div className="mt-2 space-y-1">
                {STATIONS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => selectStation(i)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all hover:brightness-110 text-left"
                    style={{
                      background: i === currentStation ? `${s.color}18` : "rgba(255,255,255,0.03)",
                      border: i === currentStation ? `1px solid ${s.color}35` : "1px solid rgba(255,255,255,0.06)",
                      color: i === currentStation ? s.color : "#a09a8e",
                    }}
                  >
                    <span>{s.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-[10px] opacity-60">{s.mood}</div>
                    </div>
                    {i === currentStation && playing && (
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Embedded YouTube iframe (hidden — audio only) */}
          {playing && (
            <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
              <iframe
                key={`${station.youtubeId}-${tick}`}
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${station.youtubeId}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${station.youtubeId}&controls=0&enablejsapi=1`}
                allow="autoplay"
                title="lofi"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
