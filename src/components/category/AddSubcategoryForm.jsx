// src/components/category/AddSubcategoryForm.jsx
'use client';

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const generateUrlSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") 
    .replace(/[^\w-]+/g, "") 
    .replace(/--+/g, "-"); 
};

export default function AddSubcategoryForm({
  backendUrl,
  authToken,
  editingCategory,
  setEditingCategory,
  onCategoryAdded,
  onCategoryUpdated,
  onError,
  handleAuthError,
  topLevelCategories,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { CatName: "", ParentCategoryID: "" },
  });

  useEffect(() => {
    if (editingCategory) {
      reset({ 
        CatName: editingCategory.CatName,
       
        ParentCategoryID: editingCategory.ParentCategoryID ? String(editingCategory.ParentCategoryID) : "",
      });
    } else {
      reset({ CatName: "", ParentCategoryID: "" });
    }
   
  }, [editingCategory, reset]);


  const handleFormSubmit = async (data) => {
     const trimmedCatName = data.CatName ? data.CatName.trim() : '';
    try {
      const url = editingCategory
        ? `${backendUrl}/api/categories/admin/${editingCategory.CatId}`
        : `${backendUrl}/api/categories/admin`;
      const method = editingCategory ? "PUT" : "POST";

      const bodyData = {
        CatName: trimmedCatName,
        CatURL: generateUrlSlug(trimmedCatName),
       
        ParentCategoryID: data.ParentCategoryID, 
      };

      if (!bodyData.ParentCategoryID) {
          throw new Error("Please select a Category.");
      }
      
      
      if (editingCategory && String(editingCategory.CatId) === bodyData.ParentCategoryID) {
          throw new Error("A sub category cannot be its own category.");
      }


      const res = await fetch(url, {
        method,
        headers: { 
          "x-auth-token": authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (res.status === 401) {
        handleAuthError();
        return;
      }

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(
          resData.msg ||
            `An unexpected error occurred during sub category ${
              editingCategory ? "update" : "creation"
            }.`
        );
      }

      if (editingCategory) {
        onCategoryUpdated();
      } else {
        onCategoryAdded();
      }

      reset();
      setEditingCategory(null);
    } catch (err) {
      onError(err.message);
    }
  };


  const handleCancel = () => {
    reset({ CatName: "", ParentCategoryID: "" }); 
    setEditingCategory(null);
    onError(""); 
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold">
        {editingCategory ? "Update Sub Category" : "Add New Sub Category"}
      </h2>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4 mt-4"
      >
        
        <div>
          <label
            htmlFor="ParentCategoryID"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="ParentCategoryID"
            {...register("ParentCategoryID", {
              required: "Please select a category.",
            })}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Select Category --</option>
            {topLevelCategories.map((category) => (
              <option key={category.CatId} value={String(category.CatId)}>
                {category.CatName}
              </option>
            ))}
          </select>
          {errors.ParentCategoryID && (
            <p className="mt-2 text-sm text-red-600">{errors.ParentCategoryID.message}</p>
          )}
        </div>
        
     
       
        <div>
          <label
            htmlFor="CatName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Sub Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="CatName"
            {...register("CatName", {
              required: "Please enter sub category name.",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters long.",
              },
              maxLength: {
                value: 50,
                message: "Name cannot exceed 50 characters.",
              },
            })}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {errors.CatName && (
            <p className="mt-2 text-sm text-red-600">{errors.CatName.message}</p>
          )}
        </div>
     
     
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto
            bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500
            disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Processing..."
              : editingCategory
              ? "Update Sub Category"
              : "Add Sub Category"}
          </button>
          <button
              type="button"
              onClick={handleCancel} 
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
        </div>
      </form>
    </div>
  );
}