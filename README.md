# BlogPotro ✦

> A thinking-first blog platform with version control, AI scoring, and a mind-map feed.

**Theme:** Inkwell Dark — deep black with amber warmth and violet accents. Inspired by candlelit writing desks and starlit notebooks.

---

## ✦ Features

- **Rich Text Editor** — powered by Tiptap (bold, italic, headings, blockquotes, lists, highlights)
- **Version Control** — save named snapshots, browse your writing timeline
- **Blog Stages** — 🌱 Seed → 🌿 Growing → 🌳 Published
- **Thought Graph** — D3-powered force graph connecting blogs by shared tags
- **AI BlogScore™** — Gemini API scores your writing on Human Depth, Clarity, and Accuracy
- **Local Storage** — all data persists in the browser, zero backend needed
- **Vercel Ready** — deploy in one command

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

---

## 🚀 Deploy to Vercel

### Option A: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B: GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select your repo → Deploy (zero config needed)

---

## 🔑 Gemini API Setup

1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Create a free API key
3. Paste it in the **AI Score** tab in the editor
4. Click **Analyze with Gemini**

Your key is saved to localStorage — never sent anywhere except Google's API.

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── editor/page.tsx      # Main editor view
│   ├── feed/page.tsx        # Thought Graph view
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Theme + Tiptap styles
├── components/
│   ├── Navbar.tsx           # Top navigation
│   ├── BlogSidebar.tsx      # Blog list + filters
│   ├── RichEditor.tsx       # Tiptap editor
│   ├── VersionPanel.tsx     # Git-like version history
│   ├── AIPanel.tsx          # Gemini AI scoring
│   ├── StageSelector.tsx    # Seed/Growing/Published
│   ├── ThoughtGraph.tsx     # D3 force graph
│   └── NewBlogModal.tsx     # Create blog modal
├── store/
│   └── useBlogStore.ts      # Zustand + localStorage
└── types/
    └── index.ts             # TypeScript types
```

---

## 🎨 Design System — Inkwell Dark

| Token | Value |
|-------|-------|
| Background | `#07070a` |
| Surface | `#0d0d12` |
| Amber accent | `#e8a045` |
| Violet accent | `#9d7cff` |
| Seed green | `#6bcb77` |
| Display font | Cormorant Garamond |
| Body font | Plus Jakarta Sans |
| Mono font | JetBrains Mono |

---

Made with ☕ + BlogPotro
