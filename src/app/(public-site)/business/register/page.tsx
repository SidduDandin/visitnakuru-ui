"use client";  // <-- Add this

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PartnerRegisterComponent from "@/components/partner/register";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const queryClient = new QueryClient(); // now created on client only
  const { userAuthToken } = parseCookies();
  const router = useRouter();  
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!userAuthToken) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/dashboard`, {
      headers: { "x-auth-token": userAuthToken },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => router.push("/login"));
  }, [userAuthToken, router]);
  
  if (!user) return <p className="min-h-screen bg-gray-50 flex justify-center items-center">Loading...</p>;
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
      <PartnerRegisterComponent apiUrl={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/partners`}
       user={user} userAuthToken={userAuthToken}
      />
    </QueryClientProvider>
    </>
  );
    
     
}