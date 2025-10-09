import AdminProfile from "@/components/user-profile/admin-profile";
import AdminChangePassword from "@/components/user-profile/admin-changepassword";
import AdminAccountinfo from"@/components/user-profile/admin-accountinfo";
import React  from "react";

export const metadata = {
  title: "Settings | Invest In Nakauru",
  description: "Settings",
};

const SettingsPage = () => {
  return (
    <>
      {/* */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
        
        
      </div>


      {/* */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* ====== Profile Information Card ====== */}
          <AdminProfile/>
         
        {/* ====== Change Password Card ====== */}
        <AdminChangePassword />
        
        {/* ====== Account Information Card ====== */}
        
        <AdminAccountinfo/>
      </div>
    </>
  );
};

export default SettingsPage;