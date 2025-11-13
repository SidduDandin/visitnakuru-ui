'use client';

import React, { useState, useEffect } from "react";
import { parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import AddPackageForm from "./AddPackageForm";
import PackageTable from "./PackageTable";
import Button from "../ui/button/Button"; 

export default function PackageManager() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';
  const router = useRouter();

  const [packages, setPackages] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [view, setView] = useState('list');
  const { authToken } = parseCookies();

 
  const handleAuthError = () => {
    destroyCookie(null, "authToken");
    destroyCookie(null, "isAdmin");
    router.push("/admin/login");
  };

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/packages`, {
        headers: { "x-auth-token": authToken },
      });
      if (res.status === 401) {
        handleAuthError();
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch packages.");
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      setStatus(err.message || 'Error fetching packages.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleAddClick = () => {
    setEditingPackage(null); 
    setView('form');
  };

  const handleEditClick = (pkg) => {
    setEditingPackage(pkg);
    setView('form');
  };

  const handleBackToList = () => {
    fetchPackages(); 
    setView('list');
    setEditingPackage(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded shadow-md dark:bg-gray-800">
      {status && (
        <div
          className={`p-3 mb-4 text-sm rounded-lg ${
            status.includes("successfully") ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
          }`}
        >
          {status}
        </div>
      )}

      {view === 'list' ? (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddClick}>Add New Package</Button>
          </div>
          <PackageTable
            packages={packages}
            backendUrl={backendUrl}
            authToken={authToken}
            onEditClick={handleEditClick}
            onPackageAction={() => {
              setStatus("Package delete successfully!");
              fetchPackages();
            }}
            onError={(message) => setStatus(message)}
            handleAuthError={handleAuthError}
          />
        </>
      ) : (
        <AddPackageForm
          backendUrl={backendUrl}
          authToken={authToken}
          editingPackage={editingPackage}
          setEditingPackage={setEditingPackage}
          onPackageAdded={() => {
            setStatus("Package added successfully!");
            handleBackToList();
          }}
          onPackageUpdated={() => {
            setStatus("Package updated successfully!");
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