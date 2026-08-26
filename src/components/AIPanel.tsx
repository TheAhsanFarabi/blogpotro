"use client";

import { useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { Sparkles, Eye, EyeOff, AlertCircle, CheckCircle2, TrendingUp, Lightbulb } from "lucide-react";

function ScoreBar({ label, value, solidColor, lightBg }: { label: string; value: number; solidColor: string; lightBg: string }) {
  const getLevel = (v: number) => v >= 75 ? "Strong" : v >= 50 ? "Developing" : "Needs Polish";
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5" style={{ fontFamily: "var(--font-jetbrains)" }}>
        <span className="text-xs font-bold text-ink-primary">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-ink-muted">{getLevel(value)}</span>
          <span className="text-xs font-bold px-1.5 py-0.2 rounded neo-border-sm bg-paper-50 text-ink-primary">
            {value}/100
          </span>
        </div>
      </div>
      <div className="h-3 w-full rounded-full neo-border-sm bg-paper-200 overflow-hidden p-[1px]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: solidColor }}
        />
      </div>
    </div>
  );
}

export default function AIPanel() {
  const blog = useBlogStore((s) => s.currentBlog());
  const geminiKey = useBlogStore((s) => s.geminiKey);
  const setGeminiKey = useBlogStore((s) => s.setGeminiKey);
  const setScores = useBlogStore((s) => s.setScores);
  const currentId = useBlogStore((s) => s.currentId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(geminiKey);

  const saveKey = () => setGeminiKey(localKey);

  const analyze = async () => {
    if (!currentId || !blog) return;
    const key = localKey || geminiKey;
    if (!key) { setError("Please enter your Gemini API key"); return; }
    const content = blog.content.replace(/<[^>]+>/g, " ").trim();
    if (!content) { setError("Write some thoughts before running analysis!"); return; }

    setLoading(true);
    setError("");
    setGeminiKey(key);

    const prompt = `You are a world-class literary editor analyzing an essay or article draft. Respond ONLY with valid JSON, no markdown or backticks.

Analyze this blog draft and return:
{
  "human": <0-100 score for emotional depth, distinct authorial voice, originality>,
  "clarity": <0-100 score for readability, transitions, sentence rhythm>,
  "accuracy": <0-100 score for logical coherence, factual grounding, credibility>,
  "suggestions": [<exactly 3 short, punchy editorial suggestions for improvement>]
}

Blog Title: "${blog.title}"
Blog Content: "${content.slice(0, 3000)}"`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.candidates[0].content.parts[0].text;
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setScores(
        currentId,
        { human: parsed.human, clarity: parsed.clarity, accuracy: parsed.accuracy },
        parsed.suggestions || []
      );
    } catch (e: any) {
      setError(e.message || "Analysis failed. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  if (!blog) {
    return <div className="p-4 text-center text-ink-muted text-xs" style={{ fontFamily: "var(--font-jetbrains)" }}>Select a thought to analyze</div>;
  }

  const totalScore = blog.scores ? Math.round((blog.scores.human + blog.scores.clarity + blog.scores.accuracy) / 3) : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-paper-100">
      {/* API Key Box */}
      <div className="p-4 border-b-2 border-ink bg-paper-50">
        <label className="block text-xs font-bold text-ink-primary mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
          Gemini API Key
        </label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            onBlur={saveKey}
            placeholder="AIza..."
            className="w-full rounded-xl px-3 pr-9 py-2 text-xs font-medium text-ink-primary placeholder:text-ink-muted bg-paper-100 neo-border outline-none focus:bg-white transition-all"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          />
          <button
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary"
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <p className="text-[10px] text-ink-muted mt-1.5" style={{ fontFamily: "var(--font-jetbrains)" }}>
          Free key at{" "}
          <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline font-bold text-ink-primary">
            aistudio.google.com
          </a>
        </p>
      </div>

      {/* Analyze Button */}
      <div className="p-4">
        <button
          onClick={analyze}
          disabled={loading}
          className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            loading 
              ? "bg-paper-200 text-ink-muted cursor-not-allowed border border-paper-300" 
              : "bg-pastel-violet-solid text-ink-primary neo-btn-sm"
          }`}
          style={{ fontFamily: "var(--font-jetbrains)" }}
        >
          <Sparkles size={14} strokeWidth={2.4} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Analyzing Prose..." : "Evaluate with Gemini"}</span>
        </button>

        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 rounded-xl text-xs bg-pastel-rose-light neo-border-sm text-ink-primary">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-rose" strokeWidth={2.4} />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Scores Dashboard */}
      {blog.scores && (
        <div className="px-4 pb-6 animate-fade-in">
          {/* Overall BlogScore Stamp */}
          <div
            className="rounded-2xl p-5 mb-5 text-center bg-[#FEFCE8] neo-border neo-shadow-sm relative overflow-hidden"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Editorial BlogScore™
            </div>
            <div
              className="text-5xl font-bold tracking-tight text-ink-primary my-1"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {totalScore}
              <span className="text-xl text-ink-muted font-normal">/100</span>
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full neo-border-sm bg-pastel-amber-solid text-[10px] font-bold text-ink-primary mt-1" style={{ fontFamily: "var(--font-jetbrains)" }}>
              {(totalScore ?? 0) >= 80 ? "✦ Published Grade" : (totalScore ?? 0) >= 60 ? "✦ Promising Draft" : "✦ Raw Scaffold"}
            </div>
          </div>

          <ScoreBar label="Authorial Human Voice" value={blog.scores.human} solidColor="#10B981" lightBg="bg-pastel-mint-solid" />
          <ScoreBar label="Clarity & Structure" value={blog.scores.clarity} solidColor="#F59E0B" lightBg="bg-pastel-amber-solid" />
          <ScoreBar label="Coherence & Accuracy" value={blog.scores.accuracy} solidColor="#8B5CF6" lightBg="bg-pastel-violet-solid" />

          {/* Editorial Suggestions */}
          {blog.suggestions.length > 0 && (
            <div className="mt-5">
              <div className="text-xs font-bold text-ink-primary mb-2.5 uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: "var(--font-jetbrains)" }}>
                <Lightbulb size={13} className="text-amber" strokeWidth={2.4} />
                <span>Editor's Notes</span>
              </div>
              <div className="space-y-2.5">
                {blog.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="flex gap-2.5 p-3.5 rounded-xl text-xs leading-relaxed bg-paper-50 neo-border-sm neo-shadow-xs"
                  >
                    <span className="w-5 h-5 rounded-md neo-border-sm bg-pastel-amber-solid flex items-center justify-center text-[10px] font-black flex-shrink-0 text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                      {i + 1}
                    </span>
                    <span className="text-ink-secondary font-medium leading-normal">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

