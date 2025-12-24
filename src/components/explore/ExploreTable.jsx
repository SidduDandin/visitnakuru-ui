"use client";

import React, { useState, useMemo, useEffect } from "react";

export default function ExploreTable({
  explores = [],
  backendUrl,
  authToken,
  onDeleted,
  onEdit,
  onView,
  handleAuthError,
  isLoading,
}) {
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return explores;
    return explores.filter(
      (i) =>
        (i.title || "").toLowerCase().includes(q) ||
        (i.slug || "").toLowerCase().includes(q)
    );
  }, [explores, search]);

  /* ================= PAGINATION ================= */
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const startItem =
    totalItems === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, totalItems);

  useEffect(() => {
    setPage(1);
  }, [search, rowsPerPage]);

  /* ================= DELETE ================= */
  const deleteExplore = async (id) => {
    if (!confirm("Are you sure you want to delete this Explore Nakuru page?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/explore/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": authToken },
      });
      if (res.status === 401) return handleAuthError();
      if (!res.ok) throw new Error("Delete failed");
      onDeleted();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">
        List of Explore Nakuru
      </h2>

      {/* FILTER BAR */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <select
            className="border rounded p-2 text-sm"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={10}>Show 10</option>
            <option value={25}>Show 25</option>
            <option value={50}>Show 50</option>
          </select>
        </div>

        <div>
          <input
            className="border p-2 rounded text-sm"
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="p-3 border-b">Image</th>
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">URL</th>
              <th className="p-3 border-b">Created At</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No pages found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">
                    {item.bannerImage && (
                      <img
                        src={`${backendUrl}/images/Explore/${item.bannerImage}`}
                        alt={item.title}
                        className="w-20 h-16 object-cover rounded-lg"
                      />
                    )}
                  </td>
                  <td className="p-3 align-top">{item.title}</td>
                  <td className="p-3 align-top">{item.slug}</td>
                  <td className="p-3 align-top">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => onView(item)}
                      >
                        View
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => deleteExplore(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION (SAME STYLE AS ADMIN) */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <p className="text-gray-500">
          Showing {startItem} to {endItem} of {totalItems}
        </p>

        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
