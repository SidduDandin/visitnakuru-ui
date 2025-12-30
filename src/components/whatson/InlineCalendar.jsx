"use client";

import { useState } from "react";

/* ✅ SAFE LOCAL DATE FORMATTER */
function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function InlineCalendar({ filters, setFilters }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [current, setCurrent] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const selectedDate = filters.startDate
    ? new Date(filters.startDate + "T00:00:00")
    : null;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function isSameDate(d1, d2) {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  function selectDate(day) {
    const selected = new Date(year, month, day);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) return;

    const localDate = formatLocalDate(selected);

    setFilters((f) => ({
      ...f,
      startDate: localDate,
      endDate: localDate,
      quick: "",
    }));
  }

  return (
    <div className="mt-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          className="px-2 text-lg"
        >
          ‹
        </button>

        <span className="font-semibold">
          {current.toLocaleString("en-US", { month: "long" })} {year}
        </span>

        <button
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          className="px-2 text-lg"
        >
          ›
        </button>
      </div>

      {/* WEEKDAYS */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay)
          .fill(null)
          .map((_, i) => (
            <div key={i} />
          ))}

        {days.map((d) => {
          const date = new Date(year, month, d);
          date.setHours(0, 0, 0, 0);

          const isPast = date < today;
          const isToday = isSameDate(date, today);
          const isSelected = isSameDate(date, selectedDate);

          return (
            <button
              key={d}
              disabled={isPast}
              onClick={() => selectDate(d)}
              className={`py-1 rounded text-sm transition
                ${
                  isPast
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-yellow-100"
                }
                ${
                  isToday
                    ? "border border-yellow-500 font-semibold"
                    : ""
                }
                ${
                  isSelected
                    ? "bg-yellow-500 text-white"
                    : ""
                }
              `}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
