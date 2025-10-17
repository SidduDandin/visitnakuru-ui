"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LocalizedBlogArticle } from "@/types/blog"; 
import { useTranslation } from "react-i18next";

type Props = {
  blogs: LocalizedBlogArticle[];
  baseUrl: string;
};

const ITEMS_PER_PAGE = 12;
export default function UserBlogList({ blogs, baseUrl }: Props) {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const visibleBlogs = blogs.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  
  if (!blogs || blogs.length === 0) {
    return (
      <div className="py-14 text-center">
        <p>{t('blogPage.noBlogsFound', { defaultValue: 'No blog articles found at the moment.' })}</p>
      </div>
    );
  }

  return (
    <>
     
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-col-1 gap-7">
        {visibleBlogs.map((blog) => (
          <div key={blog.blogId} className="mb-0"> 
            
           
            <div className="relative pb-[65%] overflow-hidden mb-5"> 
              <Link href={`/blog/${blog.blogURL}`} aria-label={blog.title}>
                <Image
                  src={`${baseUrl}/images/blogs/${blog.Image}`}
                  alt={blog.title}
                 
                  className="absolute top-0 left-0 w-full h-full object-cover" 
                  width={300} 
                  height={195} 
                />
              </Link>
            </div>


            <> 
              <p className="mb-2.5 font-light">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              
              <h5 className="mb-2.5">
                <Link href={`/blog/${blog.blogURL}`} className="">
                {/* text-inherit transition line-clamp-2 */}
                  {blog.title}
                </Link>
              </h5>

              <Link href={`/blog/${blog.blogURL}`} className="text-primary">
                  {t('blogPage.readMore', { defaultValue: 'Read More' })}
              </Link>
            </>
          </div>
        ))}
      </div>

 
      {visibleCount < blogs.length && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            className="btn btn-primary"
          >
            {t('blogPage.loadMore', { defaultValue: 'Load More' })}
          </button>
        </div>
      )}
     
    </>
  );
}