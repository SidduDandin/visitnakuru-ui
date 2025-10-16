"use client";

import { useState, useEffect } from "react";
// Import the language context hook
import { useLanguage } from "@/context/LanguageContext";
// Import useTranslation for static strings
import { useTranslation } from 'react-i18next';

// Define the type for CMS entries (can be shared in a types file)
type CmsEntry = {
  CmsPageName: string;
  CmsText: string;
};

// The API fetching function (can be moved to a separate api.ts file)
async function getCmsContent(pageName: string, lang: string): Promise<CmsEntry> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const url = `${baseUrl}/api/cms/${pageName}?lang=${lang}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch CMS content. Status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("CMS Fetch Error:", error);
    throw error;
  }
}

export default function TermsPage() {
  const { lang, isMounted } = useLanguage();
  const { t } = useTranslation();

  const [cmsEntry, setCmsEntry] = useState<CmsEntry | null>(null);

  useEffect(() => {
    // Only fetch after the client has mounted
    if (!isMounted) {
      return;
    }

    async function fetchData() {
      // Reset to show loading state
      setCmsEntry(null);
      
      try {
        // Fetch content for 'terms' page
        const data = await getCmsContent("TermsAndConditions", lang);
        setCmsEntry(data);
      } catch {
        // Set a localized fallback message on API failure
        setCmsEntry({
          CmsPageName: "Terms and Conditions",
          CmsText: t('termsPage.contentNotFound')
        });
      }
    }
    fetchData();
  }, [lang, t, isMounted]);

  // Render a non-translated loading placeholder to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="py-14 bg-white text-center min-h-[300px] flex items-center justify-center">
        <p className="text-gray-500 text-xl font-medium">Loading Content ...</p>
      </div>
    );
  }

  // Once mounted, render the full page with correct translations
  return (
    <>
      {/* SECTION 1: Static Header */}
      <section className="bg-gray-100 text-gray-800 py-11">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">{t('pageTitles.termsTitle')}</h1>
          <p className="text-lg max-w-2xl mx-auto">
            {t('termsPage.subtitle')}
          </p>
        </div>
      </section>

      {/* SECTION 2: Dynamic CMS Content */}
      <div className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg mx-auto">
            
            {/* Conditional Display: Show content or loading message */}
            {cmsEntry ? (
              <div
                className="description"
                dangerouslySetInnerHTML={{
                  __html: cmsEntry.CmsText
                }}
              />
            ) : (
              <div className="description text-center py-10 text-gray-600">
                <p className="text-xl font-medium">
                  {t('termsPage.loading', { language: lang.toUpperCase() })}
                </p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
}