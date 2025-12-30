"use client";

import { useEffect, useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function WhatsOnCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/api/events/public`)
      .then((r) => r.json())
      .then((d) => setEvents(d.events));
  }, []);

  return (
    <section className="py-16">
      <div className="container">
        <h1 className="text-3xl font-bold mb-6">Events Calendar</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((e) => (
            <div key={e.EventID} className="border p-4 rounded">
              <strong>{e.Title}</strong>
              <p className="text-sm text-gray-500">
                {new Date(e.StartDate).toDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
