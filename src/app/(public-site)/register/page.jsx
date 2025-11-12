"use client";

import Signup from "@/components/account/Signup";
import { useEffect, useState } from "react";
import { parseCookies, destroyCookie } from "nookies";

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
          router.push("/login");
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

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6">
      <Signup />
    </div>
  );
}