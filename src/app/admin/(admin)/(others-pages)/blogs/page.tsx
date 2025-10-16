import React from "react";
import BlogManager from "@/components/blog/BlogManager";

export const metadata = {
  title: "Manage Blogs | Visit Nakuru",
  description: "Admin can create, edit, and manage multi-language blog posts.",
};

const BlogPage = () => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Blogs
          </h2>
          {/* <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Create, edit, and publish multi-language blog posts.
          </p> */}
        </div>
      </div>

      
      <BlogManager />
    </>
  );
};

export default BlogPage;