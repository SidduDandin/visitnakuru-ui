import Image from "next/image";
import Link from "next/link";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export function formatEventRange(start, end) {
  if (!start) return "";

  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;

  const format = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
      timeZone: "UTC",
    });

  // If range and dates differ
  if (endDate && startDate.toDateString() !== endDate.toDateString()) {
    return `${format(startDate)} - ${format(endDate)}`;
  }

  // Single-day event
  return format(startDate);
}

/* ✅ SERVER COMPONENT */
export default async function WhatsOn() {
  const res = await fetch(`${backendUrl}/api/events/public`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();

  // ✅ FIX: extract array safely
  const events = Array.isArray(data?.events) ? data.events : [];

  if (!events.length) return null;

  return (
    <div className="md:py-15 pt-8 pb-5 text-black">
      <div className="container">
        <h2 className="mb-5 pr-14">What&apos;s On</h2>

        <div className="whatson-slider swiper swiper-lg-4 swiper-md-2">
          <div className="swiper-wrapper">
            {events.map((event) => {
              const cover =
                event.images?.find((i) => i.IsCover) ||
                event.images?.[0];

              return (
                <div key={event.EventID} className="swiper-slide">
                  <div className="relative md:pb-[140%] pb-[100%] overflow-hidden mb-5">
                    <Image
                      src={
                        cover
                          ? `${backendUrl}/images/events/${cover.FilePath}`
                          : "/frontend/images/placeholder.png"
                      }
                      alt={event.Title}
                      fill
                      className="object-cover"
                    />

                    <div className="bg-secondary px-2 py-1 text-white absolute bottom-0 left-1/2 -translate-x-1/2 text-center whitespace-pre-line">
                      {formatEventRange(event.StartDate, event.EndDate)}
                    </div>
                  </div>

                  <h5 className="mb-4">{event.Title}</h5>
                  <p className="mb-2">{event.ShortDesc}</p>

                  <Link
                    href={`/event/${event.Slug}`}
                    className="text-primary"
                  >
                    Read More
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
