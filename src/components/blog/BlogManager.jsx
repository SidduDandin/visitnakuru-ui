'use client';

import React, { useState, useEffect } from "react";
import { parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import AddBlogForm from "./AddBlogForm";
import BlogTable from "./BlogTable";
import Button from "../ui/button/Button"; 

export default function BlogManager() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [view, setView] = useState('list');
  const { authToken } = parseCookies();

 
  const handleAuthError = () => {
    destroyCookie(null, "authToken");
    destroyCookie(null, "isAdmin");
    router.push("/admin/login");
  };

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/blogs/admin/all`, {
        headers: { "x-auth-token": authToken || "" },
      });
      if (res.status === 401) {
        handleAuthError();
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch blog posts.");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleAddClick = () => {
    setEditingBlog(null); 
    setView('form');
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setView('form');
  };

  const handleBackToList = () => {
    fetchBlogs(); 
    setView('list');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Loading blog...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded shadow-md">
      {status && (
        <div
          className={`p-3 mb-4 text-sm rounded-lg ${
            status.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </div>
      )}

      {view === 'list' ? (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddClick}>Add New Blog</Button>
          </div>
          <BlogTable
            blogs={blogs}
            backendUrl={backendUrl}
            onEditClick={handleEditClick}
            onBlogDeleted={() => {
              setStatus("Blog deleted successfully!");
              fetchBlogs();
            }}
            onError={(message) => setStatus(message)}
            handleAuthError={handleAuthError}
          />
        </>
      ) : (
        <AddBlogForm
          backendUrl={backendUrl}
          authToken={authToken}
          editingBlog={editingBlog}
          setEditingBlog={setEditingBlog}
          onBlogAdded={() => {
            setStatus("Blog added successfully!");
            handleBackToList();
          }}
          onBlogUpdated={() => {
            setStatus("Blog updated successfully!");
            handleBackToList();
          }}
          onError={(message) => setStatus(message)}
          handleAuthError={handleAuthError}
          onCancel={handleBackToList}
        />
      )}
    </div>
  );
}