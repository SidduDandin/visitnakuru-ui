"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  UserCircleIcon,
  DocsIcon,
  SettingIcon,
  ChatIcon,

} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin",
    // subItems: [{ name: "Ecommerce", path: "/admin", pro: false }],
  },
  // {
  //   name:"Manage Key Sectors",
  //   icon :<ListIcon/>,
  //   path:"/admin/category",
  // },
  // {
  //   icon:  <BoxCubeIcon />,
  //   name: "Manage News & Events",
  //   path: "/admin/news",
  // },
  //   {
  //   icon:  <ChatIcon />,
  //   name: "Manage Success Stories",
  //   path: "/admin/testimonials",
  // },

  // {
  //   name: "Manage Business",
  //   icon: <ListIcon />,
  //   subItems: [
  //     { name: "Onboarding Business Partners", path: "/admin/onboarding-business-partners", pro: false },
  //     { name: "Verified Business Partners", path: "/admin/verified-business-partners", pro: false },
  //   ],
  // },
  
 {
    icon:  <BoxCubeIcon />,
    name: "Manage Blogs",
    path: "/admin/blogs",
  },

  {
    icon:  <ListIcon />,
    name: "Manage Categories",
    path: "/admin/categories",
  },
    {
    icon:  <ListIcon />,
    name: "Manage SubCategories",
    path: "/admin/subcategories",
  },

  {
    icon:  <ListIcon />,
    name: "Manage Packages",
    path: "/admin/packages",
  },

  // {
  //   name:"User Management",
  //   icon :<UserCircleIcon/>,
  //   path:"/admin/users",
  // },

  {
    name: "Contacts Received",
    icon: <UserCircleIcon />,
     path: "/admin/contact-us",
  },
   {
    name: "Manage Banner",
    icon: <DocsIcon />,
     path: "/admin/banner",
  },
  {
    name: "CMS",
    icon: <PageIcon />,
     path: "/admin/cms",
  },
       {
    icon:  <ListIcon />,
    name: "Newsletter Subscibers",
    path: "/admin/newsletter-subscribers",
  },
  // {
  //   icon:  <SettingIcon />,
  //   name: "Settings",
  //   path: "/admin/settings",
  // },


  {
    icon:  <ListIcon />,
    name: "Manage Business Partners",
    path: "/admin/partners",
  },

  
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/admin/blank", pro: false },
  //     { name: "404 Error", path: "/admin/error-404", pro: false },
  //   ],
  // },
];

const othersItems = [
  // {
  //   icon: <PieChartIcon />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/admin/line-chart", pro: false },
  //     { name: "Bar Chart", path: "/admin/bar-chart", pro: false },
  //   ],
  // },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/admin/alerts", pro: false },
  //     { name: "Avatar", path: "/admin/avatars", pro: false },
  //     { name: "Badge", path: "/admin/badge", pro: false },
  //     { name: "Buttons", path: "/admin/buttons", pro: false },
  //     { name: "Images", path: "/admin/images", pro: false },
  //     { name: "Videos", path: "/admin/videos", pro: false },
  //   ],
  // },
  // // {
  // //   icon: <PlugInIcon />,
  // //   name: "Authentication",
  // //   subItems: [
  // //     { name: "login In", path: "/admin/login", pro: false },
  // //   ],
  // // },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (navItems, menuType) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
         <Link href="/admin" className="flex items-center gap-3">
        {isExpanded || isHovered || isMobileOpen ? (
          <>
          
            <Image
              src="/images/logo/logo-v.png"
              alt="Visit Nakuru"
              width={48} 
              height={48}
              className="object-contain"
            />
          
            <span className="text-black dark:text-white text-xl font-bold leading-none">
              Visit Nakuru
            </span>
          </>
        ) : (
          <>
          
            <Image
              src="/images/logo/logo-v.png"
              alt="Visit Nakuru"
              width={48}
              height={48}
              className="object-contain"
            />
          </>
        )}
      </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* Commented out "Others" section */}
            {/*
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
            */}
          </div>
        </nav>
        {/* Commented out SidebarWidget */}
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;