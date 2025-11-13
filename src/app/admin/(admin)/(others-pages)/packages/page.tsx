import React from "react";
import PackageManager from "@/components/package/PackageManager";

export const metadata = {
  title: "Manage Packages | Visit Nakuru",
  description: "Admin can create, edit, and manage  packages.",
};

const PackagesPage = () => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Packages
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Create, edit, and manage packages.
          </p>
        </div>
      </div>

      
      <PackageManager />
    </>
  );
};

export default PackagesPage;