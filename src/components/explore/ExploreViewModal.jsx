"use client";

import React from "react";

export default function ExploreViewModal({ data, onClose, backendUrl }) {
  if (!data) return null;

  const imgUrl =
    data.bannerImage?.startsWith("http")
      ? data.bannerImage
      : `${backendUrl}/images/Explore//${data.bannerImage}`;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 my-10 max-h-[85vh] overflow-y-auto transform transition-all duration-300 scale-100">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold dark:text-white">Explore Nakuru Details</h3>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Information Card */}
        <div className="border rounded-lg divide-y divide-gray-100 dark:divide-gray-700 dark:text-gray-300">

          {/* Top Information Section */}
          <div className="p-4 space-y-3">

            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">Title:</span>
              <span className="text-gray-900 dark:text-white text-right font-semibold">
                {data.title}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">URL:</span>
              <span className="text-gray-900 dark:text-white text-right">
                {data.slug || "--"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">Created Date:</span>
              <span className="text-gray-900 dark:text-white text-right">
                {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "--"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">Updated Date:</span>
              <span className="text-gray-900 dark:text-white text-right">
                {data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "--"}
              </span>
            </div>

          </div>

          {/* Banner Image */}
          <div className="p-4">
            <h4 className="font-semibold text-lg mb-3 dark:text-white">Image</h4>

            {imgUrl ? (
              <img
                src={imgUrl}
                alt="banner"
                className="object-cover rounded-lg border"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No image available</p>
            )}
          </div>

          {/* Short Description */}
          <div className="p-4">
            <h4 className="font-semibold text-lg mb-2 dark:text-white">Short Description</h4>
            <p className="dark:text-gray-400 whitespace-pre-wrap">{data.shortDesc}</p>
          </div>

          {/* Full Description */}
          <div className="p-4">
            <h4 className="font-semibold text-lg mb-2 dark:text-white">Full Description</h4>
            <div
              className="dark:text-gray-400 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
