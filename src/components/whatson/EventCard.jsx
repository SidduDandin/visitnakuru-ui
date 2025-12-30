import Image from "next/image";
import Link from "next/link";
import { formatEventDateRange } from "@/lib/whatsonDate";

export default function EventCard({ event }) {
  const cover =
    event.images?.find((i) => i.IsCover) || event.images?.[0];

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition">
      <div className="relative h-52">
        <Image
          src={
            cover
              ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/images/events/${cover.FilePath}`
              : "/frontend/images/placeholder.png"
          }
          alt={event.Title}
          fill
          className="object-cover rounded-t-xl"
        />
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-lg mb-1">
          {event.Title}
        </h4>

        <p className="text-sm text-gray-600 mb-1">
          {formatEventDateRange(event.StartDate, event.EndDate)}
        </p>

        {event.Venue && (
          <p className="text-sm text-gray-500 mb-2">
            📍 {event.Venue}
          </p>
        )}

        <p className="text-sm mb-4 line-clamp-3">
          {event.ShortDesc}
        </p>

        <div className="flex gap-3 mb-5">
          <Link
            href={`/event/${event.Slug}`}
            className="text-yellow-500 font-medium"
          >
            More details →
          </Link>

          
        </div>
        <div className="gap-3">
          {event.BookingLink && (
            <a
              href={event.BookingLink}
              target="_blank"
              className="ml-auto bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Book Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
