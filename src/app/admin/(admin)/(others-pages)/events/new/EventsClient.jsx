"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useRouter, useSearchParams } from "next/navigation";
import EventListTable from "@/components/events/EventListTable";

export default function EventsClient() {
  const { authToken } = parseCookies();
  const router = useRouter();
  const searchParams = useSearchParams();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const [events, setEvents] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ================= LOAD EVENTS =================
  const load = async (pageNo = page, limit = rowsPerPage) => {
    setLoading(true);

    const res = await fetch(
      `${backendUrl}/api/events/admin?page=${pageNo}&rowsPerPage=${limit}`,
      { headers: { "x-auth-token": authToken } }
    );

    const data = await res.json();
    setEvents(data.events || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [page, rowsPerPage]);

  // ================= SUCCESS MESSAGE =================
  useEffect(() => {
    if (searchParams.get("added")) setSuccessMsg("Event added successfully");
    if (searchParams.get("updated")) setSuccessMsg("Event updated successfully");
    if (searchParams.get("deleted")) setSuccessMsg("Event deleted successfully");

    if (
      searchParams.get("added") ||
      searchParams.get("updated") ||
      searchParams.get("deleted")
    ) {
      setTimeout(() => {
        setSuccessMsg("");
        router.replace("/admin/events");
      }, 2000);
    }
  }, [searchParams]);

  // ================= ACTIONS =================
  const approve = async (id) => {
    await fetch(`${backendUrl}/api/events/admin/${id}/status`, {
      method: "PUT",
      headers: {
        "x-auth-token": authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: 5 }),
    });
    load();
  };

  const block = async (id) => {
    await fetch(`${backendUrl}/api/events/admin/${id}/status`, {
      method: "PUT",
      headers: {
        "x-auth-token": authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: 7 }),
    });
    load();
  };

  const del = async (id) => {
    await fetch(`${backendUrl}/api/events/admin/${id}`, {
      method: "DELETE",
      headers: { "x-auth-token": authToken },
    });

    setEvents((prev) => prev.filter((e) => e.EventID !== id));
    router.replace("/admin/events?deleted=1");
  };

  return (
    <EventListTable
      events={events}
      loading={loading}
      successMsg={successMsg}
      page={page}
      totalPages={totalPages}
      rowsPerPage={rowsPerPage}
      onPageChange={setPage}
      onRowsChange={setRowsPerPage}
      onApprove={approve}
      onBlock={block}
      onDelete={del}
    />
  );
}
