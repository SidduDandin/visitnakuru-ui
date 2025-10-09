"use client";

import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear the admin authentication cookies
    destroyCookie(null, "authToken", { path: "/" });
    destroyCookie(null, "isAdmin", { path: "/" });

    // Redirect to admin login page
    router.push("/admin/login");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-xl font-bold">Logging out of admin...</h1>
    </div>
  );
}
