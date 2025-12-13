"use client";

import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import ExploreForm from "@/components/explore/ExploreForm";

export default function AddExplorePage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const { authToken } = parseCookies();
  const router = useRouter();

  return (
    <div className="max-w-4xl">
      <ExploreForm
        backendUrl={backendUrl}
        authToken={authToken}
        editingExplore={null}
        onExploreAdded={() => router.push("/admin/explore")}
        onExploreUpdated={() => router.push("/admin/explore")}
        onError={(m) => console.error(m)}
        handleAuthError={() => router.push("/admin/login")}
        onCancel={() => router.push("/admin/explore")}
      />
    </div>
  );
}
