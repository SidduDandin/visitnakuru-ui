"use client";

import { useEffect, useState } from "react";

// Helper to read token from cookies
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function AdminaccouuntinfoCard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const fetchProfile = async () => {
    try {
      const token = getCookie("authToken");
      if (!token) {
        setErrorMessage("No authentication token found. Please log in again.");
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
        const err = await res.json().catch(() => ({}));
        throw new Error(err.msg || "Failed to fetch profile");
      }

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading account info...</div>;
  }

  if (errorMessage) {
    return (
      <div className="p-6 text-red-600">
        Error loading account info: {errorMessage}
      </div>
    );
  }

  return (
    <div className="lg:col-span-2">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-500">
            {/* Account Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Account Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your account details and status
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2">
          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {profile?.email || "-"}
              </p>
            </div>
          </div>

          {/* Full Name */}
          <div className="flex items-center gap-3">
            <div className="text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Full Name
              </p>
              <p className="font-medium text-gray-800 dark:text-white">
                {profile?.fullname || "-"}
              </p>
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center gap-3">
            <div className="text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm12 5a1 1 0 100-2h-3a1 1 0 100 2h3zM4 9a1 1 0 100-2H1a1 1 0 100 2h3zm11 1a1 1 0 10-2 0v6h2V10z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                User Name
              </p>
              <p className="font-medium text-gray-800 dark:text-white">
                {profile?.username || "ADMIN"}
              </p>
            </div>
          </div>

          {/* Account Status */}
            <div className="flex items-center gap-3">
            <div className="text-gray-500">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
                </svg>
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                Account Status
                </p>
                {profile?.status === 1 ? (
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold leading-5 text-green-800">
                    Active
                </span>
                ) : (
                <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold leading-5 text-red-800">
                    Inactive
                </span>
                )}
            </div>
            </div>

         
        </div>
      </div>
    </div>
  );
}
