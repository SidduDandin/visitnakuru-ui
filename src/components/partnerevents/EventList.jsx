"use client";

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
