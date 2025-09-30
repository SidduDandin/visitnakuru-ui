
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from "@/components/Frontendcomponents/header";
import Footer from "@/components/Frontendcomponents/footer";
import { Outfit } from "next/font/google";

import { usePathname } from 'next/navigation';

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400","500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Visitnakuru",
  description: "Connecting Investors to Africa's Fastest Growing City",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 


  return (
   <html lang="en" className="!pr-0">
      <body className={`${outfit.variable} p-0 m-0 font-outfit font-normal text-dark-gray text-[16px] leading-[1.7]`} >
      
        <Header />
        {children}
     <Footer />
      </body>
    </html>
  );


}