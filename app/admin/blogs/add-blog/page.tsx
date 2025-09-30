"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Blog } from "@/types/blog";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function NewBlog() {
  const [form, setForm] = useState<Blog>({
    title: "",
    content: "",
    author: "",
    tags: [],
    featuredImage: "",
  });

  const router = useRouter();

  // Initialize Tiptap editor
  const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: "Write your blog content..." }),
  ],
  content: form.content,
  immediatelyRender: false, // 👈 prevents SSR hydration error
  onUpdate: ({ editor }) => {
    setForm((prev) => ({ ...prev, content: editor.getHTML() }));
  },
});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "tags" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.push("/admin/blogs");
    } catch (err) {
      console.error("Failed to save blog:", err);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Add New Blog</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Blog Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            {/* Tiptap Editor */}
            <div>
              <label className="block mb-2 text-sm font-medium">Content</label>
              <div className="border rounded-md p-2 bg-white">
                <EditorContent editor={editor} />
              </div>
            </div>

            <Input
              name="author"
              placeholder="Author"
              value={form.author}
              onChange={handleChange}
            />
            <Input
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags?.join(",") || ""}
              onChange={handleChange}
            />
            <Input
              name="featuredImage"
              placeholder="Image URL"
              value={form.featuredImage || ""}
              onChange={handleChange}
            />

            {form.featuredImage && (
              <img
                src={form.featuredImage}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md"
              />
            )}

            <Button type="submit" className="w-full">
              Save Blog
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
