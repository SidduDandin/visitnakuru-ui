"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";

export default function TipTapEditor({ value, onChange }) {
  // Avoid SSR
  if (typeof window === "undefined") return null;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync content on load
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded p-3 bg-white">
      {/* Toolbar */}
      <div className="flex gap-2 border-b pb-3 mb-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-3 py-1 border rounded text-sm font-semibold"
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-3 py-1 border rounded text-sm italic"
        >
          I
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="px-3 py-1 border rounded text-sm underline"
        >
          U
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-3 py-1 border rounded text-sm"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="px-3 py-1 border rounded text-sm"
        >
          1. List
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[200px] outline-none" />
    </div>
  );
}
