"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // <--- useParams hook
import { Card, CardContent } from "@/components/ui/card";

interface Blog {
  id: string;
  title: string;
  content: string;
  featuredImage?: string;
  author: string;
  createdAt: string;
  tags?: string[];
}

export default function BlogDetail() {
  const params = useParams(); // get { id } from the route
  const blogId = params?.id as string; // ensure string

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/${blogId}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data: Blog = await res.json();
        setBlog(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!blog) return <p className="p-6">Blog not found</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-6">
          {blog.featuredImage && (
            <img src={blog.featuredImage} alt={blog.title} className="w-full h-64 object-cover rounded-md mb-6" />
          )}
          <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
          <p className="text-gray-600 mb-4">
            By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
          </p>

          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />

          <div className="mt-4 flex gap-2 flex-wrap">
            {blog.tags?.map((tag, i) => (
              <span key={i} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
