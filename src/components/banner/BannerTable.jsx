'use client';

import React, { useState, useEffect } from "react";
import { parseCookies } from "nookies";

// Define the language fields to iterate over
const LANGUAGES = [
  { key: 'en', label: 'English', field: 'BannerTitle_en' },
  { key: 'es', label: 'Spanish', field: 'BannerTitle_es' },
  { key: 'fr', label: 'French', field: 'BannerTitle_fr' },
  { key: 'de', label: 'German', field: 'BannerTitle_de' },
  { key: 'zh', label: 'Chinese', field: 'BannerTitle_zh' },
];

export default function BannerTable({
  banners,
  backendUrl,
  onEditClick,
  onBannerDeleted,
  onError,
  handleAuthError,
}) {
  const { authToken } = parseCookies();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBanner, setSelectedBanner] = useState(null);

  // Delete banner
  const handleDelete = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const res = await fetch(`${backendUrl}/api/admin/banners/${bannerId}`, {
          method: "DELETE",
          headers: { "x-auth-token": authToken || "" },
        });

        if (!res.ok) {
          if (res.status === 401) {
            handleAuthError();
            return;
          }
          throw new Error(`Failed to delete banner: ${res.status}`);
        }
        onBannerDeleted();
      } catch (err) {
        onError(err.message);
      }
    }
  };

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentBanners = banners.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(banners.length / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, banners]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">List of Banners</h2>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="border px-3 py-2 rounded-lg"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {/* Banner Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Updated At</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBanners.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No banners found
                </td>
              </tr>
            ) : (
              currentBanners.map((banner) => (
                <tr key={banner.BannerID} className="border-b">
                  <td className="px-6 py-4">
                    {banner.BannerImage ? (
                      <img
                        src={`${backendUrl}/images/banners/${banner.BannerImage}`}
                        alt="Banner"
                        className="w-32 h-auto rounded-lg shadow-md"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(banner.createdAt)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "/")}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(banner.updatedAt)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "/")}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => setSelectedBanner(banner)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditClick(banner)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner.BannerID)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p>
          Showing {indexOfFirst + 1} to{" "}
          {Math.min(indexOfLast, banners.length)} of {banners.length}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Banner Details Modal */}
      {selectedBanner && (
 <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 overflow-y-auto">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-3xl w-full mx-4">
      <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Banner Details
              </h3>
            </div>

            <div className="border rounded-lg divide-y divide-gray-200 dark:divide-gray-700 max-h-[50vh] overflow-y-auto">
              {/* Image Section */}
              {selectedBanner.BannerImage && (
                <div className="p-4">
                  <img
                    src={`${backendUrl}/images/banners/${selectedBanner.BannerImage}`}
                    alt="Banner"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Title Section (FIX APPLIED HERE) */}
              <div className="p-4 space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Banner Titles</h4>
                
                {LANGUAGES.map(lang => (
                    // Only render if the title for that language exists
                    selectedBanner[lang.field] ? (
                        <div className="flex justify-between" key={lang.key}>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                Title ({lang.label}):
                            </span>
                            <span className="text-gray-900 dark:text-white text-right break-words max-w-[70%]">
                                {selectedBanner[lang.field]}
                            </span>
                        </div>
                    ) : null
                ))}

                {/* Show a message if no titles are available */}
                {
                    !LANGUAGES.some(lang => selectedBanner[lang.field]) && (
                        <div className="text-center text-gray-500 dark:text-gray-400 italic">
                            No titles provided for any language.
                        </div>
                    )
                }
              </div>

              {/* Metadata Section */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Created At:
                  </span>
                  <span className="text-gray-900 dark:text-white text-right">
                    {new Date(selectedBanner.createdAt)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "/")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Last Updated:
                  </span>
                  <span className="text-gray-900 dark:text-white text-right">
                    {new Date(selectedBanner.updatedAt)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "/")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedBanner(null)}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}