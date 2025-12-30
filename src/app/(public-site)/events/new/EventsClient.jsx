// "use client";

// import { parseCookies } from "nookies";
// import { useRouter } from "next/navigation";
// import EventForm from "@/components/events/EventForm";

// export default function AddEventPage() {
//   const { userAuthToken } = parseCookies();
//   const router = useRouter();
//   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-6">
//     <EventForm
//       backendUrl={backendUrl}
//       authToken={userAuthToken}
//       editingEvent={null}
//       onCancel={() => router.push("/events")}
//       mode="partner"
//       handleAuthError={() => router.push("/login")}
//     />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useRouter,useSearchParams } from "next/navigation";
  
import EventList from "@/components/partnerevents/EventList";

export default function PartnerEventsPage() {
  const { userAuthToken } = parseCookies();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const router = useRouter();
   const searchParams = useSearchParams();
  const [successMsg, setSuccessMsg] = useState("");
  const [events, setEvents] = useState([]);
  const [partners, setPartners] = useState([]); // ✅ DEFINE PARTNERS
  const [loading, setLoading] = useState(true);

  // ================= LOAD EVENTS =================
  const loadEvents = async () => {
    const res = await fetch(`${backendUrl}/api/events/partner`, {
      headers: { "x-auth-token": userAuthToken },
    });
    const data = await res.json();
    setEvents(data.events || []);
  };

  // ================= LOAD DASHBOARD (PARTNERS) =================
  const loadDashboard = async () => {
    const res = await fetch(`${backendUrl}/api/users/dashboard`, {
      headers: { "x-auth-token": userAuthToken },
    });
    const data = await res.json();
    setPartners(data.partners || []);
  };

  // ================= INIT =================
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadEvents(), loadDashboard()]);
      setLoading(false);
    })();
  }, []);

  
  // ================= EVENT PARTNER =================
  const eventPartner = partners.find(
    (p) => p.BusinessCategory === "Events and Conferences"
  );

   useEffect(() => {
  if (searchParams.get("added")) {
    setSuccessMsg("Event added successfully");
  } else if (searchParams.get("updated")) {
    setSuccessMsg("Event updated successfully");
  } else if (searchParams.get("deleted")) {
    setSuccessMsg("Event deleted successfully");
  }
}, [searchParams]);

useEffect(() => {
  if (!successMsg) return;

  const timer = setTimeout(() => {
    setSuccessMsg("");
    router.replace("/events");
  }, 2000);

  return () => clearTimeout(timer);
}, [successMsg, router]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <EventList
        events={events}
        loading={loading}
        successMsg={successMsg}
        onAdd={() => router.push("/events/new")}
        onEdit={(id) => router.push(`/events/${id}`)}
        onDelete={async (id) => {
          await fetch(`${backendUrl}/api/events/partner/${id}`, {
            method: "DELETE",
            headers: { "x-auth-token": userAuthToken },
          });
          loadEvents();
        }}
        isSubscriptionExpired={eventPartner?.IsSubscriptionExpired}
        eventCount={eventPartner?.EventCount}
      />
    </div>
  );
}

