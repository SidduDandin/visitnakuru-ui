"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import FiltersSidebar from "@/components/whatson/FiltersSidebar";
import EventGrid from "@/components/whatson/EventGrid";
import Pagination from "@/components/whatson/Pagination";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function WhatsOnPage() {
  const heroLoadedRef = useRef(false);

  const [heroEvent, setHeroEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    quick: "",
    startDate: "",
    endDate: "",
    location: "",
  });

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
      if (filters.location) params.append("location", filters.location);
      if (filters.quick) params.append("quick", filters.quick);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const res = await fetch(
        `${backendUrl}/api/events/public?${params.toString()}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      /* EVENTS */
      setEvents(Array.isArray(data.events) ? data.events : []);

      /* PAGINATION (THIS FIXES YOUR ISSUE) */
     setPagination({
  page: Number(data.pagination?.page || 1),
  totalPages: Number(data.pagination?.totalPages || 1),
  totalItems: Number(data.pagination?.totalItems || 0),
});


      /* HERO EVENT — LOAD ONCE ONLY */
      if (!heroLoadedRef.current && data.events?.length) {
        setHeroEvent(data.events[0]);
        heroLoadedRef.current = true;
      }

      setLoading(false);
    }

    loadEvents();
  }, [
    pagination.page,
    filters.search,
    filters.quick,
    filters.startDate,
    filters.endDate,
    filters.location,
  ]);

  /* ===============================
     HERO IMAGE
  =============================== */
  const heroImage =
    heroEvent?.images?.find((i) => i.IsCover)?.FilePath ||
    heroEvent?.images?.[0]?.FilePath;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= HERO IMAGE ================= */}
      {heroImage && (
         <div className="relative w-full">
               <img
                 src={`${backendUrl}/images/events/${heroImage}`}
                 alt="/frontend/images/placeholder.jpg"                
                 width={1920}
                 height={1080}               
                 className="w-full h-auto block"
               />
          </div>
      )}

      {/* ================= WHITE HEADER SECTION ================= */}
      <div className="bg-white">
        <div className="container mx-auto py-8">
          {/* BREADCRUMB */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            | <span className="text-gray-700"> What’s On</span>
          </nav>

          {/* HEADING */}
          <h1 className="text-3xl md:text-4xl font-bold mb-9">
            What’s On in Nakuru
          </h1>

          {/* SHORT DESCRIPTION */}
          {heroEvent?.ShortDesc && (
            <p className="max-w-3xl text-gray-600">
              {heroEvent.ShortDesc}
            </p>
          )}
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
     {/* ================= MAIN CONTENT ================= */}
<div className="container mx-auto py-10">

  {/* TOP BAR (Filter title + pagination) */}
  <div className="grid grid-cols-12 items-center mb-6">
    <div className="col-span-12 md:col-span-3">
      <h2 className="text-lg font-semibold">
        Filter By
      </h2>
    </div>

    <div className="col-span-12 md:col-span-9 flex justify-end">
      <Pagination
        pagination={pagination}
        setPage={(page) =>
          setPagination((prev) => ({ ...prev, page }))
        }
      />
    </div>
  </div>

  {/* CONTENT GRID */}
  <div className="grid grid-cols-12 gap-6 items-start">
    
    {/* FILTER SIDEBAR */}
    <aside className="col-span-12 md:col-span-3">
      <FiltersSidebar
        filters={filters}
        setFilters={(next) => {
          setPagination((p) => ({ ...p, page: 1 }));
          setFilters(next);
        }}
      />
    </aside>

    {/* EVENT LIST */}
    <main className="col-span-12 md:col-span-9">
      {loading ? (
        <p className="text-center py-24">Loading events…</p>
      ) : (
        <>
        
          <EventGrid events={events} />

          {/* BOTTOM PAGINATION */}
          <div className="flex justify-end mt-10">
            <Pagination
              pagination={pagination}
              setPage={(page) =>
                setPagination((prev) => ({ ...prev, page }))
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
