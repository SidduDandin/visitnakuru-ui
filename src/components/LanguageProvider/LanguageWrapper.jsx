"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/header/header";
import Footer from "@/components/header/footer";

export default function LanguageWrapper({ children }) {
  return (
    <LanguageProvider>
      <Header />
      <main className="min-h-[50vh]">
        {children}
      </main>
      <Footer />
    </LanguageProvider>
  );
}