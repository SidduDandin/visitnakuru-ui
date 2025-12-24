"use client";

import { formatEventDate } from "@/components/events/dateUtils";

export default function EventViewModal({ event, onClose }) {
  if (!event) return null;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const images = event.images || [];
  const cover =
    images.find((img) => img.IsCover === true) || images[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
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
              value={event.IsSignature ? "Signature Event" : "Partner Event"}
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
            <Detail label="Venue" value={event.Venue} />
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
              value={formatEventDate(event.StartDate, event.EndDate)}
            />
           
          </div>

          {/* IMAGE */}
          {cover && (
            <div>
              <p className="font-semibold mb-2">Image</p>
              <img
                src={`${backendUrl}/images/events/${cover.FilePath}`}
                className="w-64 h-40 object-cover rounded border"
              />
            </div>
          )}

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
