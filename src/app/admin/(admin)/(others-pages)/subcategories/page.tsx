
import React from "react";
import SubcategoryManager from "@/components/category/SubcategoryManager"; 

export const metadata = {
   title: "Manage Subcategories | VisitNakuru",
  description: "Admin can add, view, and manage subcategories.",
};

const SubcategoryPage = () => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Subcategories
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Add, edit, and delete subcategories.
          </p>
        </div>
      </div>

      <SubcategoryManager />
    </>
  );
};

export default SubcategoryPage;