"use client";

import { useParams, useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from "nookies";
import { useEffect, useState } from "react";
import EventForm from "@/components/events/EventForm";

export default function AdminEventFormPage() {
  const params = useParams();
  const router = useRouter();

  const { authToken } = parseCookies();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const eventId = params?.id;
  const isNew = eventId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [editingEvent, setEditingEvent] = useState(null);

  // ======================================================
  // AUTH ERROR HANDLER (same pattern as Explore Nakuru)
  // ======================================================
  const handleAuthError = () => {
    destroyCookie(null, "authToken");
    destroyCookie(null, "isAdmin");
    router.push("/admin/login");
  };

  // ======================================================
  // LOAD EVENT FOR EDIT MODE
  // ======================================================
  useEffect(() => {
    if (!authToken) {
      handleAuthError();
      return;
    }

    if (!isNew) {
      setLoading(true);

      fetch(`${backendUrl}/api/events/admin/${eventId}`, {
        headers: {
          "x-auth-token": authToken,
        },
      })
        .then(async (res) => {
          if (res.status === 401) {
            handleAuthError();
            return null;
          }
          if (!res.ok) {
            throw new Error(await res.text());
          }
          return res.json();
        })
        .then((data) => {
          if (data?.event) {
            setEditingEvent(data.event);
          }
        })
        .catch((err) => {
          console.error("Failed to load event:", err);
          router.push("/admin/events");
        })
        .finally(() => setLoading(false));
    }
  }, [eventId]);

  // ======================================================
  // UI STATES
  // ======================================================
  if (loading) {
    return (
      <div className="p-6">
        <p>Loading event…</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <EventForm
        backendUrl={backendUrl}
        authToken={authToken}
        editingEvent={editingEvent}
        router={router}
        handleAuthError={handleAuthError}
        onCancel={() => router.push("/admin/events")}
      />
    </div>
  );
}
