"use client";

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import { redirect } from "next/navigation";
import UserBlogList from "@/components/blog/UserBlogList";
import { BlogArticle, LocalizedBlogArticle } from "@/types/blog"; 

export const dynamic = "force-dynamic";


async function fetchBlogs(): Promise<BlogArticle[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
 
  const url = `${baseUrl}/api/blogs`; 

  try {
   
    const res = await fetch(url, { cache: 'no-store' }); 

    if (res.status === 404) {
      redirect("/error-404");
    }
    if (res.status >= 500) {
      redirect("/error-505");
    }

    if (!res.ok) {
      console.error(`Failed to fetch blogs. Status: ${res.status}`);
      return [];
    }
    
    const data: BlogArticle[] = await res.json();
    return data;

  } catch (error) {
    console.error("Blog Fetch Error:", error);
    return [];
  }
}


function localizeBlog(blog: BlogArticle, lang: string): LocalizedBlogArticle {
  const langCode = lang === 'en' ? 'en' : lang as 'es' | 'fr' | 'de' | 'zh';
  const titleField = `blogTitle_${langCode}` as keyof BlogArticle;
  const descField = `blogDescription_${langCode}` as keyof BlogArticle;

  const localizedTitle = (blog[titleField] || blog.blogTitle_en) as string;
  const localizedDescription = (blog[descField] || blog.blogDescription_en) as string;

  return {
    ...blog,
    title: localizedTitle,
    description: localizedDescription,
  };
}



export default function BlogListingPage() {
  const { lang, isMounted } = useLanguage();
  const { t } = useTranslation();
  
  const [blogs, setBlogs] = useState<BlogArticle[] | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!isMounted) return;

    async function fetchData() {
      setLoading(true);
      try {
        const data = await fetchBlogs();
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blog data:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isMounted,lang]); 


  const localizedBlogs = useMemo(() => {
    if (!blogs) return [];
    return blogs.map(blog => localizeBlog(blog, lang));
  }, [blogs, lang]); 

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';
  
  if (!isMounted || loading) {
    return (
      <div className="py-14 bg-white text-center min-h-[500px] flex items-center justify-center">
        <p className="text-gray-500 text-xl font-medium">{t('aboutPage.loading', { language: lang.toUpperCase(), defaultValue: 'Loading Content...' })}</p>
      </div>
    );
  }

 
  if (!localizedBlogs || localizedBlogs.length === 0) {
    return (
      <>
        <section className="bg-gray-100 text-gray-800 py-11">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl font-bold mb-4">{t('desktopMegaNav.blog')}</h1>
            <p className="text-lg max-w-2xl mx-auto">
              {t('blogPage.subtitle', { defaultValue: 'Explore the latest news and stories about Nakuru.' })}
            </p>
          </div>
        </section>
        <div className="py-14 text-center">
          <p>{t('blogPage.noBlogsFound', { defaultValue: 'No blog articles found at the moment.' })}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="bg-gray-100 text-gray-800 py-11">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">{t('desktopMegaNav.blog')}</h1>
          <p className="text-lg max-w-2xl mx-auto">
            {t('blogPage.subtitle', { defaultValue: 'Explore the latest news and stories about Nakuru.' })}
          </p>
        </div>
      </section>

      <div className="md:py-[90px] py-[60px] bg-white">
        <div className="container mx-auto px-4">
          <UserBlogList blogs={localizedBlogs} baseUrl={baseUrl} />
        </div>
      </div>
    </>
  );
}