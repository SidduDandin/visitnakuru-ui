'use client';

import React, { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import PartnerTable from "./PartnerTable";

export default function PartnerManager() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const { authToken } = parseCookies();

  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const handleAuthError = () => {
    alert("Session expired. Please login again.");
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/partners`, {
        headers: { "x-auth-token": authToken || "" },
      });

      if (!res.ok) {
        if (res.status === 401) return handleAuthError();
        throw new Error("Failed to fetch partners");
      }

      const data = await res.json();
      setPartners(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter + Search Logic
  useEffect(() => {
    let filtered = partners.filter((p) => p.Status === activeTab);

    if (categoryFilter !== "All") {
      filtered = filtered.filter((p) => p.Category === categoryFilter);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.BusinessName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPartners(filtered);
  }, [partners, activeTab, categoryFilter, searchTerm]);

  useEffect(() => {
    fetchPartners();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(partners.map((p) => p.Category))).filter(Boolean),
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      {error && (
        <div className="text-red-500 mb-3 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-2 mb-4">
        {["Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-md font-medium ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by business name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full sm:w-1/3"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      <PartnerTable
        partners={filteredPartners}
        backendUrl={backendUrl}
        onPartnerUpdated={fetchPartners}
        onPartnerDeleted={fetchPartners}
        onError={setError}
        handleAuthError={handleAuthError}
      />
    </div>
  );
}
