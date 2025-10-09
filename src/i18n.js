
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en/translation.json';
import es from './locales/es/translation.json';
import fr from './locales/fr/translation.json';
import de from './locales/de/translation.json';
import zh from './locales/zh/translation.json';

// Define the default language
const DEFAULT_LANG = 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      zh: { translation: zh },
    },
    // CRITICAL: Always initialize i18n to the DEFAULT_LANG ('en').
    // This ensures that the SSR output ('About Us') matches the client's
    // initial state, preventing the mismatch error on the <h1> tag.
    lng: DEFAULT_LANG, 
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false, // React already prevents XSS
    },
    // We disable suspense as it can also cause hydration issues
    react: {
      useSuspense: false, 
    }
  });

export default i18n;