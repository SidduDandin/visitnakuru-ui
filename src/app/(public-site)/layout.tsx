"use client"; 

import "./frontendcss.css"; 
import { Montserrat } from "next/font/google";
import LanguageWrapper from "@/components/LanguageProvider/LanguageWrapper"; 
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

// export const metadata = {
//   title: "Visitnakuru",
//   description: "Connecting Investors to Africa's Fastest Growing City",
// };


const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;


export default function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  
  if (!siteKey) {
    console.error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. reCAPTCHA will not function.");
    return (
      <div
        className={`${montserrat.variable} p-0 m-0 font-montserrat font-normal bg-white text-dark-gray text-[16px] leading-[1.7]`}
      >
        <LanguageWrapper>
            {children}
        </LanguageWrapper>
      </div>
    );
  }

  return (
    <GoogleReCaptchaProvider 
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true, 
        defer: true,
        appendTo: "body",
      }}
    >
      <div
         className={`${montserrat.variable} p-0 m-0 font-montserrat font-normal bg-white text-dark-gray text-[16px] leading-[1.7]`}
      >
        <LanguageWrapper>
          {children}
        </LanguageWrapper>
      </div>
    </GoogleReCaptchaProvider>
  );
}