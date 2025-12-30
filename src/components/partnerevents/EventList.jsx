"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EventTable from "./EventTable";

export default function EventList({
  events,
  loading,
  onAdd,
  onEdit,
  onDelete,
  isSubscriptionExpired,
  eventCount,
}) {

  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
  if (searchParams.get("added")) {
    setSuccessMsg("Event added successfully");
  } else if (searchParams.get("updated")) {
    setSuccessMsg("Event updated successfully");
  } else if (searchParams.get("deleted")) {
    setSuccessMsg("Event deleted successfully");
  }
}, [searchParams]);

useEffect(() => {
  if (!successMsg) return;

  const timer = setTimeout(() => {
    setSuccessMsg("");
    router.replace("/events");
  }, 2000);

  return () => clearTimeout(timer);
}, [successMsg, router]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Events</h1>
          <p className="text-sm text-gray-500">
            Create, edit, delete and manage events
          </p>
        </div>

        {/* ⭐ ADD EVENT BUTTON */}
        <button
          onClick={onAdd}
          disabled={isSubscriptionExpired}
          title={
            isSubscriptionExpired
              ? "Subscription expired. Please renew to add events."
              : "Add new event"
          }
          className={`btn font-semibold py-3 rounded transition flex items-center gap-2
            ${
              isSubscriptionExpired
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "btn-primary text-white hover:opacity-90"
            }`}
        >
          <span>Add Event</span>

          {/* EVENT COUNT BADGE */}
          <span
            className={`text-xs px-2 py-0.5 rounded-full
              ${
                isSubscriptionExpired
                  ? "bg-gray-400 text-white"
                  : "bg-white text-primary"
              }`}
          >
            {eventCount ?? 0}
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {successMsg && (
          <div className="mb-4 bg-green-100 text-green-800 px-4 py-3 rounded">
            {successMsg}
          </div>
        )}
        <h2 className="text-xl font-bold mb-4">List of Events</h2>

        <EventTable
          events={events}
          loading={loading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
