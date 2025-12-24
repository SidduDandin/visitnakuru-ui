"use client";

import { useState, useMemo } from "react";
import EventViewModal from "./EventViewModal";
import { formatEventDate } from "@/components/events/dateUtils";

export default function EventTable({
  events = [],
  loading,
  onEdit,
  onDelete,
}) {
  const [viewEvent, setViewEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  /* ================= FILTER ================= */
  const filteredEvents = useMemo(() => {
    return events.filter((e) =>
      e.Title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  /* ================= PAGINATION ================= */
  const totalItems = filteredEvents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  const showingFrom = totalItems === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(endIndex, totalItems);

  return (
    <>
      <EventViewModal event={viewEvent} onClose={() => setViewEvent(null)} />

      {/* FILTER BAR */}
      <div className="flex justify-between items-center mb-6">
        <select
          className="border border-gray-300 hover:border-gray-300 rounded px-3 py-2 text-sm"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={10}>Show 10</option>
          <option value={25}>Show 25</option>
          <option value={50}>Show 50</option>
        </select>

        <input
          className="border border-gray-300 hover:border-gray-300 rounded px-3 py-2 text-sm w-64"
          placeholder="Search events..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  Loading…
                </td>
              </tr>
            ) : paginatedEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            ) : (
              paginatedEvents.map((event) => {
                const images = event.images || [];
                const cover =
                  images.find((i) => i.IsCover) || images[0];

                return (
                  <tr key={event.EventID} className="border-t border-b border-gray-300">
                    {/* IMAGE */}
                    <td className="px-4 py-4">
                      {cover ? (
                        <img
                          src={`${backendUrl}/images/events/${cover.FilePath}`}
                          className="w-20 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">
                          No Image
                        </div>
                      )}
                    </td>

                    {/* TITLE */}
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {event.Title}
                    </td>

                    {/* DATE */}
                    <td className="px-4 py-4">
                      {formatEventDate(event.StartDate, event.EndDate)}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
                      {event.Status === 1 && (
                        <span className="text-orange-500">Pending</span>
                      )}
                      {event.Status === 5 && (
                        <span className="text-green-600">Active</span>
                      )}
                      {event.Status === 7 && (
                        <span className="text-red-600">Blocked</span>
                      )}
                      {event.Status === 9 && (
                        <span className="text-red-500">Expired</span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => setViewEvent(event)}
                        >
                          View
                        </button>

                        {event.Status !== 9 && event.Status !== 7 && (
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                            onClick={() => onEdit(event.EventID)}
                          >
                            Edit
                          </button>
                        )}

                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this event?")) {
                              onDelete(event.EventID);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION (ALWAYS VISIBLE – LIKE ADMIN PACKAGES) */}
      <div className="flex justify-between items-center mt-6 text-sm">
        <p className="text-gray-500">
          Showing {showingFrom} to {showingTo} of {totalItems || 1}
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
    </>
  );
}
