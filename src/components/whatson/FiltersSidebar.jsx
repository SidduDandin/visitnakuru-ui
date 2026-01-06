"use client";

import { useEffect, useState } from "react";
import InlineCalendar from "./InlineCalendar";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function FiltersSidebar({ filters, setFilters }) {
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/api/events/public/filters`)
      .then(res => res.json())
      .then(data => {
        setLocations(data.locations || []);
        setCategories(data.categories || []);
      });
  }, []);

  const toggle = (key, id) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(id)
        ? f[key].filter(x => x !== id)
        : [...f[key], id],
    }));
  };

return (
  <aside className="bg-white rounded-xl shadow p-6 sticky top-6">

    {/* KEYWORD (NO TOP BORDER) */}
    <div className="mb-6">
      <div className="pb-3 mb-4">
        <span className="block font-semibold mb-0">
          Keyword
        </span>
      </div>

      <input
        className="w-full border border-gray-300 rounded px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-yellow-400"
        placeholder="Search events"
        value={filters.search}
        onChange={(e) =>
          setFilters(f => ({ ...f, search: e.target.value }))
        }
      />
    </div>

    {/* QUICK FILTERS */}
    <div className="mb-6">
      <div className="-mx-6 px-6 py-3 mb-4 border-y border-gray-200">
        <p className="font-semibold mb-0">Quick Filters</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {["day", "week", "weekend", "month", "year"].map(q => (
          <button
            key={q}
            onClick={() =>
              setFilters(f => ({ ...f, quick: q }))
            }
            className={`text-sm py-2 rounded border transition
              ${
                filters.quick === q
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-white border-gray-300 hover:bg-gray-100"
              }
            `}
          >
            {q.toUpperCase()}
          </button>
        ))}
      </div>
    </div>

    {/* DATES */}
    <div className="mb-6">
      <div className="-mx-6 px-6 py-3 mb-4 border-y border-gray-200">
        <p className="font-semibold mb-0">Dates</p>
      </div>

      <InlineCalendar filters={filters} setFilters={setFilters} />
    </div>

    {/* LOCATIONS */}
    <div className="mb-6">
      <div className="-mx-6 px-6 py-3 mb-4 border-y border-gray-200">
        <p className="font-semibold mb-0">Locations</p>
      </div>

      {locations.map(loc => (
        <label
          key={loc.LocationID}
          className="flex items-center gap-2 mb-2"
        >
          <input
            type="checkbox"
            checked={filters.locationIds.includes(loc.LocationID)}
            onChange={(e) => {
              setFilters(f => ({
                ...f,
                locationIds: e.target.checked
                  ? [...f.locationIds, loc.LocationID]
                  : f.locationIds.filter(id => id !== loc.LocationID),
              }));
            }}
          />
          <span className="text-sm">
            {loc.Name} ({loc._count.events})
          </span>
        </label>
      ))}
    </div>

    {/* CATEGORIES */}
    <div>
      <div className="-mx-6 px-6 py-3 mb-4 border-y border-gray-200">
        <p className="font-semibold mb-0">Categories</p>
      </div>

      {categories.map(c => (
      <label
  key={c.CategoryID}
  className="flex items-center justify-between gap-2 py-1 cursor-pointer"
>
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={filters.categoryIds.includes(c.CategoryID)}
      onChange={(e) => {
        setFilters((f) => ({
          ...f,
          categoryIds: e.target.checked
            ? [...f.categoryIds, c.CategoryID]
            : f.categoryIds.filter((id) => id !== c.CategoryID),
        }));
      }}
    />

    <span className="text-sm whitespace-nowrap">
      {c.Name}
    </span>
  </div>

  <span className="text-sm whitespace-nowrap">
    ({c._count.events})
  </span>
</label>
      ))}
    </div>

  </aside>
);
}
