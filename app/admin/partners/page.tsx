"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2, Trash2, Eye } from "lucide-react";

const queryClient = new QueryClient();

type Partner = {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
  documents: string[];
  media: string[];
};

function StatusBadge({ status }: { status: Partner["status"] }) {
  const colors: Record<Partner["status"], string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
      {status}
    </span>
  );
}

function PartnerAdminPageInner() {
  const queryClient = useQueryClient();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [activeTab, setActiveTab] = useState<Partner["status"]>("Pending");

  // Fetch partners
  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ["partners"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch partners");
      }
      return res.json();
    },
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/${id}/approve`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partners"] }),
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partners"] }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partners"] }),
  });

  const filteredPartners = partners.filter((p) => p.status === activeTab);

  return (
    <div className="p-8 min-h-screen">
      <Card className="shadow-lg border bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-700">Partner Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Partner["status"])} className="mb-4">
            <TabsList className="bg-gray-100 rounded-lg flex justify-between">
              <TabsTrigger value="Pending" className="flex-1 text-center">Pending</TabsTrigger>
              <TabsTrigger value="Approved" className="flex-1 text-center">Approved</TabsTrigger>
              <TabsTrigger value="Rejected" className="flex-1 text-center">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <p className="text-gray-500 mt-6 text-center">Loading...</p>
              ) : filteredPartners.length === 0 ? (
                <p className="mt-6 text-center bg-blue-100 text-blue-800 px-4 py-3 rounded inline-block font-semibold">
                  No {activeTab.toLowerCase()} applications
                </p>
              ) : (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full border-collapse border border-gray-200 text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                      <tr>
                        <th className="p-3 border-b">Business</th>
                        <th className="p-3 border-b">Contact</th>
                        <th className="p-3 border-b">Category</th>
                        <th className="p-3 border-b">Status</th>
                        <th className="p-3 border-b text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPartners.map((partner, idx) => (
                        <tr key={partner.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                          <td className="p-3">{partner.businessName}</td>
                          <td className="p-3">{partner.contactPerson}</td>
                          <td className="p-3">{partner.category}</td>
                          <td className="p-3"><StatusBadge status={partner.status} /></td>
                          <td className="p-3 text-center flex flex-wrap gap-2 justify-center">
                            <Button size="sm" variant="outline" onClick={() => setSelectedPartner(partner)}>
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Button>
                            {activeTab === "Pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={() => approveMutation.mutate(partner.id)}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectMutation.mutate({ id: partner.id, reason: "Incomplete docs" })}
                                >
                                  <AlertCircle className="w-4 h-4 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(partner.id)}>
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Partner Details Modal */}
      <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
        <DialogContent className="max-w-xl">
          {selectedPartner && (
            <>
              <DialogHeader>
                <DialogTitle className="text-emerald-700 text-xl font-bold">{selectedPartner.businessName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Contact:</strong> {selectedPartner.contactPerson}</div>
                  <div><strong>Email:</strong> {selectedPartner.email}</div>
                  <div><strong>Phone:</strong> {selectedPartner.phone}</div>
                  <div><strong>Category:</strong> {selectedPartner.category}</div>
                  <div><strong>Status:</strong> <StatusBadge status={selectedPartner.status} /></div>
                  <div><strong>Submitted:</strong> {new Date(selectedPartner.submittedAt).toLocaleString()}</div>
                </div>
                <div>
                  <strong>Documents:</strong>
                  <ul className="list-disc ml-6 text-blue-600">
                    {selectedPartner.documents.map((doc, i) => (
                      <li key={i}><a href={doc} target="_blank" rel="noopener noreferrer">{doc}</a></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Media:</strong>
                  <ul className="list-disc ml-6 text-blue-600">
                    {selectedPartner.media.map((m, i) => (
                      <li key={i}><a href={m} target="_blank" rel="noopener noreferrer">{m}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setSelectedPartner(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PartnerAdminPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <PartnerAdminPageInner />
    </QueryClientProvider>
  );
}
