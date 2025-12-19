import { Suspense } from "react";
import EventsClient from "./new/EventsClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading events…</div>}>
      <EventsClient />
    </Suspense>
  );
}