"use client";

import { useState, useRef, useEffect } from "react";
import { Music2, Play, Pause, SkipForward, Volume2, VolumeX, ChevronDown, ChevronUp, Radio, Disc } from "lucide-react";

const STATIONS = [
  {
    id: "lofi-chill",
    name: "Lofi Chill Beats",
    mood: "Focus Writing",
    emoji: "☕",
    color: "#F59E0B",
    bg: "bg-pastel-amber-solid",
    youtubeId: "jfKfPfyJRdk",
  },
  {
    id: "jazzy",
    name: "Jazzy Cafe Vibes",
    mood: "Creative Prose",
    emoji: "🎷",
    color: "#8B5CF6",
    bg: "bg-pastel-violet-solid",
    youtubeId: "kgx4WGK0oNU",
  },
  {
    id: "rainy",
    name: "Rain + Manuscript",
    mood: "Deep Solitude",
    emoji: "🌧",
    color: "#10B981",
    bg: "bg-pastel-mint-solid",
    youtubeId: "mPZkdNFkNps",
  },
  {
    id: "study",
    name: "Library Study",
    mood: "Archival Flow",
    emoji: "📚",
    color: "#F43F5E",
    bg: "bg-pastel-rose-solid",
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

  const bars = [4, 8, 5, 10, 6, 12, 6, 9, 4, 11, 7, 5];

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`fixed bottom-6 right-6 z-40 w-13 h-13 rounded-2xl flex items-center justify-center neo-btn transition-all ${
            playing ? `${station.bg} text-ink-primary animate-pulse` : "bg-paper-50 text-ink-primary hover:bg-paper-200"
          }`}
          title="Lofi Radio Player"
        >
          <Radio size={20} strokeWidth={2.4} />
        </button>
      )}

      {/* Player panel */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-40 w-80 rounded-2xl overflow-hidden bg-paper-50 neo-border neo-shadow-xl animate-slide-up"
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between border-b-2 border-ink bg-paper-200"
          >
            <div className="flex items-center gap-2">
              <Disc size={15} strokeWidth={2.4} className={playing ? "animate-spin text-ink-primary" : "text-ink-muted"} />
              <span className="text-xs font-bold text-ink-primary uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Editorial Radio
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded neo-border-sm bg-paper-50 text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                {fmt(elapsed)}
              </span>
              <button 
                onClick={() => setOpen(false)} 
                className="p-1 rounded-md bg-paper-50 neo-border-sm text-ink-secondary hover:text-ink-primary"
              >
                <ChevronDown size={14} strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {/* Now playing */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-3 p-3 rounded-xl neo-border-sm bg-paper-100 neo-shadow-xs">
              <div
                className="w-12 h-12 rounded-lg neo-border-sm flex items-center justify-center flex-shrink-0 text-2xl bg-paper-50 shadow-inner"
              >
                {station.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink-primary truncate" style={{ fontFamily: "var(--font-cormorant)", fontSize: 18 }}>
                  {station.name}
                </p>
                <p className="text-xs font-bold text-ink-muted mt-0.5 flex items-center gap-1" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: station.color }} />
                  {station.mood}
                </p>
              </div>
            </div>

            {/* Waveform visualizer */}
            <div className="flex items-end gap-1 h-8 mt-3 mb-2 px-1">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all"
                  style={{
                    height: playing ? `${h * (0.4 + 0.6 * Math.abs(Math.sin((Date.now() / 250) + i)))}px` : "3px",
                    background: playing ? "#18181B" : "#D6CEBD",
                    opacity: playing ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-3 pt-1">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={() => setMuted((m) => !m)} className="p-1 text-ink-secondary hover:text-ink-primary">
                  {muted ? <VolumeX size={15} strokeWidth={2.4} /> : <Volume2 size={15} strokeWidth={2.4} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(+e.target.value); setMuted(false); }}
                  className="w-16 h-1.5 rounded-full bg-paper-300 accent-ink appearance-none cursor-pointer"
                />
              </div>

              {/* Play / Skip */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setPlaying((p) => !p); if (!playing) setTick((t) => t + 1); }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center neo-btn-sm ${station.bg} text-ink-primary`}
                >
                  {playing ? <Pause size={15} strokeWidth={2.8} /> : <Play size={15} strokeWidth={2.8} style={{ marginLeft: 1 }} />}
                </button>
                <button
                  onClick={nextStation}
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-paper-200 neo-border-sm text-ink-primary hover:bg-paper-300 neo-shadow-xs"
                >
                  <SkipForward size={14} strokeWidth={2.4} />
                </button>
              </div>
            </div>

            {/* Station list toggle */}
            <button
              onClick={() => setShowStations((s) => !s)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-ink-primary bg-paper-200 neo-border-sm hover:bg-paper-300 transition-all"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <span>Select Radio Station</span>
              {showStations ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showStations && (
              <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
                {STATIONS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => selectStation(i)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                      i === currentStation
                        ? `${s.bg} text-ink-primary neo-border-sm neo-shadow-xs`
                        : "bg-paper-100 hover:bg-paper-200 text-ink-secondary border border-paper-300"
                    }`}
                  >
                    <span>{s.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{s.name}</div>
                      <div className="text-[10px] opacity-70" style={{ fontFamily: "var(--font-jetbrains)" }}>{s.mood}</div>
                    </div>
                    {i === currentStation && playing && (
                      <div className="w-2 h-2 rounded-full bg-ink animate-ping" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Embedded YouTube iframe (audio only) */}
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

