"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from "nookies";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeBusinessTab, setActiveBusinessTab] = useState("active");
  const [activePackageTab, setActivePackageTab] = useState("active");

  const router = useRouter();
  const { userAuthToken } = parseCookies();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!userAuthToken) {
        router.push("/register");
        return;
      }

      try {
        // Fetch user info
        const resUser = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/dashboard`,
          { method: "GET", headers: { "x-auth-token": userAuthToken || "" } }
        );

        if (resUser.status === 401) {
          destroyCookie(null, "userAuthToken");
          router.push("/register");
          return;
        }

        const userData = await resUser.json();
        if (resUser.ok) setUser(userData.user);

        // Fetch businesses
        const resBusiness = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/business/my-list`,
          { headers: { "x-auth-token": userAuthToken || "" } }
        );
        if (resBusiness.ok) setBusinesses(await resBusiness.json());

        // Fetch packages
        const resPackages = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/packages/my-packages`,
          { headers: { "x-auth-token": userAuthToken || "" } }
        );
        if (resPackages.ok) setPackages(await resPackages.json());
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router, userAuthToken]);

  if (loading)
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <p className="text-gray-500 animate-pulse text-lg">
          Loading dashboard...
        </p>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600 text-lg mb-4">
          Unauthorized or session expired.
        </p>
        <button
          onClick={() => router.push("/register")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Signup
        </button>
      </div>
    );

  // Stats
  const totalBusinesses = businesses.length || 0;
  const totalPackages = packages.length || 0;

  // Dummy records
  const dummyActiveBusinesses = 2;
  const dummyInProgressBusinesses = 3;
  const dummyActivePackages = 3;
  const dummyExpiredPackages = 1;
  const dummyUpcomingPackages = 2;

  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-gray-900 text-gray-100"
          : "min-h-screen bg-gray-50 text-gray-800"
      }
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.UserFullName}</h1>
          {/* <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? "🌞" : "🌙"}
            </button>
            <button
              onClick={() =>
                destroyCookie(null, "userAuthToken") || router.push("/register")
              }
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-lg shadow text-white">
            <p>Total Businesses</p>
            <h2 className="text-2xl font-bold">{totalBusinesses}</h2>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg shadow text-white">
            <p>Total Packages</p>
            <h2 className="text-2xl font-bold">{totalPackages}</h2>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-lg shadow text-white">
            <p>Pending Payments</p>
            <h2 className="text-2xl font-bold">$0</h2>
          </div>
          <div className="bg-gradient-to-r from-pink-400 to-pink-600 p-6 rounded-lg shadow text-white">
            <p>Active Packges</p>
            <h2 className="text-2xl font-bold">3</h2>
          </div>
        </div>

        {/* Businesses Tabs */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">My Businesses</h2>
          <div className="flex border-b border-gray-300 dark:border-gray-700 mb-4">
            <button
              className={`px-4 py-2 -mb-px font-semibold border-b-2 ${
                activeBusinessTab === "active"
                  ? "border-green-600 text-green-600"
                  : "border-transparent hover:text-green-600"
              }`}
              onClick={() => setActiveBusinessTab("active")}
            >
              Active Businesses ({dummyActiveBusinesses})
            </button>
            <button
              className={`px-4 py-2 -mb-px font-semibold border-b-2 ${
                activeBusinessTab === "in-progress"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent hover:text-yellow-500"
              }`}
              onClick={() => setActiveBusinessTab("in-progress")}
            >
              In-Progress Businesses ({dummyInProgressBusinesses})
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeBusinessTab === "active"
              ? Array(dummyActiveBusinesses).fill(null)
              : Array(dummyInProgressBusinesses).fill(null)
            ).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">
                  {activeBusinessTab === "active"
                    ? `Active Business ${idx + 1}`
                    : `In-Progress Business ${idx + 1}`}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Category: Sample Category
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Created: {new Date().toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Packages Tabs */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">My Packages</h2>
          <div className="flex border-b border-gray-300 dark:border-gray-700 mb-4">
            <button
              className={`px-4 py-2 -mb-px font-semibold border-b-2 ${
                activePackageTab === "active"
                  ? "border-green-600 text-green-600"
                  : "border-transparent hover:text-green-600"
              }`}
              onClick={() => setActivePackageTab("active")}
            >
              Active ({dummyActivePackages})
            </button>
            <button
              className={`px-4 py-2 -mb-px font-semibold border-b-2 ${
                activePackageTab === "expired"
                  ? "border-red-600 text-red-600"
                  : "border-transparent hover:text-red-600"
              }`}
              onClick={() => setActivePackageTab("expired")}
            >
              Expired ({dummyExpiredPackages})
            </button>
            <button
              className={`px-4 py-2 -mb-px font-semibold border-b-2 ${
                activePackageTab === "upcoming"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent hover:text-yellow-500"
              }`}
              onClick={() => setActivePackageTab("upcoming")}
            >
              Upcoming ({dummyUpcomingPackages})
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(
              activePackageTab === "active"
                ? Array(dummyActivePackages).fill(null)
                : activePackageTab === "expired"
                ? Array(dummyExpiredPackages).fill(null)
                : Array(dummyUpcomingPackages).fill(null)
            ).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">
                  {activePackageTab === "active"
                    ? `Active Package ${idx + 1}`
                    : activePackageTab === "expired"
                    ? `Expired Package ${idx + 1}`
                    : `Upcoming Package ${idx + 1}`}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Description: Sample package description
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Price: $99</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Expires: {new Date().toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
