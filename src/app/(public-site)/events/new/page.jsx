"use client";

import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import EventForm from "@/components/events/EventForm";

export default function AddEventPage() {
  const { userAuthToken } = parseCookies();
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-6">
    <EventForm
      backendUrl={backendUrl}
      authToken={userAuthToken}
      editingEvent={null}
      onCancel={() => router.push("/events")}
      mode="partner"
      handleAuthError={() => router.push("/login")}
    />
    </div>
  );
}
