"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";

async function getBlogArticle(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, { cache: "no-store" });
    if (res.status === 404 || !res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Blog Detail Fetch Error:", err);
    return null;
  }
}

function localizeBlogDetail(blog, lang) {
  const langCode = lang === "en" ? "en" : lang;
  const titleField = `blogTitle_${langCode}`;
  const descField = `blogDescription_${langCode}`;
  const localizedTitle = blog[titleField] || blog.blogTitle_en;
  const localizedDescription = blog[descField] || blog.blogDescription_en;
  return { ...blog, title: localizedTitle, description: localizedDescription };
}

export default function BlogDetailsPage({ params }) {
  
  const { slug } = use(params);

  if (!slug) notFound();

  const { lang, isMounted } = useLanguage();
  const { t } = useTranslation();

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isMounted || !slug) return;

    async function fetchData() {
      setLoading(true);
      try {
        const data = await getBlogArticle(slug);
        setBlogData(data);
      } catch (err) {
        console.error("Failed to fetch blog data:", err);
        setBlogData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug, lang, isMounted]);

  const localizedBlog = useMemo(() => {
    if (!blogData) return null;
    return localizeBlogDetail(blogData, lang);
  }, [blogData, lang]);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

  if (!isMounted || loading) {
    return (
      <div className="py-14 bg-white text-center min-h-[500px] flex items-center justify-center">
        <p className="text-gray-500 text-xl font-medium">
          {t("aboutPage.loading", {
            language: lang.toUpperCase(),
            defaultValue: "Loading Content...",
          })}
        </p>
      </div>
    );
  }

  if (!localizedBlog) {
    return (
      <div className="py-14 bg-white text-center min-h-[500px] flex items-center justify-center">
        <p className="text-gray-500 text-xl font-medium">
          {t("blogPage.contentNotFound", { defaultValue: "Blog content not found." })}
        </p>
      </div>
    );
  }

  const articleDate = new Date(localizedBlog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <section className="bg-gray-100 text-gray-800 py-11">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-2">{localizedBlog.title}</h1>
          <p className="text-lg text-primary">{articleDate}</p>
        </div>
      </section>

      <div className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-8 aspect-video overflow-hidden rounded-lg shadow-lg">
              <Image
                src={`${baseUrl}/images/blogs/${localizedBlog.Image}`}
                alt={localizedBlog.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="prose prose-lg mx-auto">
              <div dangerouslySetInnerHTML={{ __html: localizedBlog.description }} />
            </div>

            <div className="mt-8">
              <Link href="/blog" className="btn">
                {t("blogPage.backToAllBlogs", { defaultValue: "← Back to Blogs" })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}