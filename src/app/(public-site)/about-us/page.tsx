"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link";
// Import the language context hook, which must now provide 'isMounted'
import { useLanguage } from "@/context/LanguageContext";
// Import useTranslation for static strings
import { useTranslation } from 'react-i18next';

// Define the type for CMS entries
type CmsEntry = {
  CmsPageName: string;
  CmsText: string;
};


// The API fetching function to get CMS content based on page name and language
async function getCmsContent(pageName: string, lang: string): Promise<CmsEntry> {
  // Use environment variable for the base URL
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const url = `${baseUrl}/api/cms/${pageName}?lang=${lang}`; 

  try {
    const res = await fetch(url, {
      cache: "no-store", // Ensure we always fetch the latest data
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch CMS content. Status: ${res.status}`);
    }

    // Return the parsed JSON data
    return res.json(); 
  } catch (error) {
    console.error("CMS Fetch Error:", error);
    throw error; 
  }
}

export default function AboutPage() {
  // Get language state and the critical isMounted flag from the context
  const { lang, isMounted } = useLanguage(); 
  const { t } = useTranslation();

  // Initialize cmsEntry to null. We rely on this to show loading status.
  const [cmsEntry, setCmsEntry] = useState<CmsEntry | null>(null);

  // Effect to fetch dynamic content
  useEffect(() => {
    // CRITICAL FIX: Only proceed with fetching and state updates 
    // AFTER the client has mounted and the correct 'lang' has been set from the cookie.
    if (!isMounted) {
      return; 
    }

    async function fetchData() {
      // Show loading state while fetching or switching language
      setCmsEntry(null);
      
      try {
        // Fetch content using the correct 'lang' from the cookie
        const data = await getCmsContent("AboutUs", lang); 
        setCmsEntry(data);
      } catch { 
        // Set a localized fallback message on API failure
        setCmsEntry({ 
          CmsPageName: "AboutUs", 
          // t() is now guaranteed to be in the correct language
          CmsText: t('aboutPage.contentNotFound') 
        });
      }
    }
    fetchData();
  }, [lang, t, isMounted]); // Dependency array ensures re-run on lang switch

  // **HYDRATION FIX:** If the component is not yet mounted, we render a simple, 
  // non-translated loading placeholder. This prevents the English SSR output 
  // from being briefly displayed before the correct language takes over.
  if (!isMounted) {
      return (
        <div className="py-14 bg-white text-center min-h-[300px] flex items-center justify-center">
            <p className="text-gray-500 text-xl font-medium">Loading Content ...</p> 
        </div>
      );
  }

  // Once mounted, lang and t() are guaranteed to be in the cookie's language.
  return (
    <>
      {/* SECTION 1: Static Header - Content is now guaranteed to be translated */}
      <section className="bg-gray-100 text-gray-800 py-11">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">{t('pageTitles.aboutUsTitle')} </h1>
          <p className="text-lg max-w-2xl mx-auto">
            {t('aboutPage.subtitle')}
          </p>
        </div>
      </section>

      {/* SECTION 2: Dynamic CMS Content */}
      <div className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="container mx-auto px-4 py-4">
            <div className="prose prose-lg mx-auto">
              
              {/* Conditional Display: Show content or loading message */}
              {cmsEntry ? (
                // Case 1: Content is ready (fetched or fallback set).
                <div 
                  className="description" 
                  dangerouslySetInnerHTML={{ 
                    __html: cmsEntry.CmsText
                  }} 
                />
              ) : (
                // Case 2: Content is NOT ready (before fetch completes).
                // The loading message is now correctly translated via 't()'.
                <div className="description text-center py-10 text-gray-600">
                    <p className="text-xl font-medium">
                        {/* Display loading text using the current language from context */}
                        {t('aboutPage.loading', { language: lang.toUpperCase() })}
                    </p>
                </div>
              )}

              {/* Static Button - Translated */}
              <div className="clear-both mt-6">
                <Link href="#" className="btn bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-3 transition duration-150">
                  {t('aboutPage.getInTouch')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
