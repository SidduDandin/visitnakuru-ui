import React from "react";
import PartnerManager from "@/components/partner/PartnerManager";

export const metadata = {
  title: "Manage Business Partners | Visit Nakuru",
  description: "Admin can view, approve, reject, and manage partner listings.",
};

const PartnerPage = () => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Business Partners
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            View, approve, reject, and manage business partner listings.
          </p>
        </div>
      </div>

      <PartnerManager />
    </>
  );
};

export default PartnerPage;
