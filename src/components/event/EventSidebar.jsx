export default function EventSidebar({ event }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 sticky top-24">
      <h3 className="text-lg font-semibold mb-4">
        Event Information
      </h3>

      {event.BookingLink && (
        <a
          href={event.BookingLink}
          target="_blank"
          className="block w-full text-center bg-yellow-500 text-white py-3 rounded font-semibold mb-4"
        >
          Book Now
        </a>
      )}

      {event.Website && (
        <a
          href={event.Website}
          target="_blank"
          className="block text-center border py-3 rounded font-medium"
        >
          Visit Website
        </a>
      )}
    </div>
  );
}
