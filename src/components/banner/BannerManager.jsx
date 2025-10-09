'use client';

import React, { useState, useEffect } from "react";
import { parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import AddBannerForm from "./AddBannerForm";
import BannerTable from "./BannerTable";
import Button from "../ui/button/Button";

export default function BannerManager() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";
  const router = useRouter();

  const [banners, setBanners] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [view, setView] = useState("list");
  const { authToken } = parseCookies();

  // Handle invalid token
  const handleAuthError = () => {
    destroyCookie(null, "authToken");
    destroyCookie(null, "isAdmin");
    router.push("/admin/login");
  };

  // Fetch banners
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/banners`, {
        headers: { "x-auth-token": authToken || "" },
      });
      if (res.status === 401) {
        handleAuthError();
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch banners.");
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto-clear status messages
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Handlers
  const handleAddClick = () => {
    setEditingBanner(null);
    setView("form");
  };

  const handleEditClick = (banner) => {
    setEditingBanner(banner);
    setView("form");
  };

  const handleBackToList = () => {
    fetchBanners();
    setView("list");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Loading banners...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded shadow-md">
      {status && (
        <div
          className={`p-3 mb-4 text-sm rounded-lg ${
            status.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </div>
      )}

      {view === "list" ? (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddClick}>Add New Banner</Button>
          </div>
          <BannerTable
            banners={banners}
            backendUrl={backendUrl}
            onEditClick={handleEditClick}
            onBannerDeleted={() => {
              setStatus("Banner deleted successfully!");
              fetchBanners();
            }}
            onError={(message) => setStatus(message)}
            handleAuthError={handleAuthError}
          />
        </>
      ) : (
        <AddBannerForm
          backendUrl={backendUrl}
          authToken={authToken}
          editingBanner={editingBanner}
          setEditingBanner={setEditingBanner}
          onBannerAdded={() => {
            setStatus("Banner added successfully!");
            handleBackToList();
          }}
          onBannerUpdated={() => {
            setStatus("Banner updated successfully!");
            handleBackToList();
          }}
          onError={(message) => setStatus(message)}
          handleAuthError={handleAuthError}
          onCancel={handleBackToList}
        />
      )}
    </div>
  );
}
