import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Blog, BlogStage, BlogScores } from "@/types";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWriteDate: string;
  totalWordsAllTime: number;
  todayWords: number;
  todayDate: string;
  writingDays: string[];
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const SEED_BLOGS: Blog[] = [
  // ... (Keep your existing SEED_BLOGS array here)
  {
    id: "seed-1",
    title: "The paradox of choice",
    content: "<p>We live in an era of unprecedented options. Every decision—from what to eat to where to live—comes with hundreds of variations, and yet, somehow, we feel less satisfied than ever.</p><p>Barry Schwartz called this the <em>paradox of choice</em>. More options should mean more freedom. But instead, they create paralysis, regret, and quiet anxiety that follows us everywhere.</p><p>Maybe the path to contentment isn't more options — it's the art of choosing deliberately and moving on.</p>",
    tags: ["philosophy", "psychology", "life"],
    stage: "published",
    scores: { human: 84, clarity: 79, accuracy: 72 },
    suggestions: [
      "Consider adding a personal anecdote to ground the philosophical argument.",
      "The conclusion could be stronger — what does 'choosing deliberately' look like in practice?",
      "Reference more contemporary research to support Schwartz's original findings.",
    ],
    versions: [
      { v: "v1", message: "Raw brain dump", timestamp: "3 days ago", wordCount: 45, content: "<p>We live in an era of unprecedented options. Every decision comes with hundreds of variations, and yet, somehow, we feel less satisfied than ever.</p>" },
      { v: "v2", message: "Added Schwartz reference", timestamp: "2 days ago", wordCount: 98, content: "<p>We live in an era of unprecedented options. Every decision—from what to eat to where to live—comes with hundreds of variations, and yet, somehow, we feel less satisfied than ever.</p><p>Barry Schwartz called this the <em>paradox of choice</em>. More options should mean more freedom. But instead, they create paralysis, regret, and quiet anxiety.</p>" },
      { v: "v3", message: "Final polish", timestamp: "6 hours ago", wordCount: 132, content: "<p>We live in an era of unprecedented options. Every decision—from what to eat to where to live—comes with hundreds of variations, and yet, somehow, we feel less satisfied than ever.</p><p>Barry Schwartz called this the <em>paradox of choice</em>. More options should mean more freedom. But instead, they create paralysis, regret, and quiet anxiety that follows us everywhere.</p><p>Maybe the path to contentment isn't more options — it's the art of choosing deliberately and moving on.</p>" },
    ],
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 21600000,
  },
  {
    id: "seed-2",
    title: "Building in public",
    content: "<p>There is something terrifying about showing your unfinished work to the world. The imperfection is visible. The pivots are traceable. The failures are public record.</p><p>But there is also something incredibly liberating about it. When you build in public, you get feedback before it is too late to act on it. You build real accountability. You find your people — the ones who are interested in the journey, not just the destination.</p>",
    tags: ["startup", "writing", "community"],
    stage: "growing",
    scores: { human: 71, clarity: 88, accuracy: 65 },
    suggestions: [
      "Great clarity! Add more emotional vulnerability to boost the human score.",
      "Include a specific example of feedback you received by building in public.",
      "The ending is strong — consider making the opening even more provocative.",
    ],
    versions: [
      { v: "v1", message: "Quick outline", timestamp: "5 days ago", wordCount: 32, content: "<p>There is something terrifying about showing your unfinished work to the world. The imperfection is visible.</p>" },
      { v: "v2", message: "Full first draft", timestamp: "3 days ago", wordCount: 107, content: "<p>There is something terrifying about showing your unfinished work to the world. The imperfection is visible. The pivots are traceable. The failures are public record.</p><p>But there is also something incredibly liberating about it. When you build in public, you get feedback before it is too late to act on it. You build real accountability. You find your people — the ones who are interested in the journey, not just the destination.</p>" },
    ],
    createdAt: Date.now() - 432000000,
    updatedAt: Date.now() - 259200000,
  },
  {
    id: "seed-3",
    title: "Why mornings feel different",
    content: "<p>There is a quality of light in the early morning that does not exist at any other time of day. It is not just the color — it is the silence, the emptiness of the world before it fills up with noise and urgency.</p><p>In that window, between five and seven, the mind moves differently. Thoughts arrive fully formed rather than fragmented.</p>",
    tags: ["mindfulness", "life", "writing"],
    stage: "seed",
    scores: null,
    suggestions: [],
    versions: [
      { v: "v1", message: "Morning thought", timestamp: "2 hours ago", wordCount: 67, content: "<p>There is a quality of light in the early morning that does not exist at any other time of day. It is not just the color — it is the silence, the emptiness of the world before it fills up with noise and urgency.</p><p>In that window, between five and seven, the mind moves differently. Thoughts arrive fully formed rather than fragmented.</p>" },
    ],
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  }
];

interface BlogStore {
  blogs: Blog[];
  currentId: string | null;
  geminiKey: string;
  streak: StreakData;

  currentBlog: () => Blog | undefined;
  setCurrentId: (id: string) => void;
  setGeminiKey: (key: string) => void;
  createBlog: (title: string, tags: string[]) => string;
  updateBlog: (id: string, updates: Partial<Blog>) => void;
  saveVersion: (id: string, message: string) => void;
  restoreVersion: (id: string, versionIndex: number) => void;
  setStage: (id: string, stage: BlogStage) => void;
  setScores: (id: string, scores: BlogScores, suggestions: string[]) => void;
  deleteBlog: (id: string) => void;
  recordWriting: (wordsAdded: number) => void;
  
  // ADD THIS LINE
  resetAllData: () => void;
}

const defaultStreak = (): StreakData => ({
  currentStreak: 3,
  longestStreak: 5,
  lastWriteDate: todayStr(),
  totalWordsAllTime: 1240,
  todayWords: 87,
  todayDate: todayStr(),
  writingDays: [
    new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10),
    new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10),
    new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    new Date(Date.now() - 86400000 * 1).toISOString().slice(0, 10),
    todayStr(),
  ],
});

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      blogs: SEED_BLOGS,
      currentId: "seed-1",
      geminiKey: "",
      streak: defaultStreak(),

      currentBlog: () => get().blogs.find((b) => b.id === get().currentId),

      setCurrentId: (id) => set({ currentId: id }),

      setGeminiKey: (key) => set({ geminiKey: key }),

      createBlog: (title, tags) => {
        const id = uuidv4();
        const now = Date.now();
        const blog: Blog = {
          id,
          title,
          content: "",
          tags,
          stage: "seed",
          scores: null,
          suggestions: [],
          versions: [{ v: "v1", message: "Created", timestamp: "just now", wordCount: 0, content: "" }],
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ blogs: [blog, ...s.blogs], currentId: id }));
        return id;
      },

      updateBlog: (id, updates) => {
        set((s) => ({
          blogs: s.blogs.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: Date.now() } : b)),
        }));
      },

      saveVersion: (id, message) => {
        set((s) => {
          const blog = s.blogs.find((b) => b.id === id);
          if (!blog) return s;
          const text = blog.content.replace(/<[^>]+>/g, " ").trim();
          const wordCount = text.split(/\s+/).filter(Boolean).length;
          const vNum = blog.versions.length + 1;
          const newVersion = {
            v: `v${vNum}`,
            message,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            wordCount,
            content: blog.content,
          };
          return {
            blogs: s.blogs.map((b) =>
              b.id === id ? { ...b, versions: [...b.versions, newVersion], updatedAt: Date.now() } : b
            ),
          };
        });
      },

      restoreVersion: (id, versionIndex) => {
        set((s) => {
          const blog = s.blogs.find((b) => b.id === id);
          if (!blog) return s;
          const targetVersion = blog.versions[versionIndex];
          if (!targetVersion || !targetVersion.content) return s;
          const text = blog.content.replace(/<[^>]+>/g, " ").trim();
          const wordCount = text.split(/\s+/).filter(Boolean).length;
          const vNum = blog.versions.length + 1;
          const backupVersion = {
            v: `v${vNum}`,
            message: `Auto-backup before restoring ${targetVersion.v}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            wordCount,
            content: blog.content,
          };
          return {
            blogs: s.blogs.map((b) =>
              b.id === id
                ? {
                    ...b,
                    content: targetVersion.content,
                    versions: [...b.versions, backupVersion],
                    updatedAt: Date.now(),
                  }
                : b
            ),
          };
        });
      },

      setStage: (id, stage) => {
        set((s) => ({
          blogs: s.blogs.map((b) => (b.id === id ? { ...b, stage, updatedAt: Date.now() } : b)),
        }));
      },

      setScores: (id, scores, suggestions) => {
        set((s) => ({
          blogs: s.blogs.map((b) => (b.id === id ? { ...b, scores, suggestions, updatedAt: Date.now() } : b)),
        }));
      },

      deleteBlog: (id) => {
        set((s) => ({
          blogs: s.blogs.filter((b) => b.id !== id),
          currentId: s.currentId === id ? (s.blogs.find((b) => b.id !== id)?.id ?? null) : s.currentId,
        }));
      },

      recordWriting: (wordsAdded) => {
        set((s) => {
          const today = todayStr();
          const prev = s.streak;
          const isToday = prev.todayDate === today;
          const wasYesterday = prev.lastWriteDate === new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const newTodayWords = isToday ? prev.todayWords + wordsAdded : wordsAdded;
          const newStreak = prev.lastWriteDate === today
            ? prev.currentStreak
            : wasYesterday ? prev.currentStreak + 1 : 1;
          const days = prev.writingDays.includes(today) ? prev.writingDays : [...prev.writingDays, today];
          return {
            streak: {
              currentStreak: newStreak,
              longestStreak: Math.max(prev.longestStreak, newStreak),
              lastWriteDate: today,
              totalWordsAllTime: prev.totalWordsAllTime + wordsAdded,
              todayWords: newTodayWords,
              todayDate: today,
              writingDays: days,
            },
          };
        });
      },

      // ==========================================
      // ADD THIS NEW ACTION TO WIPE EVERYTHING
      // ==========================================
      resetAllData: () => {
        set({
          blogs: [],
          currentId: null,
          geminiKey: "",
          streak: {
            currentStreak: 0,
            longestStreak: 0,
            lastWriteDate: todayStr(),
            totalWordsAllTime: 0,
            todayWords: 0,
            todayDate: todayStr(),
            writingDays: [],
          },
        });
      },
      
    }),
    {
      name: "blogpotro-storage",
      version: 3,
    }
  )
);