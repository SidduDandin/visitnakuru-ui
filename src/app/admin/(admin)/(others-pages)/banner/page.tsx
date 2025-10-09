import React from "react";
import BannerManager from "@/components/banner/BannerManager";

export const metadata = {
  title: "Manage Banner | Invest In Nakuru",
  description: "Admin can create, edit, and manage banner.",
};

const bannerPage = () => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Banner
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Create and manage banner.
          </p>
        </div>
      </div>

      {/* banner Manager UI */}
      <BannerManager />
    </>
  );
};

export default bannerPage;