import Link from "next/link";
import EventImageSlider from "@/components/event/EventImageSlider";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

/* ICON COMPONENT */
function Icon({ children }) {
  return (
    <span className="w-5 h-5 inline-flex items-center justify-center text-gray-700">
      {children}
    </span>
  );
}

export default async function EventDetailsPage({ params }) {
  const res = await fetch(
    `${backendUrl}/api/events/public/${params.slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <p className="py-20 text-center">Event not found</p>;
  }

  const { event, relatedEvents = [] } = await res.json();
  const partner = event.partner;

  return (
    <>
   
 <div className="bg-white min-h-screen">

      {/* ================= HEADER ================= */}
      <section className="bg-gray-100">
        <div className="container mx-auto px-4 py-6">

          <Link href="/whats-on" className="text-sm font-semibold hover:underline">
            ← Back to previous
          </Link>

          <h1 className="text-3xl md:text-4xl font-semibold mt-3">
            {event.Title}
          </h1>

          <div className="mt-6 grid grid-cols-12 gap-8 items-start">

            {/* IMAGE */}
            <div className="col-span-12 md:col-span-9">
              <EventImageSlider images={event.images} />
            </div>

            {/* BUSINESS DETAILS */}
            <aside className="col-span-12 md:col-span-3 space-y-4">

              {/* <div className="flex items-center gap-2">
                <Icon>🤍</Icon>
                <span>Add to Trip</span>
              </div> */}

              {partner?.Website && (
                <a
                  href={partner.Website}
                  target="_blank"
                  className="flex items-center gap-3"
                >
                  <Icon>🌐</Icon>
                 <span className="font-semibold hover:underline">Visit Website</span>
                </a>
              )}

              {partner?.Address && (
                <div className="flex items-start gap-3">
                  <Icon>📍</Icon>
                  <span className="font-semibold">{partner.Address}</span>
                </div>
              )}

              {partner?.Phone && (
                <div className="flex items-center gap-3">
                  <Icon>📞</Icon>
                  <span className="font-semibold">{partner.Phone}</span>
                </div>
              )}

              {event.BookingLink && (
                <a
                  href={event.BookingLink}
                  target="_blank"
                  className="mt-4 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded font-semibold"
                >
                  🎟 Book Now
                </a>
              )}

              {/* <div className="flex gap-4 pt-2 text-sm font-semibold">
                {partner?.FacebookLink && <a href={partner.FacebookLink}>Facebook</a>}
                {partner?.InstagramLink && <a href={partner.InstagramLink}>Instagram</a>}
                {partner?.XLink && <a href={partner.XLink}>X</a>}
              </div> */}
            </aside>
          </div>
        </div>
      </section>

      {/* ================= DESCRIPTION ================= */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
        
          {event.ShortDesc && (
            <p className="text-gray-700 font-semibold">
              {event.ShortDesc}
            </p>
          )}

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: event.Description }}
          />
        </div>
      </section>

      {/* ================= DATES ================= */}
      <section className="bg-white">
        <div className="container mx-auto px-4">
          <h3 className="font-semibold mb-2">Dates</h3>
          <p>
            {new Date(event.StartDate).toDateString()}
            {event.EndDate && ` – ${new Date(event.EndDate).toDateString()}`}
          </p>
        </div>
      </section>

      {/* ================= MAP ================= */}
      {partner?.MapLink && (
        <section className="bg-white mb-8">
          <div className="container mx-auto px-4 py-6">
            <h3 className="font-semibold mb-3">Map</h3>
            <iframe
              src={partner.MapLink}
              className="w-full h-96 rounded border border-gray-100"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* ================= RELATED EVENTS ================= */}
      {relatedEvents.length > 0 && (
        <section className="bg-white">
          <div className="container mx-auto px-4 py-8">
            <h3 className="font-semibold mb-6">Related Events</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((e) => (
                <Link
                  key={e.EventID}
                  href={`/event/${e.Slug}`}
                  className="block border border-gray-100 rounded overflow-hidden hover:shadow"
                >
                  <img
                    src={`${backendUrl}/images/events/${e.images?.[0]?.FilePath}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-medium">{e.Title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
    
    
    </>
   
  );
}
