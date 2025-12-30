"use client";

import InlineCalendar from "./InlineCalendar";

export default function FiltersSidebar({ filters, setFilters }) {
  return (
    <aside className="bg-white rounded-xl shadow p-6 sticky top-6">
      {/* TITLE */}
      {/* <h2 className="text-lg font-semibold mb-6 border-b pb-3">
        Filter By
      </h2> */}

      {/* KEYWORD */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Keyword
        </label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Search events"
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
        />
      </div>

      {/* QUICK FILTERS */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-3">Quick Filters</p>
        <div className="grid grid-cols-2 gap-2">
          {["day", "week", "weekend", "month", "year"].map((q) => (
            <button
              key={q}
              onClick={() =>
                setFilters((f) => ({ ...f, quick: q }))
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
        <p className="text-sm font-medium mb-3">Dates</p>
        <InlineCalendar filters={filters} setFilters={setFilters} />
      </div>

      {/* LOCATION */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Location
        </label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Venue / City"
          value={filters.location}
          onChange={(e) =>
            setFilters((f) => ({ ...f, location: e.target.value }))
          }
        />
      </div>
    </aside>
  );
}
