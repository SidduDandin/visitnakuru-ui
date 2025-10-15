import '../../globals.css'; 


import GridShape from "@/components/common/GridShape";
import { ThemeProvider } from "@/context/ThemeContext"; 
import Image from "next/image";
import Link from "next/link";
import React from "react";



export const metadata = {
  title: 'Admin Login', 
  description: 'Admin authentication pages for your application.',
};

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          {children} {/* This is where your login/signup form will be rendered */}
          <div className="lg:w-1/2 w-full h-full brand-bg-color dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center flex z-1">
              {/* */}
              <GridShape />
             <div className="flex items-center max-w-xs">
            <Link href="/admin" className="block mr-3">
              <Image
                width={128}
                height={70}
                src="/images/logo/logoadmin.png"
                alt="Logo"
                className="object-contain"
              />
            </Link>

            {/* <p className="text-white text-xl font-bold">
              Visit Nakuru
            </p> */}
          </div>

            </div>
          </div>
          {/* <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div> */}
        </div>
      </ThemeProvider>
    </div>
  );
}