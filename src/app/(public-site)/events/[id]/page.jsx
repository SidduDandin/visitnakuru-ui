"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useParams, useRouter } from "next/navigation";
import EventForm from "@/components/events/EventForm";

export default function EditEventPage() {
  const params = useParams();
  const id = params?.id;

  const { userAuthToken } = parseCookies();
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return; // ⛔ prevent undefined fetch

    const loadEvent = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${backendUrl}/api/events/partner/${id}`,
          {
            headers: {
              "x-auth-token": userAuthToken,
            },
          }
        );

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
           router.push("/login");
          return;
        }

        const data = await res.json();

        // ✅ support both response shapes
        const eventData = data.event || data;

        if (!eventData) {
          throw new Error("Invalid event data");
        }

        setEvent(eventData);
      } catch (err) {
        console.error("Edit event load error:", err);
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, backendUrl, userAuthToken, router]);

  // ================= UI STATES =================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading event…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push("/events")}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) return null;

  // ================= FORM =================
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
