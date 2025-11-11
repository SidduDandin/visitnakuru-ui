
'use client';

import React, { useState, useEffect } from "react";
import { parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import AddSubcategoryForm from "./AddSubcategoryForm";
import ListCategories from "./ListCategories"; 

export default function SubcategoryManager() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const router = useRouter();

  const [topLevelCategories, setTopLevelCategories] = useState([]); 
  const [subcategories, setSubcategories] = useState([]); 
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [filterParentId, setFilterParentId] = useState(""); 
  const { authToken } = parseCookies();

  const handleAuthError = () => {
    destroyCookie(null, "authToken");
    destroyCookie(null, "isAdmin");
    router.push("/admin/login");
  };

  const fetchSubcategoryData = async () => {
    setIsLoading(true);
    try {
      const headers = { "x-auth-token": authToken || "" };

     
      const topLevelRes = await fetch(`${backendUrl}/api/categories/admin/toplevel`, { headers });
      
      
      const subcategoriesRes = await fetch(`${backendUrl}/api/categories/admin/subcategories`, { headers });

     
      if (topLevelRes.status === 401 || subcategoriesRes.status === 401) {
        handleAuthError();
        return;
      }

      if (!topLevelRes.ok || !subcategoriesRes.ok) {
        throw new Error("Failed to fetch category data.");
      }

      const topLevelData = await topLevelRes.json();
      const subcategoryData = await subcategoriesRes.json();
      
      setTopLevelCategories(topLevelData);
      
      setSubcategories(subcategoryData); 

    } catch (err) {
      setStatus(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategoryData();
  }, []);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Loading subcategories...</p>
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
      
      
      <AddSubcategoryForm 
        backendUrl={backendUrl}
        authToken={authToken}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        onCategoryAdded={() => {
          setStatus("Subcategory added successfully!");
          fetchSubcategoryData(); 
        }}
        onCategoryUpdated={() => {
          setStatus("Subcategory updated successfully!");
          setEditingCategory(null);
          fetchSubcategoryData(); 
        }}
        onError={(message) => setStatus(message)}
        handleAuthError={handleAuthError}
        topLevelCategories={topLevelCategories} 
      />

      <div className="border-t border-gray-200 pt-6 mt-6">
        
        
        <div className="mb-4">
            <label htmlFor="filterParentCategory" className="block mb-2 text-sm font-medium text-gray-900">
                Filter by Category
            </label>
            <select
                id="filterParentCategory"
                value={filterParentId}
                onChange={(e) => {
                    setFilterParentId(e.target.value);
                    setEditingCategory(null); 
                }}
                className="block w-full sm:w-64 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
            >
                <option value="">-- Show All Categories --</option>
                {topLevelCategories.map((category) => (
                    <option key={category.CatId} value={String(category.CatId)}>
                        {category.CatName}
                    </option>
                ))}
            </select>
        </div>
        
        <ListCategories 
          categories={subcategories}
          onEditClick={setEditingCategory}
          onCategoryDeleted={() => {
            setStatus("Subcategory deleted successfully!");
            fetchSubcategoryData(); 
          }}
          onError={(message) => setStatus(message)}
          handleAuthError={handleAuthError}
          isTopLevel={false} 
          filterParentId={filterParentId} 
        />
      </div>
    </div>
  );
}