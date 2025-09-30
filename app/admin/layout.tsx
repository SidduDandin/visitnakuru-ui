"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin-login");
  };

  // Helper for active link
  const navItemClass = (href: string) =>
    `block rounded-md px-3 py-2 ${
      pathname === href
        ? "bg-green-900 font-semibold"
        : "hover:bg-green-600"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-green-700 text-white flex flex-col transition-all duration-300 shadow-lg ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2 p-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
          </div>
          {sidebarOpen && <span className="font-bold text-lg">VisitNakuru</span>}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/40 w-full"></div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-3 text-sm font-medium">
          <Link href="/admin/dashboard" className={navItemClass("/admin/dashboard")}>
            📊 {sidebarOpen && "Dashboard"}
          </Link>
          <Link href="/admin/profile" className={navItemClass("/admin/profile")}>
            👤 {sidebarOpen && "Profile"}
          </Link>
          <Link href="/admin/change-password" className={navItemClass("/admin/change-password")}>
            🔑 {sidebarOpen && "Change Password"}
          </Link>
          <Link href="/admin/blogs" className={navItemClass("/admin/blogs")}>
            📝 {sidebarOpen && "Manage Blogs"}
          </Link>
          <Link href="/admin/partners" className={navItemClass("/admin/partners")}>
            🤝 {sidebarOpen && "Partners"}
          </Link>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow flex justify-between items-center px-6 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-200"
          >
            ☰
          </button>
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-gray-700">{username || "Admin"}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
        <Toaster position="top-right" reverseOrder={false} />

        {/* Footer */}
        <footer className="bg-gray-900 text-white text-center py-3">
          © {new Date().getFullYear()} VisitNakuru Admin. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
