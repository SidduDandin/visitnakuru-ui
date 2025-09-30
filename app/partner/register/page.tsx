"use client";  // <-- Add this

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PartnerRegisterComponent from "@/components/Frontendcomponents/partner/register";

export default function RegisterPage() {
  const queryClient = new QueryClient(); // now created on client only

  return (
    <QueryClientProvider client={queryClient}>
      <PartnerRegisterComponent apiUrl={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner`}/>
    </QueryClientProvider>
  );
}