import Image from "next/image";
import Link from "next/link";
import EventImageSlider from "@/components/event/EventImageSlider";
import EventMeta from "@/components/event/EventMeta";
import EventContent from "@/components/event/EventContent";
import EventSidebar from "@/components/event/EventSidebar";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function generateMetadata({ params }) {
  const res = await fetch(
    `${backendUrl}/api/events/public/${params.slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return {};

  const { event } = await res.json();

  return {
    title: event.Title,
    description: event.ShortDesc,
  };
}

export default async function EventDetailsPage({ params }) {
  const res = await fetch(
    `${backendUrl}/api/events/public/${params.slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <p className="py-20 text-center">Event not found</p>;
  }

  const { event } = await res.json();

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HERO IMAGE */}
     <EventImageSlider
  images={event.images}
  title={event.Title}
/>

      {/* WHITE HEADER */}
      <div className="bg-white">
        <div className="container mx-auto py-8">

          {/* BREADCRUMB */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:underline">Home</Link> /{" "}
            <Link href="/whats-on" className="hover:underline">What’s On</Link> /{" "}
            <span className="text-gray-700">{event.Title}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {event.Title}
          </h1>

          {event.ShortDesc && (
            <p className="max-w-3xl text-gray-600">
              {event.ShortDesc}
            </p>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto py-10 grid grid-cols-12 gap-10">
        <main className="col-span-12 md:col-span-8">
          <EventMeta event={event} />
          <EventContent event={event} />
        </main>

        <aside className="col-span-12 md:col-span-4">
          <EventSidebar event={event} />
        </aside>
      </div>
    </div>
  );
}
