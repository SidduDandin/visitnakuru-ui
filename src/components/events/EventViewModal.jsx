"use client";

import React from "react";

export default function EventViewModal({ data, onClose, backendUrl }) {
  if (!data) return null;

    const coverImage =
    data.images?.find((img) => img.IsCover) || data.images?.[0];

    const imageUrl = coverImage
    ? `${backendUrl}/images/events/${coverImage.FilePath}`
    : null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 my-10 max-h-[85vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Event Details</h3>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>

        {/* INFO CARD */}
        <div className="border rounded-lg divide-y">

          {/* BASIC INFO */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Title:</span>
              <span className="font-semibold">{data.Title}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Event Type:</span>
              <span>
                {data.IsSignature ? "Signature Event" : "Regular Event"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Status:</span>
              <span>
                {data.Status === 1 && "Pending"}
                {data.Status === 5 && "Active"}
                {data.Status === 7 && "Blocked"}
                {data.Status === 9 && "Expired"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Venue:</span>
              <span>{data.Venue || "-"}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Booking Link:</span>
              <span>{data.BookingLink || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Date:</span>
              <span>
                {data.StartDate
                  ? new Date(data.StartDate).toLocaleDateString()
                  : "--"}
                {data.EndDate &&
                  ` - ${new Date(data.EndDate).toLocaleDateString()}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Created By:</span>
              <span>{data.partner?.BusinessName || "Admin"}</span>
            </div>
          </div>

          {/* IMAGE */}
          <div className="p-4">
            <h4 className="font-semibold mb-3">Image</h4>

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={data.Title}
                className="object-cover rounded-lg border max-h-72"
              />
            ) : (
              <p className="text-gray-500">No image available</p>
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
