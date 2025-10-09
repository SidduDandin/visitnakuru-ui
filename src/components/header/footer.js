import Link from "next/link";
import { useTranslation } from 'react-i18next'; 

export default function Footer() {
  const { t } = useTranslation();
const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-dark-gray text-white">
        <div className="container">
          <div className="md:py-17 py-15">
            <div className="md:mb-12 mb-9">
              {/* Footer Nav Links (now translated) */}
              <ul className="flex flex-wrap justify-center font-interstate md:text-[18px] text-[16px] font-normal ">
                <li className="after:content-['|'] after:mx-2 last:after:content-none">
                  <Link href="#" className="text-white hover:underline">{t('footer.whatsOn')}</Link>
                </li>
                <li className="after:content-['|'] after:mx-2 last:after:content-none">
                  <Link href="#" className="text-white hover:underline">{t('footer.thingsToDo')}</Link>
                </li>
                <li className="after:content-['|'] after:mx-2 last:after:content-none">
                  <Link href="#" className="text-white hover:underline">{t('footer.foodDrink')}</Link>
                </li>
                <li className="after:content-['|'] after:mx-2 last:after:content-none">
                  <Link href="#" className="text-white hover:underline">{t('footer.accommodation')}</Link>
                </li>
                <li className="after:content-['|'] after:mx-2 last:after:content-none">
                  <Link href="#" className="text-white hover:underline">{t('footer.shopping')}</Link>
                </li>
                <li className="after:content-['|'] after:mx-2 last:after:content-none">
                  <Link href="#" className="text-white hover:underline">{t('footer.visitorInfo')}</Link>
                </li>
                <li className="after:content-['|'] after:mx-2 last:after:content-none">
                  <Link href="#" className="text-white hover:underline">{t('footer.blog')}</Link>
                </li>
              </ul>
            </div>
            {/* Social media links remain the same (icons) */}
            <div className="mb-0">
              <ul className="flex justify-center gap-2.5">
                <li>
                  <Link href="#" className="border border-white rounded-full flex items-center justify-center md:p-2 p-2.5 md:w-[60px] md:h-[60px] w-[40px] h-[40px] hover:bg-white hover:text-dark-gray transition">
                    <svg width="13" height="24" viewBox="0 0 13 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full w-auto">
                      <path d="M3.61949 13.5469H0.633411C0.150812 13.5469 0 13.3667 0 12.9161V9.2816C0 8.801 0.180975 8.65081 0.633411 8.65081H3.61949V6.00751C3.61949 4.80601 3.83063 3.66458 4.43387 2.61327C5.06729 1.53191 5.97216 0.811014 7.11833 0.390488C7.87239 0.12015 8.62645 0 9.44084 0H12.3968C12.819 0 13 0.180225 13 0.600751V4.02503C13 4.44556 12.819 4.62578 12.3968 4.62578C11.5824 4.62578 10.768 4.62578 9.95360 4.65582C9.13921 4.65582 8.71694 5.04631 8.71694 5.88736C8.68678 6.78849 8.71694 7.65957 8.71694 8.59074H12.2158C12.6984 8.59074 12.8794 8.77096 12.8794 9.25156V12.8861C12.8794 13.3667 12.7285 13.5169 12.2158 13.5169H8.71694V23.3091C8.71694 23.8198 8.56613 24 8.0232 24H4.2529C3.80046 24 3.61949 23.8198 3.61949 23.3692V13.5469Z" fill="currentcolor"/>
                    </svg>
                  </Link>
                </li>
                {/* ... other social links (omitted for brevity) ... */}
                <li>
                  <Link href="#" className="border border-white rounded-full flex items-center justify-center md:p-2 p-2.5 md:w-[60px] md:h-[60px] w-[40px] h-[40px] hover:bg-white hover:text-dark-gray transition">
                    <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full w-auto">
                      <path d="M13.6881 10.1624L22.2504 0H20.2214L12.7868 8.82384L6.84879 0H0L8.97943 13.3432L0 24H2.0291L9.88025 14.6817L16.1512 24H23L13.6876 10.1624H13.6881ZM10.909 13.4608L9.99919 12.1321L2.76021 1.55961H5.87679L11.7187 10.0919L12.6285 11.4206L20.2224 22.5113H17.1058L10.909 13.4613V13.4608Z" fill="currentcolor"/>
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="border border-white rounded-full flex items-center justify-center md:p-2 p-2.5 md:w-[60px] md:h-[60px] w-[40px] h-[40px] hover:bg-white hover:text-dark-gray transition">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full w-auto">
                      <path d="M23.939 7.05609C23.8828 5.78084 23.6765 4.9042 23.381 4.14448C23.0762 3.33812 22.6073 2.61619 21.993 2.01603C21.3926 1.40653 20.6658 0.932905 19.8686 0.632939C19.1044 0.337567 18.2321 0.131276 16.9567 0.0751087C15.6717 0.0140653 15.2637 0 12.0047 0C8.74559 0 8.33766 0.0140653 7.05743 0.0703265C5.78198 0.126588 4.90513 0.332973 4.1455 0.628156C3.33875 0.932905 2.61669 1.40175 2.01641 2.01603C1.4068 2.61615 0.933316 3.34285 0.633059 4.13989C0.337631 4.9042 0.131348 5.77615 0.075123 7.05131C0.0141149 8.33608 0 8.74393 0 12.0024C0 15.2609 0.0141149 15.6687 0.0703398 16.9487C0.126612 18.2239 0.333036 19.1006 0.62851 19.8603C0.933316 20.6667 1.4068 21.3886 2.01641 21.9888C2.61669 22.5983 3.34353 23.0719 4.14072 23.3718C4.90508 23.6672 5.77720 23.8735 7.05288 23.9297C8.33288 23.9861 8.74104 24 12.0001 24C15.2592 24 15.6671 23.9861 16.9474 23.9297C18.2228 23.8735 19.0997 23.6673 19.8593 23.3718C20.6571 23.0634 21.3817 22.5918 21.9865 21.9871C22.5914 21.3823 23.0632 20.6579 23.3717 19.8603C23.667 19.096 23.8734 18.2239 23.9297 16.9487C23.9859 15.6687 24 15.2609 24 12.0024C24 8.74393 23.9952 8.33604 23.939 7.05609ZM21.7774 16.8549C21.7257 18.027 21.5288 18.66 21.3646 19.0819C20.9613 20.1274 20.1313 20.9573 19.0855 21.3606C18.6635 21.5247 18.0259 21.7216 16.8581 21.773C15.592 21.8294 15.2123 21.8433 12.0094 21.8433C8.80659 21.8433 8.42212 21.8294 7.16055 21.773C5.98822 21.7216 5.35516 21.5247 4.93312 21.3606C4.41275 21.1683 3.93908 20.8635 3.55455 20.465C3.15596 20.0759 2.85115 19.607 2.65880 19.0867C2.49467 18.6647 2.29777 18.027 2.24633 16.8597C2.18987 15.5938 2.17599 15.214 2.17599 12.0117C2.17599 8.80947 2.18987 8.42507 2.24633 7.16397C2.29777 5.99187 2.49467 5.35893 2.65880 4.93697C2.85115 4.41646 3.15596 3.94297 3.55934 3.55843C3.94836 3.15991 4.41729 2.85516 4.93790 2.66308C5.35994 2.49898 5.99778 2.30207 7.16533 2.25045C8.43145 2.19419 8.81138 2.18012 12.0140 2.18012C15.2216 2.18012 15.6013 2.19419 16.8629 2.25045C18.0352 2.30211 18.6683 2.49894 19.0903 2.66303C19.6107 2.85516 20.0844 3.15991 20.4689 3.55843C20.8675 3.94761 21.1723 4.41646 21.3646 4.93697C21.5288 5.35893 21.7257 5.99641 21.7773 7.16397C21.8336 8.42985 21.8476 8.80947 21.8476 12.0117C21.8476 15.214 21.8336 15.589 21.7774 16.8549Z" fill="currentcolor"/>
                      <path d="M12.0047 5.8371C8.60036 5.8371 5.83826 8.59849 5.83826 12.0024C5.83826 15.4063 8.60036 18.1677 12.0047 18.1677C15.4092 18.1677 18.1712 15.4063 18.1712 12.0024C18.1712 8.59849 15.4092 5.8371 12.0047 5.8371ZM12.0047 16.0016C9.79614 16.0016 8.00463 14.2107 8.00463 12.0024C8.00463 9.79404 9.79614 8.00316 12.0047 8.00316C14.2134 8.00316 16.0047 9.79404 16.0047 12.0024C16.0047 14.2107 14.2134 16.0016 12.0047 16.0016ZM19.8547 5.5933C19.8547 6.38818 19.2101 7.03265 18.4149 7.03265C17.6199 7.03265 16.9754 6.38818 16.9754 5.5933C16.9754 4.79833 17.6199 4.15405 18.4150 4.15405C19.2101 4.15405 19.8547 4.79828 19.8547 5.5933Z" fill="currentcolor"/>
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="border border-white rounded-full flex items-center justify-center md:p-2 p-2.5 md:w-[60px] md:h-[60px] w-[40px] h-[40px] hover:bg-white hover:text-dark-gray transition">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full w-auto">
                      <path d="M23.5055 2.50361C23.229 1.52462 22.4183 0.7529 21.3903 0.489281C19.5122 -3.4052e-08 11.9997 0 11.9997 0C11.9997 0 4.48756 0 2.60948 0.47075C1.60122 0.734083 0.770814 1.5248 0.494251 2.50361C0 4.2917 0 8.00004 0 8.00004C0 8.00004 0 11.727 0.494251 13.4964C0.771077 14.4752 1.58145 15.247 2.60963 15.5106C4.50732 16 12 16 12 16C12 16 19.5122 16 21.3903 15.5293C22.4184 15.2658 23.229 14.4941 23.5058 13.5152C23.9999 11.727 23.9999 8.01882 23.9999 8.01882C23.9999 8.01882 24.0197 4.29167 23.5055 2.50361ZM9.60789 11.4259V4.5741L15.8549 7.99997L9.60789 11.4259Z" fill="currentcolor"/>
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-6 border-t border-[rgba(255,255,255,0.2)] text-center">
            {/* Copyright and Policy Links (now translated) */}
            <p className="mb-0 md:text-[16px] text-[14px]">
              {t('footer.copyright', { year: currentYear })}
              <Link href="/terms-condition"> {t('footer.termsConditions')}</Link>  
              |  
              <Link href="/privacy-policy"> {t('footer.privacyPolicy')}</Link>
            </p>
          </div>
        </div>
    </footer>
  );
}