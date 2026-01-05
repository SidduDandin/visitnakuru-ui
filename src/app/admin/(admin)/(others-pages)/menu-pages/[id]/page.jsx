"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useParams, useRouter } from "next/navigation";
import MenuForm from "@/components//menupages/MenuForm";

export default function EditMenuPage() {
  const { id } = useParams();
  const router = useRouter();
  const { authToken } = parseCookies();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const [menu, setMenu] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/menu-pages/${id}`, {
      headers: { "x-auth-token": authToken },
    })
      .then((res) => res.json())
      .then(setMenu);
  }, [id]);

  if (!menu) return null;

  return (
    <MenuForm
      backendUrl={backendUrl}
      authToken={authToken}
      menu={menu}
      onCancel={() => router.push("/admin/menu-pages")}
      handleAuthError={() => router.push("/login")}
    />
  );
}
