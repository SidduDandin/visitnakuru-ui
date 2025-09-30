// app/blogs/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Blog } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`)
    .then((res) => res.json())
    .then((data) => {
      // If backend returns { blogs: [...] }
      if (Array.isArray(data)) {
        setBlogs(data);
      } else if (Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
      } else {
        setBlogs([]); // fallback
      }
    });
}, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <Link href="/admin/blogs/add-blog">
          <Button>+ Add Blog</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(blogs) && blogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-lg transition">
            <CardContent className="p-4">
              {blog.featuredImage && (
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="rounded-md w-full h-40 object-cover mb-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 text-sm mb-2">
                By {blog.author} •{" "}
                {new Date(blog.createdAt || "").toLocaleDateString()}
              </p>
              <p className="line-clamp-3 text-gray-700">{blog.content}</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                {blog.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <Link href={`/admin/blogs/${blog.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
                <Link href={`/admin/blogs/${blog.id}`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
