"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";

export default function Header() {
  // ======== State ========
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuDeskOpen, setMenuDeskOpen] = useState(false);

  // ======== Language context ========
  const { lang, changeLanguage, isMounted } = useLanguage();
  const { t } = useTranslation();

  // Supported languages
  const supportedLangs = [
    { code: "en", name: "English", short: "EN" },
    { code: "es", name: "Español", short: "ES" },
    { code: "fr", name: "Français", short: "FR" },
    { code: "de", name: "Deutsch", short: "DE" },
    { code: "zh", name: "中文", short: "ZH" },
  ];

  const currentLang =
    supportedLangs.find((l) => l.code === lang) || supportedLangs[0];

  // ======== Prevent scroll when mobile menu open ========
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    }
  }, [menuOpen]);

  return (
    <header className="relative z-50 md:pr-7 pr-4">
      <div className="flex flex-nowrap items-center justify-between">
        {/* ======== Logo ======== */}
        <div className="flex-shrink">
          <Link href="/">
            <Image
              src="/frontend/images/logo.png"
              alt="Visit Nakuru"
              width={128}
              height={70}
              className="md:max-w-[100%] max-w-[100px]"
            />
          </Link>
        </div>

        {/* ======== Nav + Actions ======== */}
        <div className="flex flex-nowrap items-center justify-end gap-5 text-dark-gray grow-1">
          {/* ======== Desktop Nav ======== */}
          <ul className="hidden xl:flex flex-wrap justify-center items-center p-0 m-0 list-none gap-6 mr-4 grow-[0.3] [&_a]:transition [&_a]:hover:text-black">
            <li><Link href="#">{t("nav.whatsOn")}</Link></li>
            <li><Link href="#">{t("nav.thingsToDo")}</Link></li>
            <li><Link href="#">{t("nav.foodDrink")}</Link></li>
            <li><Link href="#">{t("nav.shopping")}</Link></li>
            <li><Link href="#">{t("nav.bookTickets")}</Link></li>
            <li><Link href="#">{t("nav.visitorInfo")}</Link></li>
          </ul>

          {/* ======== Language Switcher ======== */}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md md:px-2 px-1 py-2 text-dark-gray focus:outline-none">
                {isMounted ? (
                  <>
                    <span className="hidden md:inline">
                      {currentLang.name}
                    </span>
                    <span className="md:hidden">{currentLang.short}</span>
                  </>
                ) : (
                  <>
                    <span className="hidden md:inline">English</span>
                    <span className="md:hidden">EN</span>
                  </>
                )}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </MenuButton>
            </div>

            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-50 mt-2 md:w-56 w-40 origin-top-right bg-white border border-border focus:outline-none">
                <div className="py-1 max-h-40 overflow-auto">
                  {supportedLangs.map((l) => (
                    <MenuItem key={l.code}>
                      <button
                        onClick={() => changeLanguage(l.code)}
                        className={`w-full text-left block px-4 py-2 text-sm ${
                          lang === l.code
                            ? "bg-gray-100 font-semibold text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {l.name}
                      </button>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Transition>
          </Menu>

          {/* ======== Search Button ======== */}
          <button
            onClick={() => {
              setOpen((prev) => !prev);
              setMenuDeskOpen(false);
              setMenuOpen(false);
            }}
            className="py-2 px-1 flex items-center gap-1 focus:outline-none"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                d="M9.65926 19.3113C11.8044 19.3114 13.8882 18.5955 15.5806 17.2772L21.9654 23.6629C22.4423 24.1236 23.2023 24.1104 23.663 23.6334C24.1123 23.1681 24.1123 22.4303 23.663 21.965L17.2782 15.5793C20.5491 11.3681 19.7874 5.3023 15.5769 2.03089C11.3663 -1.24052 5.30149 -0.478719 2.03058 3.73247C-1.24033 7.94365 -0.478647 14.0095 3.7319 17.2809C5.42704 18.598 7.51272 19.3124 9.65926 19.3113ZM4.52915 4.52615C7.36246 1.69235 11.9562 1.6923 14.7895 4.52604C17.6229 7.35978 17.6229 11.9542 14.7896 14.788C11.9563 17.6218 7.36262 17.6218 4.52926 14.7881C1.69595 11.975 1.67915 7.39723 4.49181 4.56349L4.52915 4.52615Z"
                fill="#46454B"
              />
            </svg>
            <span className="lg:inline-block hidden">
              {t("header.searchButton")}
            </span>
          </button>

          {/* ======== Mobile Menu Toggle ======== */}
          <div className="menu-bar-wpr xl:hidden">
            <button
              type="button"
              className={`menu-bar menu-bar-primary ${
                menuOpen ? "active" : ""
              }`}
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setOpen(false);
                setMenuDeskOpen(false);
              }}
            >
              <span className="bars bar1"></span>
              <span className="bars bar2"></span>
              <span className="bars bar3"></span>
            </button>
          </div>

          {/* ======== Desktop Mega Menu Toggle ======== */}
          <div className="menu-bar-wpr xl:block hidden ml-2">
            <button
              type="button"
              className={`menu-bar menu-bar-primary mr-3 ${
                menuDeskOpen ? "active" : ""
              }`}
              onClick={() => {
                setMenuDeskOpen((prev) => !prev);
                setOpen(false);
                setMenuOpen(false);
              }}
            >
              <span className="bars bar1"></span>
              <span className="bars bar2"></span>
              <span className="bars bar3"></span>
            </button>
          </div>
        </div>
      </div>

      {/* ======== Mobile Menu ======== */}
      <div
        className={`mobile-menu transition-opacity duration-300 border-t border-border ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex items-center h-full justify-center">
          <ul className="flex flex-col max-h-full overflow-auto gap-6 font-bold text-lg text-center w-full">
            <li><Link href="/about-us">{t("mobileNav.aboutUs")}</Link></li>
            <li><Link href="#">{t("mobileNav.news")}</Link></li>
            <li><Link href="#">{t("mobileNav.dataReports")}</Link></li>
            <li><Link href="#">{t("mobileNav.events")}</Link></li>
            <li><Link href="#">{t("mobileNav.whyNairobi")}</Link></li>
            <li><Link href="#">{t("mobileNav.startupSupport")}</Link></li>
            <li><Link href="#">{t("mobileNav.keySectors")}</Link></li>
            <li><Link href="#">{t("mobileNav.diaspora")}</Link></li>
            <li><Link href="/contact-us">{t("mobileNav.contactUs")}</Link></li>
          </ul>
        </div>
      </div>

      {/* ======== Search Box ======== */}
      <Transition
        show={open}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-2"
        className="absolute left-0 w-full bg-white shadow-lg border-t border-border"
      >
        <div className="md:px-6 px-4 py-4">
          <form action="" method="get">
            <div className="flex md:gap-5 gap-3 max-w-[1000px] mx-auto">
              <input
                type="text"
                placeholder={t("header.searchPlaceholder")}
                name="s"
                className="block min-w-0 w-full grow py-1.5 md:px-5 px-4 text-black border border-dark-gray placeholder:text-dark-gray focus:outline-none sm:text-sm/6"
              />
              <button
                type="submit"
                className="btn btn-black grow-0 shrink-0 flex-auto md:py-3.5 py-2 md:px-6 px-4"
              >
                {t("header.searchButton")}
              </button>
            </div>
          </form>
        </div>
      </Transition>

      {/* ======== Desktop Mega Menu ======== */}
      <Transition
        show={menuDeskOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-2"
        className="absolute left-0 w-full bg-white shadow-lg border-t border-border"
      >
        <div className="p-6">
          <ul className="m-0 list-none grid grid-cols-4 gap-4 max-w-[1200px] mx-auto [&_a]:transition [&_a]:hover:text-black">
            <li><Link href="/contact-us">{t("desktopMegaNav.contactUs")}</Link></li>
            <li><Link href="#">{t("desktopMegaNav.support")}</Link></li>
            <li><Link href="/about-us">{t("desktopMegaNav.about")}</Link></li>
            <li><Link href="#">{t("desktopMegaNav.services")}</Link></li>
            <li><Link href="#">{t("desktopMegaNav.careers")}</Link></li>
            <li><Link href="/blog">{t("desktopMegaNav.blog")}</Link></li>
          </ul>
        </div>
      </Transition>
    </header>
  );
}
