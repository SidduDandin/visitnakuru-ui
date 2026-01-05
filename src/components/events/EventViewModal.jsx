"use client";

import React from "react";

export default function EventViewModal({ data, onClose, backendUrl }) {
  if (!data) return null;

  const images = Array.isArray(data.images) ? data.images : [];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 my-10 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Event Details</h3>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>

        <div className="border rounded-lg divide-y">

          {/* BASIC INFO */}
          <div className="p-4 space-y-3">
            <InfoRow label="Title" value={data.Title} />
            <InfoRow
              label="Event Type"
              value={data.IsSignature ? "Signature" : "Regular"}
            />
            <InfoRow
              label="Status"
              value={
                data.Status === 1
                  ? "Pending"
                  : data.Status === 5
                  ? "Active"
                  : data.Status === 7
                  ? "Blocked"
                  : "Expired"
              }
            />
        
         <InfoRow
  label="Category"
  value={data.category?.Name || "-"}
/>
 <InfoRow label="Venue" value={data.Venue || "-"} />
<InfoRow
  label="Location"
  value={data.location?.Name || "-"}
/>
           
            <InfoRow label="Booking Link" value={data.BookingLink || "-"} />
            <InfoRow
              label="Date"
              value={`${formatEventRange(data.StartDate)}${
                data.EndDate ? ` - ${formatEventRange(data.EndDate)}` : ""
              }`}
            />
            <InfoRow
              label="Created By"
              value={data.partner?.BusinessName || "Admin"}
            />
          </div>

          {/* IMAGES GRID */}
          <div className="p-4">
            <h4 className="font-semibold mb-4">Event Images</h4>

            {images.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img) => (
                  <div
                    key={img.ImageID}
                    className="relative border rounded-lg overflow-hidden group"
                  >
                    <img
                      src={`${backendUrl}/images/events/${img.FilePath}`}
                      alt={data.Title}
                      className="w-full h-40 object-cover"
                    />

                    {img.IsCover && (
                      <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No images available</p>
            )}
          </div>

          {/* SHORT DESC */}
          <div className="p-4">
            <h4 className="font-semibold mb-2">Short Description</h4>
            <p className="whitespace-pre-wrap text-gray-700">
              {data.ShortDesc}
            </p>
          </div>

          {/* FULL DESC */}
          <div className="p-4">
            <h4 className="font-semibold mb-2">Full Description</h4>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: data.Description,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   HELPERS
================================ */
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function formatEventRange(date) {
  if (!date) return "";

  const startDate = new Date(date);
  const endDate = date ? new Date(date) : null;

  const format = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
      timeZone: "UTC",
    });

  // If range and dates differ
  if (endDate && startDate.toDateString() !== endDate.toDateString()) {
    return `${format(startDate)} - ${format(endDate)}`;
  }

  // Single-day event
  return format(startDate);
}
