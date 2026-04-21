"use client";

import { useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { Sparkles, Eye, EyeOff, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  const getLevel = (v: number) => v >= 75 ? "Strong" : v >= 50 ? "Fair" : "Needs work";
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-ink-secondary">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-muted">{getLevel(value)}</span>
          <span className="text-sm font-semibold" style={{ color, fontFamily: "var(--font-jetbrains)" }}>
            {value}
          </span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
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
    if (!content) { setError("Write some content first!"); return; }

    setLoading(true);
    setError("");
    setGeminiKey(key);

    const prompt = `You are a writing coach analyzing a blog post. Respond ONLY with valid JSON, no markdown or backticks.

Analyze this blog and return:
{
  "human": <0-100 score for emotional depth, personal voice, originality>,
  "clarity": <0-100 score for readability, flow, structure>,
  "accuracy": <0-100 score for factual soundness and credibility>,
  "suggestions": [<exactly 3 short actionable improvement tips>]
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
    return <div className="p-4 text-center text-ink-muted text-sm">Select a blog to analyze</div>;
  }

  const totalScore = blog.scores ? Math.round((blog.scores.human + blog.scores.clarity + blog.scores.accuracy) / 3) : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* API Key */}
      <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <label className="block text-xs text-ink-muted mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
          Gemini API Key
        </label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            onBlur={saveKey}
            placeholder="AIza..."
            className="w-full rounded-xl px-3 pr-9 py-2.5 text-xs text-ink-secondary placeholder:text-ink-muted outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-jetbrains)" }}
          />
          <button
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary"
          >
            {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
        <p className="text-[10px] text-ink-muted mt-1.5">
          Get your key at{" "}
          <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline" style={{ color: "#9d7cff" }}>
            aistudio.google.com
          </a>
        </p>
      </div>

      {/* Analyze button */}
      <div className="p-4">
        <button
          onClick={analyze}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
          style={{
            background: loading ? "rgba(157,124,255,0.08)" : "rgba(157,124,255,0.15)",
            color: loading ? "#6b6560" : "#9d7cff",
            border: "1px solid rgba(157,124,255,0.2)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <Sparkles size={14} className={loading ? "animate-pulse-soft" : ""} />
          {loading ? "Analyzing…" : "Analyze with Gemini"}
        </button>

        {error && (
          <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg text-xs" style={{ background: "rgba(255,107,100,0.08)", color: "#ff6b64", border: "1px solid rgba(255,107,100,0.15)" }}>
            <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Scores */}
      {blog.scores && (
        <div className="px-4 pb-4 animate-fade-in">
          {/* Overall score */}
          <div
            className="rounded-xl p-4 mb-4 text-center"
            style={{ background: "rgba(157,124,255,0.06)", border: "1px solid rgba(157,124,255,0.15)" }}
          >
            <div
              className="text-4xl font-bold mb-1"
              style={{
                fontFamily: "var(--font-cormorant)",
                color: (totalScore ?? 0) >= 75 ? "#6bcb77" : (totalScore ?? 0) >= 50 ? "#e8a045" : "#ff6b64",
              }}
            >
              {totalScore}
            </div>
            <div className="text-xs text-ink-muted">BlogScore™</div>
          </div>

          <ScoreBar label="Human Depth" value={blog.scores.human} color="#6bcb77" />
          <ScoreBar label="Clarity & Flow" value={blog.scores.clarity} color="#e8a045" />
          <ScoreBar label="Accuracy" value={blog.scores.accuracy} color="#9d7cff" />

          {/* Suggestions */}
          {blog.suggestions.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-ink-muted mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Suggestions
              </div>
              <div className="space-y-2">
                {blog.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="flex gap-2.5 p-3 rounded-xl text-xs leading-relaxed"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <TrendingUp size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#e8a045" }} />
                    <span className="text-ink-secondary">{s}</span>
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
