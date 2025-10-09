// "use client";
// import React, { createContext, useContext, useState, useEffect } from "react";
// import i18n from "../i18n"; // Import your i18n configuration

// // --- START: Cookie Utility Functions ---
// const COOKIE_NAME = 'lang';
// const DEFAULT_LANG = 'en';

// // **MODIFIED:** This function implements the core logic: check cookie, otherwise default.
// const getInitialLangFromCookie = () => {
//   if (typeof document === 'undefined') {
//     // CRITICAL: On the server, we assume the default language.
//     return DEFAULT_LANG; 
//   }
  
//   const nameEQ = COOKIE_NAME + "=";
//   const ca = document.cookie.split(';');
//   for(let i=0; i < ca.length; i++) {
//     let c = ca[i].trimStart();
//     if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//   }
//   // If the cookie is not found, use the default language.
//   return DEFAULT_LANG;
// };

// // Simple client-side cookie setter (365 days)
// const setClientCookie = (name, value, days) => {
//   if (typeof document === 'undefined') return;
//   let expires = "";
//   if (days) {
//     const date = new Date();
//     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//     expires = "; expires=" + date.toUTCString();
//   }
//   document.cookie = name + "=" + (value || "")  + expires + "; path=/; samesite=Lax";
// };
// // --- END: Cookie Utility Functions ---


// // Create the context
// const LanguageContext = createContext({
//   lang: DEFAULT_LANG,
//   changeLanguage: (newLang) => {},
//   isMounted: false,
// });

// export const LanguageProvider = ({ children }) => {
//   // 1. CRITICAL: Initialize state to the hardcoded DEFAULT_LANG ('en').
//   // This value is used for the Server-Side Render (SSR) to match the i18n default.
//   const [lang, setLang] = useState(DEFAULT_LANG); 
  
//   const [isMounted, setIsMounted] = useState(false); 

//   useEffect(() => {
//     // This runs ONLY on the client after hydration.
//     const initialLang = getInitialLangFromCookie();
    
//     // 2. Set the state to the cookie language. This triggers the first client re-render.
//     setLang(initialLang);
    
//     // 3. CRITICAL: Force i18n to change its language. This ensures all 't()' calls
//     // in components (like AboutPage's <h1>) now use the cookie language.
//     if (i18n.language !== initialLang) {
//       i18n.changeLanguage(initialLang);
//     }
    
//     // 4. Mark client as mounted.
//     setIsMounted(true);
//   }, []); 

//   // Function to change language (client interaction)
//   const changeLanguage = (newLang) => {
//     setLang(newLang);
//     i18n.changeLanguage(newLang); 
//     setClientCookie(COOKIE_NAME, newLang, 365);
//   };

//   return (
//     <LanguageContext.Provider value={{ lang, changeLanguage, isMounted }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => useContext(LanguageContext);

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n"; 
import { I18nextProvider } from "react-i18next"; 

// --- START: Cookie Utility Functions ---
const COOKIE_NAME = 'lang';
const DEFAULT_LANG = 'en';

const getInitialLangFromCookie = () => {
  if (typeof document === 'undefined') {
    return DEFAULT_LANG; 
  }
  const nameEQ = COOKIE_NAME + "=";
  const ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
    let c = ca[i].trimStart();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return DEFAULT_LANG;
};

const setClientCookie = (name, value, days) => {
  if (typeof document === 'undefined') return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; samesite=Lax";
};
// --- END: Cookie Utility Functions ---


// Create the context
const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  // CRITICAL: Provide a default function here to prevent the ReferenceError before mounting.
  changeLanguage: (newLang) => { console.warn("changeLanguage called before LanguageProvider mounted."); }, 
  isMounted: false,
});

export const useLanguage = () => useContext(LanguageContext);


export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(DEFAULT_LANG); 
  const [isMounted, setIsMounted] = useState(false); 

  useEffect(() => {
    const initialLang = getInitialLangFromCookie();
    setLang(initialLang);
    if (i18n.language !== initialLang) {
      i18n.changeLanguage(initialLang);
    }
    setIsMounted(true);
  }, []); 

  const changeLanguage = (newLang) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
    setClientCookie(COOKIE_NAME, newLang, 365);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider value={{ lang, changeLanguage, isMounted }}>
        {children}
      </LanguageContext.Provider>
    </I18nextProvider>
  );
};