import React from "react";
import CmsManager from "@/components/cms/CmsManager";

export const metadata = {
  title: "CMS Manager | Invest In Nakuru",
  description: "Admin can manage CMS pages",
};

const CmsPage = () => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage CMS 
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Create and manage your CMS content here.
          </p>
        </div>
      </div>

      {/* CMS Manager UI */}
      <CmsManager />
    </>
  );
};

export default CmsPage;
