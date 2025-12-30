import { formatEventDateRange } from "@/lib/whatsonDate";

export default function EventMeta({ event }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <p className="text-sm text-gray-600 mb-2">
        📅 {formatEventDateRange(event.StartDate, event.EndDate)}
      </p>

      {event.Venue && (
        <p className="text-sm text-gray-600 mb-2">
          📍 {event.Venue}
        </p>
      )}

      {event.Category && (
        <p className="text-sm text-gray-600">
          🏷 {event.Category}
        </p>
      )}
    </div>
  );
}
