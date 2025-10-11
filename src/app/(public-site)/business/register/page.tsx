"use client";  // <-- Add this

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PartnerRegisterComponent from "@/components/partner/register";

export default function RegisterPage() {
  const queryClient = new QueryClient(); // now created on client only

  return (
    <>
    {/* SECTION 1: Static Header - Content is now guaranteed to be translated */}
     {/* <section className="bg-gray-100 text-gray-800 py-11">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Business Onboarding </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Register your business to get started with our services.
          </p>
        </div>
      </section> */}
    <QueryClientProvider client={queryClient}>
      <PartnerRegisterComponent apiUrl={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/partners`}/>
    </QueryClientProvider>
    </>
  );
    
     
}