import React from "react";
import ExploreManager from "@/components/explore/ExploreManager";
import { Suspense } from "react"; 

export const metadata = {
  title: "Manage explore | Visit Nakuru",
  description: "Admin can create, edit, and manage  Explore Nakuru.",
};

export default function ExplorePage() {
  return (
  <>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Explore Nakuru
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Create, edit, and manage editorial pages
            </p>
          </div>
        </div>
  
        
    <Suspense fallback={<div className="p-6">Loading...</div>}>
          <ExploreManager />
     </Suspense>
      </>
  );
}
