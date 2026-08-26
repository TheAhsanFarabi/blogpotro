"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import { useBlogStore } from "@/store/useBlogStore";
import { useEffect, useState } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2,
  Quote, List, ListOrdered, Highlighter, Minus, Undo, Redo, FileText
} from "lucide-react";

function ToolButton({
  onClick, active, children, title,
}: { onClick: () => void; active?: boolean; children: React.ReactNode; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all text-xs font-bold ${
        active
          ? "bg-pastel-amber-solid text-ink-primary neo-border-sm neo-shadow-xs"
          : "bg-paper-100 text-ink-secondary hover:text-ink-primary hover:bg-paper-200 border border-paper-300"
      }`}
    >
      {children}
    </button>
  );
}

const ToolSep = () => (
  <div className="w-[1.5px] h-5 mx-1 bg-paper-300" />
);

export default function RichEditor() {
  const [mounted, setMounted] = useState(false);
  const blog = useBlogStore((s) => s.currentBlog());
  const updateBlog = useBlogStore((s) => s.updateBlog);
  const currentId = useBlogStore((s) => s.currentId);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Highlight.configure({ multicolor: false }),
      CharacterCount,
      Placeholder.configure({
        placeholder: "Write with literary clarity and unbounded thought…",
      }),
    ],
    content: blog?.content ?? "",
    editorProps: {
      attributes: { class: "tiptap-editor focus:outline-none" },
    },
    onUpdate: ({ editor }) => {
      if (currentId) {
        updateBlog(currentId, { content: editor.getHTML() });
      }
    },
  });

  // Sync editor when blog changes
  useEffect(() => {
    if (editor && blog && editor.getHTML() !== blog.content) {
      editor.commands.setContent(blog.content || "", false);
    }
  }, [currentId, editor, blog]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center text-ink-muted text-sm" style={{ fontFamily: "var(--font-jetbrains)" }}>
        Initializing manuscript sheet…
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-ink-muted p-8 text-center bg-paper-100">
        <div className="w-16 h-16 rounded-2xl bg-paper-200 neo-border-sm flex items-center justify-center mb-4 text-ink-muted">
          <FileText size={28} />
        </div>
        <p className="text-xl font-bold text-ink-primary mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
          No Manuscript Selected
        </p>
        <p className="text-xs text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
          Choose a thought from the archive or create a new one to begin.
        </p>
      </div>
    );
  }

  const wordCount = editor?.storage.characterCount.words() ?? 0;
  const charCount = editor?.storage.characterCount.characters() ?? 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex flex-col h-full bg-paper-100">
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-4 py-2 flex-shrink-0 bg-paper-50 border-b-2 border-ink overflow-x-auto"
      >
        <ToolButton onClick={() => editor?.chain().focus().undo().run()} title="Undo"><Undo size={13} strokeWidth={2.4} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().redo().run()} title="Redo"><Redo size={13} strokeWidth={2.4} /></ToolButton>
        <ToolSep />
        <ToolButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Bold"><Bold size={13} strokeWidth={2.5} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Italic"><Italic size={13} strokeWidth={2.5} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")} title="Underline"><UnderlineIcon size={13} strokeWidth={2.5} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleHighlight().run()} active={editor?.isActive("highlight")} title="Highlight"><Highlighter size={13} strokeWidth={2.4} /></ToolButton>
        <ToolSep />
        <ToolButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive("heading", { level: 1 })} title="Heading 1"><Heading1 size={13} strokeWidth={2.5} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 size={13} strokeWidth={2.5} /></ToolButton>
        <ToolSep />
        <ToolButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="Quote"><Quote size={13} strokeWidth={2.4} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Bullet List"><List size={13} strokeWidth={2.5} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Numbered List"><ListOrdered size={13} strokeWidth={2.5} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={13} strokeWidth={2.5} /></ToolButton>
      </div>

      {/* Editor Manuscript Sheet */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 paper-grid">
        <div className="max-w-[760px] mx-auto bg-white p-8 sm:p-12 md:p-14 rounded-2xl neo-border neo-shadow-md min-h-[580px]">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Footer Status Bar */}
      <div
        className="flex items-center gap-3 px-6 py-2.5 flex-shrink-0 bg-paper-50 border-t-2 border-ink text-xs font-bold"
        style={{ fontFamily: "var(--font-jetbrains)" }}
      >
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded neo-border-sm bg-paper-200 text-ink-primary">
            {wordCount} words
          </span>
          <span className="px-2 py-0.5 rounded neo-border-sm bg-paper-200 text-ink-primary">
            {charCount} chars
          </span>
          <span className="hidden sm:inline-block text-[11px] text-ink-muted">
            ~{readingTime} min read
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded neo-border-sm bg-pastel-amber-solid text-ink-primary">
            {blog.versions.length} {blog.versions.length === 1 ? "snapshot" : "snapshots"}
          </span>
        </div>
      </div>
    </div>
  );
}