"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import MenuList from "@/components/menupages/MenuList";

export default function AdminMenuPages() {
  const { userAuthToken } = parseCookies();
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/admin/menu-pages`, {
          headers: { "x-auth-token": userAuthToken },
        });

        if (res.status === 401) return router.push("/login");
        const data = await res.json();
        setMenus(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, [backendUrl, userAuthToken, router]);

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
