"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/button/Button";
import EventViewModal from "./EventViewModal";
import { formatEventDate } from "./dateUtils";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function EventListTable({
  events = [],
  isLoading = false,
  onApprove,
  onBlock,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [viewEvent, setViewEvent] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // ======================================================
  // SUCCESS MESSAGE HANDLING (EXPLORE STYLE)
  // ======================================================
  useEffect(() => {
    if (searchParams.get("added")) {
      setSuccessMsg("Event added successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
    if (searchParams.get("updated")) {
      setSuccessMsg("Event updated successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
    if (searchParams.get("deleted")) {
      setSuccessMsg("Event deleted successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    }

    if (
      searchParams.get("added") ||
      searchParams.get("updated") ||
      searchParams.get("deleted")
    ) {
      // remove query params after showing message
      setTimeout(() => {
      router.replace("/admin/events");
      }, 1500);
    }
    
  }, [searchParams]);

  // ======================================================
  // FILTER
  // ======================================================
  const filtered = useMemo(() => {
    return events.filter((e) =>
      e.Title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  // ======================================================
  // DELETE CONFIRM
  // ======================================================
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

      {/* HEADING */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Manage Events
        </h1>
        <p className="text-sm text-gray-500">
          Create, edit, delete and manage events
        </p>
      </div>

      
      {/* CARD */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* SUCCESS MESSAGE */}
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
       <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"><h2 className="text-2xl font-bold mb-4 dark:text-white">List of Events</h2>
        {/* FILTER BAR */}
        <div className="flex justify-between mb-6">
          <select className="border rounded px-3 py-2 text-sm">
            <option>Show 10</option>
            <option>Show 25</option>
            <option>Show 50</option>
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No events found.
                  </td>
                </tr>
              ) : (
                filtered.map((event) => {
                  const images = event.images || event.eventImages || [];
                  const cover =
                    images.find((img) => img.IsCover === true) || images[0];

                  return (
                    <tr key={event.EventID} className="border-t">
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
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {event.Title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {event.partner?.BusinessName || "Admin"}
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="px-4 py-4">
                        {formatEventDate(event.StartDate, event.EndDate)}
                      </td>

                      {/* TYPE */}
                      <td className="px-4 py-4">
                        {event.IsSignature ? (
                          <span className="text-purple-600 font-semibold">
                            Signature
                          </span>
                        ) : (
                          <span className="text-blue-600">Regular</span>
                        )}
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

                          {event.Status !== 9 && (
  <button
    className="bg-blue-500 text-white px-3 py-1 rounded"
    onClick={() => router.push(`/admin/events/${event.EventID}`)}
  >
    Edit
  </button>
)}

                          {!event.IsSignature && event.Status === 1 && (
                            <button
                              className="bg-indigo-500 text-white px-3 py-1 rounded"
                              onClick={() => onApprove(event.EventID)}
                            >
                              Approve
                            </button>
                          )}

                          {!event.IsSignature && event.Status !== 7 && (
                            <button
                              className="bg-yellow-500 text-white px-3 py-1 rounded"
                              onClick={() => onBlock(event.EventID)}
                            >
                              Block
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
      </div>
      </div>
    </>
  );
}
