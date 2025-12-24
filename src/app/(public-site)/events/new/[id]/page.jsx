"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useParams, useRouter } from "next/navigation";
import EventForm from "@/components/events/EventForm";

export default function EditEventPage() {
  const { id } = useParams();
  const { userAuthToken } = parseCookies();
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/api/events/partner/${id}`, {
      headers: { "x-auth-token": userAuthToken },
    })
      .then((r) => r.json())
      .then((d) => setEvent(d.event));
  }, [id]);

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-6">
    <EventForm
      backendUrl={backendUrl}
      authToken={userAuthToken}
      editingEvent={event}
      onCancel={() => router.push("/events")}
      mode="partner"
      handleAuthError={() => router.push("/login")}
    />
    </div>
  );
}
