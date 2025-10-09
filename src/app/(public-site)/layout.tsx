import "./frontendcss.css"; 
import { DM_Sans } from "next/font/google";
import LanguageWrapper from "@/components/LanguageProvider/LanguageWrapper"; 


const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata = {
  title: "Visitnakuru",
  description: "Connecting Investors to Africa's Fastest Growing City",
};

export default function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${dmSans.variable} font-dm-sans font-normal text-black text-[16px] leading-[1.7]`}
    >
      <LanguageWrapper>
            {children}
        </LanguageWrapper>
    </div>
  );
}


