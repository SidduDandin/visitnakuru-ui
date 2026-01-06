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
        <div className="top-contents">
          <h2 className="mb-5 pr-14">What&apos;s On</h2>
        </div>

        <div className="whatson-slider-outer relative">
          <div className="whatson-slider swiper swiper-lg-4 swiper-md-2">
            <div className="swiper-wrapper">
              {events.map((event) => {
                const images = event.images || [];
                const cover =
                  images.find((i) => i.IsCover) || images[0];

                const imageSrc = cover
                  ? `${backendUrl}/images/events/${cover.FilePath}`
                  : "/frontend/images/placeholder-event.png";

                return (
                  <div className="swiper-slide" key={event.EventID}>
                    <div className="relative md:pb-[140%] pb-[100%] overflow-hidden mb-5">
                      <Image
                        src={imageSrc}
                        alt={event.Title}
                        width={270}
                        height={370}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />

                      <div className="bg-secondary px-2 py-1 text-white absolute bottom-0 left-[50%] transform -translate-x-1/2 leading-[1.2] text-center max-w-100% break-all whitespace-pre-line">
                        {formatEventRange(
                          event.StartDate,
                          event.EndDate
                        )}
                      </div>
                    </div>

                    <h5 className="mb-4">{event.Title}</h5>

                    <div className="description mb-2">
                      <p>
                        {event.ShortDesc ||
                          event.Description?.replace(
                            /<[^>]*>/g,
                            ""
                          ).slice(0, 80) + "..."}
                      </p>
                    </div>

                    <Link
                      href={`/events/${event.Slug}`}
                      className="text-primary"
                    >
                      Read More
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SLIDER NAVIGATION (UNCHANGED) */}
          <div
            className="absolute md:-top-9 -top-7 right-0 w-auto h-auto transform -translate-y-full flex gap-8"
            style={{ "--swiper-navigation-size": "30px" }}
          >
            <div className="swiper-button-prev !relative !text-primary">
              <svg
                width="18"
                height="15"
                viewBox="0 0 18 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.97776 14L2 7.55372M2 7.55372L7.97776 1M2 7.55372H18"
                  stroke="currentcolor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="swiper-button-next !relative !text-primary">
              <svg
                width="18"
                height="15"
                viewBox="0 0 18 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0222 14L16 7.55372M16 7.55372L10.0222 1M16 7.55372H0"
                  stroke="currentcolor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
