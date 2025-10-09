"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

// Helper: Get cookie
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function NewsletterList() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination + search
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      const token = getCookie("authToken");
      const res = await fetch(`${backendUrl}/api/newslettersubscriber`, {
        headers: { "x-auth-token": token },
      });

      if (!res.ok) throw new Error("Failed to fetch subscribers");
      const data = await res.json();
      setSubscribers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete single subscriber
  const deleteSubscriber = async (id) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;
    await deleteSubscribers([id]);
  };

  // Bulk delete subscribers
  const deleteSubscribers = async (ids) => {
    if (!ids || ids.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${ids.length} subscriber(s)?`)) return;

    try {
      const token = getCookie("authToken");
      const res = await fetch(`${backendUrl}/api/newslettersubscriber`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) throw new Error("Failed to delete subscribers");

      const updatedSubscribers = subscribers.filter(s => !ids.includes(s.NLSubID));
      setSubscribers(updatedSubscribers);
      setSelectedIds([]); // Clear selections after deletion
      setSelectAll(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle single checkbox
  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  // Toggle "Select All" checkbox
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const allFilteredIds = filteredSubscribers.map(s => s.NLSubID);
      setSelectedIds(allFilteredIds);
    }
    setSelectAll(!selectAll);
  };

  // Export all emails to Excel
  const exportToExcel = () => {
    const data = subscribers.map(s => ({ "Email Address": s.EmailAddress }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subscribers");
    XLSX.writeFile(workbook, "newsletter_subscribers.xlsx");
  };

  // ✅ Call all useEffect hooks unconditionally at the top level
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter((s) =>
    s.EmailAddress.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ This hook must also be called unconditionally before any early returns
  useEffect(() => {
    const allFilteredIds = filteredSubscribers.map(s => s.NLSubID);
    const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [selectedIds, subscribers, search, filteredSubscribers]);

  // Conditional early returns must come AFTER all hooks
  if (loading) return <p>Loading subscribers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentSubscribers = filteredSubscribers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSubscribers.length / rowsPerPage);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-lg"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-lg w-full md:w-1/3"
        />

        <div className="flex gap-2">
          <button
            onClick={() => deleteSubscribers(selectedIds)}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Selected ({selectedIds.length})
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Subscription Date</th>
            </tr>
          </thead>
          <tbody>
            {currentSubscribers.length > 0 ? (
              currentSubscribers.map((s) => (
                <tr
                  key={s.NLSubID}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(s.NLSubID)}
                      onChange={() => toggleSelect(s.NLSubID)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">{s.EmailAddress}</td>
                  <td className="px-6 py-4">
                    {new Date(s.createdAt)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "/")}
                  </td>
                  {/* <td className="px-6 py-4">
                    <button
                      onClick={() => deleteSubscriber(s.NLSubID)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No subscribers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {indexOfFirst + 1} to{" "}
          {Math.min(indexOfLast, filteredSubscribers.length)} of{" "}
          {filteredSubscribers.length} subscribers
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}