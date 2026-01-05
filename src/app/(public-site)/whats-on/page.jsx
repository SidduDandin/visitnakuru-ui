"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import FiltersSidebar from "@/components/whatson/FiltersSidebar";
import EventGrid from "@/components/whatson/EventGrid";
import Pagination from "@/components/whatson/Pagination";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function WhatsOnPage() {
  const [menuPage, setMenuPage] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

 const [filters, setFilters] = useState({
  search: "",
  quick: "",
  startDate: "",
  endDate: "",
  locationIds: [],   // ✅ array of IDs
  categoryIds: [],  // ✅ array of IDs
});


  /* ===============================
     LOAD MENU PAGE (HERO)
  =============================== */
  useEffect(() => {
    fetch(`${backendUrl}/api/events/menu-pages/public/whats-on`)
      .then(res => res.json())
      .then(setMenuPage);
  }, []);

  /* ===============================
     FETCH EVENTS
  =============================== */
  useEffect(() => {
    async function loadEvents() {
      setLoading(true);

      const params = new URLSearchParams({
  page: pagination.page.toString(),
  limit: "9",
});

if (filters.search) params.append("search", filters.search);
if (filters.quick) params.append("quick", filters.quick);
if (filters.startDate) params.append("startDate", filters.startDate);
if (filters.endDate) params.append("endDate", filters.endDate);

filters.locationIds.forEach(id =>
  params.append("locationIds", id)
);

filters.categoryIds.forEach(id =>
  params.append("categoryIds", id)
);


      const res = await fetch(
        `${backendUrl}/api/events/public?${params.toString()}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      setEvents(data.events || []);
      setPagination({
        page: Number(data.pagination?.page || 1),
        totalPages: Number(data.pagination?.totalPages || 1),
        totalItems: Number(data.pagination?.totalItems || 0),
      });

      setLoading(false);
    }

    loadEvents();
  }, [filters, pagination.page]);

function cleanEditorHtml(html = "") {
  return html
    // remove empty paragraphs
    .replace(/<p>\s*<\/p>/gi, "")
    // remove multiple <br>
    .replace(/(<br\s*\/?>\s*){2,}/gi, "<br>")
    // normalize spacing between paragraphs
    .replace(/<\/p>\s*<p>/gi, "</p><p>")
    .trim();
}

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function truncateText(text, limit = 420) {
  return text.length > limit ? text.slice(0, limit) + "…" : text;
}


  /* ===============================
     HERO IMAGE
  =============================== */
  const heroImage = menuPage?.HeroImage
    ? `${backendUrl}/images/menu/${menuPage.HeroImage}`
    : null;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO IMAGE */}
      {heroImage && (
        <div className="relative w-full">
          <img
            src={heroImage}
            alt={menuPage?.Title || "What's On"}
            className="w-full h-auto block"
          />
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white">
        <div className="container mx-auto py-8">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            | <span className="text-gray-700"> What’s On</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            {menuPage?.Title || "What’s On"}
          </h1>

         {menuPage?.Description && (
  <div className="text-gray-700 leading-relaxed text-justify">
    {!showFullDesc ? (
      <>
        <p>
          {truncateText(stripHtml(menuPage.Description), 420)}
        </p>

        {stripHtml(menuPage.Description).length > 420 && (
          <button
            onClick={() => setShowFullDesc(true)}
            className="mt-6 inline-block bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
          >
            Read More
          </button>
        )}
      </>
    ) : (
      <>
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{
            __html: cleanEditorHtml(menuPage.Description),
          }}
        />

        <button
          onClick={() => setShowFullDesc(false)}
          className="mt-6 inline-block text-gray-800 underline hover:text-black"
        >
          Read Less
        </button>
      </>
    )}
  </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto py-10">

        {/* TOP BAR */}
        <div className="grid grid-cols-12 items-center mb-6">
          <div className="col-span-12 md:col-span-3">
            <h2 className="text-lg font-semibold">Filter By</h2>
          </div>

          <div className="col-span-12 md:col-span-9 flex justify-end">
            <Pagination
              pagination={pagination}
              setPage={(page) =>
                setPagination(p => ({ ...p, page }))
              }
            />
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-12 gap-6 items-start">

          <aside className="col-span-12 md:col-span-3">
            <FiltersSidebar
              filters={filters}
              setFilters={(next) => {
                setPagination(p => ({ ...p, page: 1 }));
                setFilters(next);
              }}
            />
          </aside>

          <main className="col-span-12 md:col-span-9">
            {loading ? (
              <p className="text-center py-24">Loading events…</p>
            ) : (
              <>
                <EventGrid events={events} />

                <div className="flex justify-end mt-10">
                  <Pagination
                    pagination={pagination}
                    setPage={(page) =>
                      setPagination(p => ({ ...p, page }))
                    }
                  />
                </div>
              </>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
