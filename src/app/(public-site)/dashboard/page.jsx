"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from "nookies";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userAuthToken } = parseCookies();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!userAuthToken) {
        router.push("/register");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/dashboard`, {
          method: "GET",
          headers: { "x-auth-token": userAuthToken || "" },
        });

        if (res.status === 401) {
          destroyCookie(null, "userAuthToken");
          router.push("/register");
          return;
        }

        const data = await res.json();
        if (res.ok) setUser(data.user);
        else console.error("Dashboard error:", data.message);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router, userAuthToken]);

  if (loading) return <p className="text-gray-600 text-lg text-center mt-20">Loading dashboard...</p>;

  if (!user) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <p className="text-red-600 text-lg mb-4">Unauthorized or session expired.</p>
      <button onClick={() => router.push("/register")} className="px-5 py-2 bg-blue-600 text-white rounded-lg">
        Go to Signup
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user.UserFullName} 👋</h1>
        <p className="text-gray-700 mb-2"><strong>Email:</strong> {user.EmailAddress}</p>

        <button
          onClick={async () => {
            destroyCookie(null, "userAuthToken");
            router.push("/login");
          }}
          className="bg-primary text-white px-5 py-2 rounded-lg mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
