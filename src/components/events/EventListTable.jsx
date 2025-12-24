"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/button/Button";
import EventViewModal from "./EventViewModal";
import { formatEventDate } from "./dateUtils";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function EventListTable({
  events = [],
  loading = false,
  onApprove,
  onBlock,
  onDelete,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [viewEvent, setViewEvent] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  /* ================= SUCCESS MESSAGE ================= */
  useEffect(() => {
    if (searchParams.get("added")) setSuccessMsg("Event added successfully");
    if (searchParams.get("updated")) setSuccessMsg("Event updated successfully");
    if (searchParams.get("deleted")) setSuccessMsg("Event deleted successfully");

    if (successMsg) {
      setTimeout(() => {
        setSuccessMsg("");
        router.replace("/admin/events");
      }, 2000);
    }
  }, [searchParams]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return events.filter((e) =>
      e.Title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  /* ================= PAGINATION ================= */
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const startItem =
    totalItems === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, totalItems);

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage, search]);

  /* ================= DELETE ================= */
  const confirmDelete = (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    onDelete(id);
  };

  return (
    <>
      {/* VIEW MODAL */}
      <EventViewModal
        data={viewEvent}
        onClose={() => setViewEvent(null)}
        backendUrl={backendUrl}
      />

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Events</h1>
        <p className="text-sm text-gray-500">
          Create, edit, delete and manage events
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {successMsg && (
          <div className="mb-4 bg-green-100 text-green-800 px-4 py-3 rounded">
            {successMsg}
          </div>
        )}

        {/* ADD BUTTON */}
        <div className="flex justify-end mb-4">
          <Button onClick={() => router.push("/admin/events/new")}>
            Add Signature Event
          </Button>
        </div>

        <div className="shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">List of Events</h2>

          {/* FILTER BAR */}
          <div className="flex justify-between mb-4">
            <select
              className="border rounded px-3 py-2 text-sm"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value={10}>Show 10</option>
              <option value={25}>Show 25</option>
              <option value={50}>Show 50</option>
            </select>

            <input
              className="border rounded px-3 py-2 text-sm w-64"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  <th className="px-4 py-3">Event Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      Loading…
                    </td>
                  </tr>
                ) : paginatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      No events found.
                    </td>
                  </tr>
                ) : (
                  paginatedEvents.map((event) => {
                    const images = event.images || [];
                    const cover =
                      images.find((img) => img.IsCover) || images[0];

                    return (
                      <tr key={event.EventID} className="border-t">
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

                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">
                            {event.Title}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          {formatEventDate(event.StartDate, event.EndDate)}
                        </td>

                        <td className="px-4 py-4">
                         {event.IsSignature ? ( <span className="text-purple-600 font-semibold"> Signature </span> ) : ( <span className="text-blue-600">Regular</span> )}
                        </td>

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
                                onClick={() =>
                                  router.push(`/admin/events/${event.EventID}`)
                                }
                              >
                                Edit
                              </button>
                            )}

                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded"
                              onClick={() => confirmDelete(event.EventID)}
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

          {/* PAGINATION BAR (ALWAYS SHOWN) */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <p className="text-gray-500">
              Showing {startItem} to {endItem} of {totalItems}
            </p>

            <div className="flex items-center gap-2">
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
        </div>
      </div>
    </>
  );
}
