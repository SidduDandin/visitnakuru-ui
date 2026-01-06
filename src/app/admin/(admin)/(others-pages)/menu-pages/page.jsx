"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import MenuList from "@/components/menupages/MenuList";

export default function AdminMenuPages() {
  const { authToken } = parseCookies();
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/admin/menu-pages`, {
          headers: { "x-auth-token": authToken },
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();

        // ✅ PRODUCTION-SAFE
        setMenus(Array.isArray(data) ? data : data?.data ?? []);
      } catch (err) {
        console.error("Failed to load menu pages:", err);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, [backendUrl, authToken, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading menu pages…
      </div>
    );
  }

  return (
    <MenuList
      menus={menus}
      onEdit={(id) => router.push(`/admin/menu-pages/${id}`)}
    />
  );
}
