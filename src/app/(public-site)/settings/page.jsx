"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import ProfileForm from "@/components/account/ProfileForm";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";

export default function Settings() {
  const { userAuthToken } = parseCookies();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userAuthToken) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/dashboard`, {
      headers: { "x-auth-token": userAuthToken },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => router.push("/login"));
  }, [userAuthToken, router]);

  if (!user)
    return (
      <div className="min-h-screen flex justify-center bg-gray-50 items-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-yellow-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Information
              </h3>
              <p className="text-sm text-gray-500">
                Update your personal information
              </p>
            </div>
          </div>

          <ProfileForm user={user} token={userAuthToken} onUpdate={setUser} />
        </div>

        {/* Change Password Section */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Change Password
              </h3>
              <p className="text-sm text-gray-500">
                Update your account password
              </p>
            </div>
          </div>

          <ChangePasswordForm token={userAuthToken} />
        </div>
      </div>
    </div>
  );
}
