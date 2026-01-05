"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useParams, useRouter } from "next/navigation";
import EventForm from "@/components/events/EventForm";

export default function EventPage() {
  const params = useParams();
  const router = useRouter();

  const { userAuthToken } = parseCookies();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const id = params?.id;
  const isEdit = id && id !== "new";

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");

  /* ================= FETCH EVENT (EDIT ONLY) ================= */
  useEffect(() => {
    if (!isEdit) return;

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
          throw new Error("Failed to load event");
        }

        const data = await res.json();
        const eventData = data.event || data;

        if (!eventData?.EventID) {
          throw new Error("Invalid event data");
        }

        setEvent(eventData);
      } catch (err) {
        console.error("Load event error:", err);
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [isEdit, id, backendUrl, userAuthToken, router]);

  /* ================= UI STATES ================= */

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

  /* ================= FORM ================= */

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-6">
      <EventForm
        backendUrl={backendUrl}
        authToken={userAuthToken}
        editingEvent={isEdit ? event : null}   // 🔥 KEY FIX
        onCancel={() => router.push("/events")}
        mode="partner"
        handleAuthError={() => router.push("/login")}
      />
    </div>
  );
}
