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
  Quote, List, ListOrdered, Highlighter, Minus, Undo, Redo,
} from "lucide-react";

function ToolButton({
  onClick, active, children, title,
}: { onClick: () => void; active?: boolean; children: React.ReactNode; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-7 h-7 flex items-center justify-center rounded-md transition-all duration-100"
      style={{
        background: active ? "rgba(232,160,69,0.15)" : "transparent",
        color: active ? "#e8a045" : "#5e5a55",
        border: active ? "1px solid rgba(232,160,69,0.2)" : "1px solid transparent",
      }}
    >
      {children}
    </button>
  );
}

const ToolSep = () => (
  <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.07)" }} />
);

export default function RichEditor() {
  const [mounted, setMounted] = useState(false);
  const blog = useBlogStore((s) => s.currentBlog());
  const updateBlog = useBlogStore((s) => s.updateBlog);
  const currentId = useBlogStore((s) => s.currentId);

  // Prevent hydration errors by waiting for client mount before rendering local storage data
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
        placeholder: "Let your thoughts flow freely…",
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
      <div className="flex-1 flex items-center justify-center text-ink-muted text-sm">
        Loading editor...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex-1 flex items-center justify-center text-ink-muted text-sm">
        Select or create a blog to start writing
      </div>
    );
  }

  const wordCount = editor?.storage.characterCount.words() ?? 0;
  const charCount = editor?.storage.characterCount.characters() ?? 0;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div
        className="flex items-center gap-0.5 px-4 py-2 flex-shrink-0 border-b overflow-x-auto"
        style={{ background: "#0a0a0f", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <ToolButton onClick={() => editor?.chain().focus().undo().run()} title="Undo"><Undo size={13} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().redo().run()} title="Redo"><Redo size={13} /></ToolButton>
        <ToolSep />
        <ToolButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Bold"><Bold size={13} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Italic"><Italic size={13} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")} title="Underline"><UnderlineIcon size={13} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleHighlight().run()} active={editor?.isActive("highlight")} title="Highlight"><Highlighter size={13} /></ToolButton>
        <ToolSep />
        <ToolButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive("heading", { level: 1 })} title="Heading 1"><Heading1 size={13} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 size={13} /></ToolButton>
        <ToolSep />
        <ToolButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="Quote"><Quote size={13} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Bullet List"><List size={13} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Numbered List"><ListOrdered size={13} /></ToolButton>
        <ToolButton onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={13} /></ToolButton>
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-y-auto px-10 py-8" style={{ maxWidth: "100%" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center gap-4 px-6 py-2.5 flex-shrink-0 border-t"
        style={{ background: "#0a0a0f", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span className="text-xs text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
          {wordCount} words
        </span>
        <span className="text-xs text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
          {charCount} chars
        </span>
        <span className="text-xs text-ink-muted ml-auto">
          {blog.versions.length} version{blog.versions.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}