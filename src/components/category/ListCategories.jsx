// src/components/category/ListCategories.jsx
'use client';

import React, { useState, useMemo } from "react";
import { parseCookies } from "nookies";


export default function ListCategories({ categories, onEditClick, onCategoryDeleted, onError, handleAuthError, isTopLevel, filterParentId }) { 
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const { authToken } = parseCookies();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  
  const entityName = isTopLevel ? "Categorie" : "Sub Categorie"; 
  const list_entityName = isTopLevel ? "Category" : "Sub Category";


  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
       
        const matchesSearch = cat.CatName.toLowerCase().includes(search.toLowerCase()) || 
                              (cat.CatURL && cat.CatURL.toLowerCase().includes(search.toLowerCase()));

        
        if (!isTopLevel && filterParentId) {
            const matchesParent = String(cat.ParentCategoryID) === filterParentId;
            return matchesSearch && matchesParent;
        }

        
        return matchesSearch;

    }).sort((a, b) => a.CatName.localeCompare(b.CatName));
  }, [categories, search, isTopLevel, filterParentId]);

  
  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
const indexOfFirst = indexOfLast - rowsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);

  const colSpan = isTopLevel ? 4 : 5; 

  const handleDelete = async (catId) => {
    if (window.confirm(`Are you sure you want to delete this ${entityName}?`)) {
      try {
        const res = await fetch(`${backendUrl}/api/categories/admin/${catId}`, {
          method: "DELETE",
          headers: { "x-auth-token": authToken || "" },
        });

        if (!res.ok) {
          if (res.status === 401) {
            handleAuthError();
            return;
          }
          const resData = await res.json();
        
          throw new Error(resData.msg || `Failed to delete ${entityName}: Server responded with status ${res.status}.`);
        }

        onCategoryDeleted();
      } catch (err) {
        onError(err.message);
      }
    }
  };


  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">List of {entityName}s</h2> 
        
        
        <input
          type="text"
          placeholder={`Search ${entityName.toLowerCase()}s...`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); 
          }}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
        />
      </div>
      
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-4 bg-gray-50 font-medium text-gray-600 text-left border-b w-1/4">{list_entityName} Name</th>
              {/* <th className="py-3 px-4 bg-gray-50 font-medium text-gray-600 text-left border-b w-1/4">URL Slug</th> */}
            
              {!isTopLevel && <th className="py-3 px-4 bg-gray-50 font-medium text-gray-600 text-left border-b">Category</th>}
              <th className="py-3 px-4 bg-gray-50 font-medium text-gray-600 text-left border-b">Created Date</th>
              <th className="py-3 px-4 bg-gray-50 font-medium text-gray-600 text-left border-b">Updated Date</th>
              <th className="py-3 px-4 bg-gray-50 font-medium text-gray-600 text-left border-b w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="text-center py-4 text-gray-500">No {entityName.toLowerCase()}s found.</td>
              </tr>
            ) : (
              currentCategories.map((category) => (
                <tr key={category.CatId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800 font-medium">{category.CatName}</td>
                 
                  {!isTopLevel && (
                    <td className="py-3 px-4 text-gray-700">
                      {category.ParentCategory ? category.ParentCategory.CatName : 'N/A'} 
                    </td>
                  )}
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(category.CreatedAt).toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric",}).replace(/ /g, "/")}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(category.UpdatedAt).toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric",}).replace(/ /g, "/")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEditClick(category)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(category.CatId)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {indexOfFirst + 1} to{" "}
          {Math.min(indexOfLast, filteredCategories.length)} of{" "}
          {filteredCategories.length} 
          {/* {entityName}s */}
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm text-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}