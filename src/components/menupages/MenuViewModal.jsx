"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function MenuViewModal({ data, onClose, backendUrl }) {
  /* ================= LOCK BACKGROUND SCROLL ================= */
  useEffect(() => {
    if (data) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [data]);

  if (!data) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center
                 bg-black/70 backdrop-blur-sm"
    >
      {/* MODAL */}
      <div
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl
                   max-h-[85vh] overflow-y-auto mx-4"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-bold">Menu Details</h2>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Menu:</strong>
              <p>{data.MenuName}</p>
            </div>

            <div>
              <strong>Status:</strong>
              <p className={data.IsActive ? "text-green-600" : "text-red-600"}>
                {data.IsActive ? "Active" : "Inactive"}
              </p>
            </div>

            <div>
              <strong>Title:</strong>
              <p>{data.Title || "-"}</p>
            </div>

            <div>
              <strong>Sort Order:</strong>
              <p>{data.SortOrder}</p>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div>
            <h3 className="font-semibold mb-2">Hero Image</h3>
            {data.HeroImage ? (
              <img
                src={`${backendUrl}/images/menu/${data.HeroImage}`}
                className="w-full h-72 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 rounded">
                No Image Available
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: data.Description || "<p>-</p>",
              }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
