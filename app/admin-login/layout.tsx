import type { ReactNode } from "react";
import Image from "next/image"
import type { Metadata } from 'next';
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: 'Admin Login - VisitNakuru',
  description: 'Admin login page for VisitNakuru portal',
};

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return (
        <>
        {/* Header */}
       <header className="bg-white shadow">
        <div className="container mx-auto flex items-center gap-2 p-4">
          <div className="rounded-full overflow-hidden">
            <Image
              src="/visitnakuru.jpg"   // 👈 put your real logo in /public/logo.png
              alt="Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <span className="text-xl font-bold text-green-700">Visit<span className="text-black">Nakuru</span></span>
        </div>
      </header>

        {/* Main content */}
       <main className="flex-1 flex items-center justify-center h-[90vh] bg-gradient-to-br bg-gray-100 via-gray-200 to-gray-300">
        {children}
         <Toaster position="top-right" reverseOrder={false} />
      </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white p-3 text-center">
          © {new Date().getFullYear()} Admin Portal. All rights reserved.
        </footer>
     </>
  );
}
