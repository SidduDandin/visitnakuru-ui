"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [username, setUsername] = useState("")
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("username")
    if (storedUser) setUsername(storedUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    // localStorage.removeItem("username")
    router.push("/admin-login")
  }

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
            <Image src="/visitnakuru.jpg" alt="Logo" width={40} height={40} />
          </div>
          {sidebarOpen && <span className="font-bold text-lg">VisitNakuru</span>}
        </div>

        {/* Edge-to-edge divider */}
        <div className="h-px bg-white/40 w-full"></div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-3 text-sm font-medium">
          <a href="/admin/dashboard" className="block rounded-md px-3 py-2 hover:bg-green-600">
            📊 {sidebarOpen && "Dashboard"}
          </a>
          <a href="/admin/profile" className="block rounded-md px-3 py-2 hover:bg-green-600">
            👤 {sidebarOpen && "Profile"}
          </a>
          <a href="/admin/change-password" className="block rounded-md px-3 py-2 hover:bg-green-600">
            🔑 {sidebarOpen && "Change Password"}
          </a>
        </nav>
      </aside>

      {/* Main area */}
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
  )
}
