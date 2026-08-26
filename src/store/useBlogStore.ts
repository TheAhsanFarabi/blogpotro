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

function calculateStreak(days: string[]): { currentStreak: number; longestStreak: number } {
  if (!days || days.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const uniqueDays = Array.from(new Set(days)).sort();
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const lastDay = uniqueDays[uniqueDays.length - 1];
  const isActive = lastDay === today || lastDay === yesterday;

  if (!isActive) {
    let max = 1;
    let curr = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(uniqueDays[i - 1]).getTime();
      const currD = new Date(uniqueDays[i]).getTime();
      const diff = Math.round((currD - prev) / 86400000);
      if (diff === 1) {
        curr++;
        if (curr > max) max = curr;
      } else if (diff > 1) {
        curr = 1;
      }
    }
    return { currentStreak: 0, longestStreak: max };
  }

  let currentStreak = 1;
  for (let i = uniqueDays.length - 1; i > 0; i--) {
    const d2 = new Date(uniqueDays[i]).getTime();
    const d1 = new Date(uniqueDays[i - 1]).getTime();
    const diff = Math.round((d2 - d1) / 86400000);
    if (diff === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  let longestStreak = currentStreak;
  let curr = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]).getTime();
    const currD = new Date(uniqueDays[i]).getTime();
    const diff = Math.round((currD - prev) / 86400000);
    if (diff === 1) {
      curr++;
      if (curr > longestStreak) longestStreak = curr;
    } else if (diff > 1) {
      curr = 1;
    }
  }

  return { currentStreak, longestStreak };
}

const SEED_BLOGS: Blog[] = [];

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
  resetAllData: () => void;
}

const defaultStreak = (): StreakData => ({
  currentStreak: 0,
  longestStreak: 0,
  lastWriteDate: todayStr(),
  totalWordsAllTime: 0,
  todayWords: 0,
  todayDate: todayStr(),
  writingDays: [],
});

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      blogs: [],
      currentId: null,
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
        if (wordsAdded <= 0) return;
        set((s) => {
          const today = todayStr();
          const prev = s.streak;
          const isToday = prev.todayDate === today;
          const newTodayWords = isToday ? prev.todayWords + wordsAdded : wordsAdded;
          const updatedWritingDays = prev.writingDays.includes(today)
            ? prev.writingDays
            : [...prev.writingDays, today];

          const { currentStreak, longestStreak } = calculateStreak(updatedWritingDays);

          return {
            streak: {
              currentStreak,
              longestStreak: Math.max(prev.longestStreak, longestStreak),
              lastWriteDate: today,
              totalWordsAllTime: prev.totalWordsAllTime + wordsAdded,
              todayWords: newTodayWords,
              todayDate: today,
              writingDays: updatedWritingDays,
            },
          };
        });
      },

      resetAllData: () => {
        set({
          blogs: [],
          currentId: null,
          geminiKey: "",
          streak: defaultStreak(),
        });
      },
    }),
    {
      name: "blogpotro-storage-v4",
      version: 4,
    }
  )
);