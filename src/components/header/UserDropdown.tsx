"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

// ✅ Define a type for user profile
type UserProfile = {
  fullname: string;
  email: string;
};

// ✅ Helper to read cookie
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => setIsOpen(false);

  // ✅ Fetch user profile
  const fetchProfile = async () => {
    try {
      const token = getCookie("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${backendUrl}/api/auth/profile`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data: UserProfile = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Error loading profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch first time
    fetchProfile();

    // 🔁 Poll every 5s for updated profile
    const interval = setInterval(fetchProfile, 5000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, [backendUrl]);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="block mr-1 font-medium text-theme-sm">
          {loading ? "Loading..." : profile?.fullname || "Guest"}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* ✅ User Info */}
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {profile?.fullname || "Unknown User"}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {profile?.email || ""}
          </span>
        </div>

        {/* Settings */}
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
                width="24"
                height="24"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22.205 2a1 1 0 0 0-.986.838l-.973 5.955c-1.17.34-2.285.8-3.336 1.371l-4.914-3.51a1 1 0 0 0-1.287.106l-3.89 3.886a1 1 0 0 0-.112 1.282l3.457 4.945a17 17 0 0 0-1.398 3.36l-5.93.986a1 1 0 0 0-.834.986v5.5a1 1 0 0 0 .824.986l5.934 1.051a16.8 16.8 0 0 0 1.394 3.36l-3.5 4.896a1 1 0 0 0 .106 1.287l3.888 3.89a1 1 0 0 0 1.28.114l4.955-3.469a17 17 0 0 0 3.346 1.381l.99 5.963a1 1 0 0 0 .986.836h5.5a1 1 0 0 0 .986-.826l1.061-5.986a17 17 0 0 0 3.33-1.397l4.988 3.5a1 1 0 0 0 1.282-.111l3.888-3.893a1 1 0 0 0 .104-1.29l-3.557-4.938a16.8 16.8 0 0 0 1.367-3.311l6.018-1.055a1 1 0 0 0 .826-.986v-5.5a1 1 0 0 0-.838-.986l-6.008-.983a17 17 0 0 0-1.37-3.306l3.507-4.998a1 1 0 0 0-.111-1.282l-3.89-3.888a1 1 0 0 0-1.292-.104l-4.924 3.541a16.8 16.8 0 0 0-3.334-1.389l-1.047-5.984A1 1 0 0 0 27.705 2zm.852 2h3.808l.996 5.686a1 1 0 0 0 .743.798c1.462.365 2.836.943 4.09 1.702a1 1 0 0 0 1.1-.043l4.68-3.364 2.694 2.694-3.332 4.748a1 1 0 0 0-.04 1.09 15 15 0 0 1 1.686 4.07 1 1 0 0 0 .809.744l5.707.934v3.808l-5.719 1.004a1 1 0 0 0-.797.746 14.8 14.8 0 0 1-1.681 4.069 1 1 0 0 0 .045 1.1l3.379 4.689-2.694 2.695-4.74-3.326a1 1 0 0 0-1.094-.035 14.9 14.9 0 0 1-4.08 1.709 1 1 0 0 0-.74.794L26.867 46h-3.814l-.942-5.662a1 1 0 0 0-.746-.807 14.9 14.9 0 0 1-4.105-1.695 1 1 0 0 0-1.088.039l-4.703 3.295-2.696-2.7 3.325-4.646a1 1 0 0 0 .04-1.1 14.9 14.9 0 0 1-1.71-4.115 1 1 0 0 0-.795-.742l-5.631-1v-3.814l5.627-.936a1 1 0 0 0 .807-.744 15 15 0 0 1 1.71-4.117 1 1 0 0 0-.035-1.092L8.826 11.47l2.697-2.696 4.663 3.332a1 1 0 0 0 1.095.043 14.8 14.8 0 0 1 4.104-1.685 1 1 0 0 0 .748-.81zM25 17c-4.406 0-8 3.594-8 8s3.594 8 8 8 8-3.594 8-8-3.594-8-8-8m0 2c3.326 0 6 2.674 6 6s-2.674 6-6 6-6-2.674-6-6 2.674-6 6-6"></path>
              </svg>
              Settings
            </DropdownItem>
          </li>
        </ul>

        {/* Logout */}
        <Link
          href="/admin/logout"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <svg
            className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
              fill=""
            />
          </svg>{" "}
          Sign out
        </Link>
      </Dropdown>
    </div>
  );
}
