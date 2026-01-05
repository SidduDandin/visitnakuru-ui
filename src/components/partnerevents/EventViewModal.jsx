"use client";

import { formatEventRange } from "@/components/events/dateUtils";

export default function EventViewModal({ event, onClose }) {
  if (!event) return null;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

 const images = Array.isArray(event.images) ? event.images : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">Event Details</h2>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">

          {/* BASIC DETAILS */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <Detail label="Title" value={event.Title} />
            <Detail
              label="Event Type"
              value={event.IsSignature ? "Signature Event" : "Regular"}
            />
            <Detail
              label="Status"
              value={
                event.Status === 1
                  ? "Pending"
                  : event.Status === 5
                  ? "Active"
                  : event.Status === 7
                  ? "Blocked"
                  : "Expired"
              }
            />
           
            <Detail label="Category" value={event.category?.Name || "-"} />
             <Detail label="Venue" value={event.Venue} />
             <Detail label="Location" value={event.location?.Name || "-"} />
            <Detail
              label="Booking Link"
              value={
                event.BookingLink ? (
                  <a
                    href={event.BookingLink}
                    target="_blank"
                    className="text-blue-600 underline break-all"
                  >
                    {event.BookingLink}
                  </a>
                ) : (
                  "-"
                )
              }
            />
            <Detail
              label="Date"
              value={formatEventRange(event.StartDate, event.EndDate)}
            />
           
          </div>

            {/* IMAGES GRID */}
          <div className="">
            
            <p className="font-semibold mb-1">Event Images</p>
            {images.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img) => (
                  <div
                    key={img.ImageID}
                    className="relative border rounded-lg overflow-hidden group"
                  >
                    <img
                      src={`${backendUrl}/images/events/${img.FilePath}`}
                      alt={event.Title}
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

          {/* SHORT DESCRIPTION */}
          <div>
            <p className="font-semibold mb-1">Short Description</p>
            <p className="text-gray-700">{event.ShortDesc}</p>
          </div>

          {/* FULL DESCRIPTION */}
          <div>
            <p className="font-semibold mb-1">Full Description</p>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: event.Description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL HELPER ================= */
function Detail({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
