'use client';

import React, { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import ReactDOM from "react-dom";

export default function PartnerTable({
  partners,
  backendUrl,
  onPartnerUpdated,
  onPartnerDeleted,
  onError,
  handleAuthError,
}) {
  const { authToken } = parseCookies();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentPartners = partners.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(partners.length / rowsPerPage);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, partners]);

  // Approve / Reject
  const handleApprove = async (partnerId, status) => {
    try {
      const res = await fetch(`${backendUrl}/api/partners/${partnerId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authToken || "",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        if (res.status === 401) return handleAuthError();
        throw new Error("Failed to update partner status");
      }
      onPartnerUpdated();
    } catch (err) {
      onError(err.message);
    }
  };

  // Delete
  const handleDelete = async (partnerId) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      try {
        const res = await fetch(`${backendUrl}/api/partners/${partnerId}`, {
          method: "DELETE",
          headers: { "x-auth-token": authToken || "" },
        });

        if (!res.ok) {
          if (res.status === 401) return handleAuthError();
          throw new Error("Failed to delete partner");
        }
        onPartnerDeleted();
      } catch (err) {
        onError(err.message);
      }
    }
  };

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Business Name</th>
              <th className="px-6 py-3">Category</th>
              {/* <th className="px-6 py-3">Contact</th> */}
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Reg Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPartners.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No partners found
                </td>
              </tr>
            ) : (
              currentPartners.map((partner) => (
                <tr key={partner.PartnerID} className="border-b">
                  <td className="px-6 py-4">{partner.BusinessName}</td>
                  <td className="px-6 py-4">{partner.Category}</td>
                  {/* <td className="px-6 py-4">
                    {partner.ContactPerson}
                    <br />
                    <span className="text-xs">{partner.Email}</span>
                  </td> */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        partner.Status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : partner.Status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {partner.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(partner.CreatedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      View
                    </button>
                    {partner.Status !== "Approved" && (
                      <button
                        onClick={() => handleApprove(partner.PartnerID, "Approved")}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Approve
                      </button>
                    )}
                    {partner.Status !== "Rejected" && (
                      <button
                        onClick={() => handleApprove(partner.PartnerID, "Rejected")}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(partner.PartnerID)}
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
          {Math.min(indexOfLast, partners.length)} of {partners.length}
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

      {/* Partner Details Modal */}
     {selectedPartner &&
  ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-5xl mx-4 my-10 overflow-y-auto max-h-[85vh] transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Business Details
          </h2>
          <button
            onClick={() => setSelectedPartner(null)}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition"
          >
            Close
          </button>
        </div>

        {/* Premium Summary Card */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 shadow-md mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Reuse all fields: BusinessName, Category, Subcategory, ContactPerson, Email, Phone, PhysicalAddress, MapLink, OperatingHours, Status */}
            {/* Code omitted here for brevity, reuse previous summary card code */}
            {/* Business Name */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v13h20V7L12 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Business Name</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPartner.BusinessName}</p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPartner.Category}</p>
              </div>
            </div>

            {/* Subcategory */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-full">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sub Category</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPartner.Subcategory || "N/A"}</p>
              </div>
            </div>

            {/* Contact Person */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-800 rounded-full">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.67 0 8 1.34 8 4v4H4v-4c0-2.66 5.33-4 8-4zm0-2a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contact Person</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPartner.ContactPerson}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-800 rounded-full">
                <svg className="w-6 h-6 text-red-600 dark:text-red-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{selectedPartner.Email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-800 rounded-full">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.35.27 2.67.76 3.88a1 1 0 0 1-.21 1.11l-2.43 2.8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPartner.Phone}</p>
              </div>
            </div>

            {/* Physical Address */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-100 dark:bg-teal-800 rounded-full">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPartner.PhysicalAddress || "N/A"}</p>
              </div>
            </div>

            {/* Map Link */}
            {selectedPartner.MapLink && (
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-800 rounded-full">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Map Link</p>
                  <a href={selectedPartner.MapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    View Map
                  </a>
                </div>
              </div>
            )}

            {/* Operating Hours */}
            {selectedPartner.OperatingHours && (
              <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-100 dark:bg-pink-800 rounded-full">
                  <svg className="w-6 h-6 text-pink-600 dark:text-pink-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 20a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm.5-13h-1v6l5.25 3.15.5-.86-4.75-2.79z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Operating Hours</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPartner.OperatingHours}</p>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedPartner.Status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : selectedPartner.Status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedPartner.Status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Short Description */}
        {selectedPartner.ShortDescription && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Short Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{selectedPartner.ShortDescription}</p>
          </div>
        )}

        {/* Full Description */}
        {selectedPartner.FullDescription && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Full Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{selectedPartner.FullDescription}</p>
          </div>
        )}

        {/* Documents Section */}
        {selectedPartner.Documents?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedPartner.Documents.map((doc, i) => {
                const fileUrl = `${BASE_URL}/${doc.FilePath}`;
                const isPDF = fileUrl.toLowerCase().endsWith(".pdf");
                return (
                  <div
                    key={i}
                    className="relative border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition group"
                  >
                    {isPDF ? (
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-6">
                        <img src="/icons/pdf-icon.png" alt="PDF Document" className="w-16 h-16 mb-2" />
                        <span className="text-xs text-blue-600 dark:text-blue-400 hover:underline text-center">View PDF</span>
                      </a>
                    ) : (
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={fileUrl}
                          alt="Document"
                          className="w-full h-40 object-cover transform transition group-hover:scale-105"
                        />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Photos Section */}
        {selectedPartner.Photos?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedPartner.Photos.map((photo, i) => (
                <a
                  key={i}
                  href={`${BASE_URL}/${photo.FilePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg group"
                >
                  <img
                    src={`${BASE_URL}/${photo.FilePath}`}
                    alt="Partner Photo"
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold text-sm">
                    View
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {selectedPartner.Videos?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedPartner.Videos.map((video, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-lg group">
                  <video
                    src={`${BASE_URL}/${video.FilePath}`}
                    controls
                    className="w-full rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold text-sm">
                    Play
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )}



    </div>
  );
}
