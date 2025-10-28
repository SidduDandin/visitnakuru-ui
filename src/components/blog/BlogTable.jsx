'use client';

import React, { useState, useEffect } from "react";
import { parseCookies } from "nookies";


const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(/ /g, "/");
};

export default function BlogTable({
  blogs,
  backendUrl,
  onEditClick,
  onBlogDeleted,
  onError,
  handleAuthError,
}) {
  const { authToken } = parseCookies();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
      
        const res = await fetch(`${backendUrl}/api/blogs/admin/${blogId}`, {
          method: "DELETE",
          headers: { "x-auth-token": authToken || "" },
        });

        if (!res.ok) {
          if (res.status === 401) {
            handleAuthError();
            return;
          }
          throw new Error(`Failed to delete blog post: Server responded with ${res.status}`);
        }
        onBlogDeleted();
      } catch (err) {
        onError(err.message);
      }
    }
  };

  const filteredBlogs = blogs.filter((b) =>
    [b.blogTitle_en, b.blogURL]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBlogs.length / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage, blogs]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">List of Blogs</h2>
      
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="border px-3 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full md:w-1/3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Title (EN)</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4"> 
                  No blogs found
                </td>
              </tr>
            ) : (
              currentBlogs.map((blog) => (
                <tr key={blog.blogId} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3">
                   {blog.Image && (
                      <img
                        src={`${backendUrl}/images/blogs/${blog.Image}`}
                        alt={blog.blogTitle_en}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{blog.blogTitle_en}</td>
                  <td className="px-4 py-3">{formatDate(blog.createdAt)}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    > View </button>
                    <button
                      onClick={() => onEditClick(blog)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    > Edit </button>
                    <button
                      onClick={() => handleDelete(blog.blogId)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    > Delete </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-700 dark:text-gray-400">
          Showing {indexOfFirst + 1} to{" "}
          {Math.min(indexOfLast, filteredBlogs.length)} of{" "}
          {filteredBlogs.length}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-white"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-white"
          >
            Next
          </button>
        </div>
      </div>

     
      {selectedBlog && (
        // <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 overflow-y-auto">
        //     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-3xl w-full mx-4">
        //         <div className="flex justify-between items-center mb-4">
  <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-5xl mx-4 my-10 overflow-y-auto max-h-[85vh] transform transition-all duration-300 scale-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Blog Details</h3>
         <button onClick={() => setSelectedBlog(null)} className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">Close</button>
                </div>
               
                 <div className="border rounded-lg divide-y divide-gray-100 dark:divide-gray-700">
                    {selectedBlog.Image && (
                        <img src={`${backendUrl}/images/blogs/${selectedBlog.Image}`} alt={selectedBlog.blogTitle_en} className="w-full h-auto rounded-t-lg" />
                    )}
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Created At:</span>
                            <span className="text-gray-900 dark:text-white text-right">{formatDate(selectedBlog.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Last Updated:</span>
                            <span className="text-gray-900 dark:text-white text-right">{formatDate(selectedBlog.updatedAt)}</span>
                        </div>
                    </div>
                    <div className="p-4">
                        <h4 className="font-semibold text-lg mb-2">English (EN)</h4>
                        <p className="mb-2"><strong>Title:</strong> {selectedBlog.blogTitle_en}</p>
                        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedBlog.blogDescription_en }} />
                    </div>
                    {selectedBlog.blogDescription_es && <div className="p-4"><h4 className="font-semibold text-lg mb-2">Spanish (ES)</h4><p className="mb-2"><strong>Title:</strong> {selectedBlog.blogTitle_es}</p><div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedBlog.blogDescription_es }} /></div>}
                    {selectedBlog.blogDescription_fr && <div className="p-4"><h4 className="font-semibold text-lg mb-2">French (FR)</h4><p className="mb-2"><strong>Title:</strong> {selectedBlog.blogTitle_fr}</p><div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedBlog.blogDescription_fr }} /></div>}
                    {selectedBlog.blogDescription_de && <div className="p-4"><h4 className="font-semibold text-lg mb-2">German (DE)</h4><p className="mb-2"><strong>Title:</strong> {selectedBlog.blogTitle_de}</p><div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedBlog.blogDescription_de }} /></div>}
                    {selectedBlog.blogDescription_zh && <div className="p-4"><h4 className="font-semibold text-lg mb-2">Chinese (ZH)</h4><p className="mb-2"><strong>Title:</strong> {selectedBlog.blogTitle_zh}</p><div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedBlog.blogDescription_zh }} /></div>}
                </div>
              
            </div>
        </div>
      )}
    </div>
  );
}