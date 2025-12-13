"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import ExploreForm from "@/components/explore/ExploreForm";

export default function EditExplorePage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const { authToken } = parseCookies();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${backendUrl}/api/explore/${id}`, {
          headers: { "x-auth-token": authToken },
        });
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        setData(json);     
      } catch {
        router.push("/admin/explore");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl">
      <ExploreForm
        backendUrl={backendUrl}
        authToken={authToken}
        editingExplore={data}
        onExploreUpdated={() => router.push("/admin/explore")}
        onExploreAdded={() => {}}
        onError={(m) => console.error(m)}
        handleAuthError={() => router.push("/admin/login")}
        onCancel={() => router.push("/admin/explore")}
      />
    </div>
  );
}
