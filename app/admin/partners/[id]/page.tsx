"use client";

import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  type: string;
  url: string;
  status: string;
}

interface Media {
  id: string;
  type: string;
  url: string;
}

interface Application {
  id: string;
  status: string;
  notes?: string;
}

interface PartnerDetail {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  website?: string;
  socialLinks?: string[];
  documents: Document[];
  media: Media[];
  applications: Application[];
}

const fetchPartner = async (id: string): Promise<PartnerDetail> => {
  const res = await fetch(`/api/partner?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch partner");
  return res.json();
};

const updateStatus = async ({
  id,
  status,
}: {
  id: string;
  status: "APPROVED" | "REJECTED" | "REVISION_REQUIRED";
}) => {
  const res = await fetch(`/api/partner?id=${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, reviewedBy: "admin-1" }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};

export default function PartnerDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const queryClient = useQueryClient();

  const { data: partner, isLoading, error } = useQuery<PartnerDetail, Error>({
    queryKey: ["partner", id],
    queryFn: () => fetchPartner(id),
    enabled: !!id,
  });

 const mutation = useMutation<
  any,
  Error,
  { id: string; status: "APPROVED" | "REJECTED" | "REVISION_REQUIRED" }
>({
  mutationFn: updateStatus,
  onSuccess: () => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["partner", id] });
    }
  },
});
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!partner) return <div>No partner found</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{partner.businessName}</h1>
      <div>
        Contact: {partner.contactPerson} ({partner.email}) - {partner.phone}
      </div>
      <div>Category: {partner.category}</div>
      {partner.website && <div>Website: {partner.website}</div>}
      {partner.socialLinks && <div>Social Links: {partner.socialLinks.join(", ")}</div>}

      <div>
        <h2 className="text-lg font-semibold mb-2">Documents</h2>
        <ul className="list-disc ml-6">
          {partner.documents.map((doc) => (
            <li key={doc.id}>
              {doc.type} -{" "}
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                View
              </a>{" "}
              ({doc.status})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Media</h2>
        <ul className="list-disc ml-6">
          {partner.media.map((m) => (
            <li key={m.id}>
              {m.type} -{" "}
              <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                View
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 mt-4">
        <Button className="bg-green-500 text-white" onClick={() => mutation.mutate({ id, status: "APPROVED" })}>
          Approve
        </Button>
        <Button className="bg-red-500 text-white" onClick={() => mutation.mutate({ id, status: "REJECTED" })}>
          Reject
        </Button>
        <Button
          className="bg-yellow-500 text-white"
          onClick={() => mutation.mutate({ id, status: "REVISION_REQUIRED" })}
        >
          Request Revisions
        </Button>
      </div>
    </div>
  );
}
