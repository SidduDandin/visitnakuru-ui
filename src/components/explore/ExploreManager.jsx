"use client";

import React, { useEffect, useState } from "react";
import { parseCookies, destroyCookie } from "nookies";
import { useRouter, useSearchParams } from "next/navigation";
import ExploreTable from "./ExploreTable";
import ExploreViewModal from "./ExploreViewModal";
import Button from "@/components/ui/button/Button";

export default function ExploreManager() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authToken } = parseCookies();

  const [explores, setExplores] = useState([]);
  const [loading, setLoading] = useState(false);

  // notifications
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [viewItem, setViewItem] = useState(null);

  const handleAuthError = () => {
    destroyCookie(null, "authToken");
    destroyCookie(null, "isAdmin");
    router.push("/admin/login");
  };

  // ======================================================
  // FETCH EXPLORE LIST
  // ======================================================
  const fetchExplores = async (successText = "") => {
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/explore`, {
        headers: { "x-auth-token": authToken },
      });

      if (res.status === 401) return handleAuthError();
      if (!res.ok) throw new Error("Failed to load explore pages");

      const data = await res.json();
      setExplores(data);

      if (successText) {
        setSuccessMessage(successText);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      setErrorMessage("Failed to load explore pages.");
      setTimeout(() => setErrorMessage(""), 3000);
    }

    setLoading(false);
  };

  // ======================================================
  // READ SUCCESS MESSAGE FROM URL (Add / Update)
  // ======================================================
useEffect(() => {
  const added = searchParams.get("added");
  const updated = searchParams.get("updated");

  if (added === "1") {
    fetchExplores("Explore added successfully!");

    // Auto-clear query params after a short delay
    setTimeout(() => {
      router.replace("/admin/explore");
    }, 100);
  } 
  else if (updated === "1") {
    fetchExplores("Explore updated successfully!");

    setTimeout(() => {
      router.replace("/admin/explore");
    }, 100);
  } 
  else {
    fetchExplores();
  }
}, [searchParams]);


  return (
    <div className="container mx-auto bg-white p-6 rounded shadow">

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="p-3 mb-4 text-sm rounded-lg bg-green-100 text-green-700">
          {successMessage}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="p-3 mb-4 text-sm rounded-lg bg-red-100 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* ADD BUTTON */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => router.push("/admin/explore/new")}>
          Add New Explore Nakuru
        </Button>
      </div>

      {/* TABLE */}
      <ExploreTable
        explores={explores}
        backendUrl={backendUrl}
        authToken={authToken}
        isLoading={loading}
        onEdit={(row) => router.push(`/admin/explore/${row.id}`)}
        onView={(row) => setViewItem(row)}
        onDeleted={() => fetchExplores("Explore deleted successfully!")}
        handleAuthError={handleAuthError}
      />

      {/* MODAL */}
      {viewItem && (
        <ExploreViewModal
          data={viewItem}
          backendUrl={backendUrl}
          onClose={() => setViewItem(null)}
        />
      )}
    </div>
  );
}
