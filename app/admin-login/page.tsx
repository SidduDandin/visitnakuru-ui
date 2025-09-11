"use client";

import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import Image from "next/image"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function AdminLogin() {
const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {}
    if (!username.trim()) newErrors.username = "Username is required"
    if (!password.trim()) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    if (res.ok) {
      // alert("Login success!")
      localStorage.setItem("token", data.token)
      router.push("/admin/dashboard")
    } else {
       toast.error(data.error || "Login failed")
    }
  };

  return (
    
       
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
         <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow">
  <Image
    src="/visitnakuru.jpg"   // 👈 put your real logo in /public/logo.png
    alt="Admin Logo"
    width={80}
    height={80}
    className="object-cover"
  />
</div>

          <h2 className="text-2xl font-bold mb-1">Admin Portal</h2>
          <p className="text-gray-500 text-sm mb-6">Secure login for administrators</p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Username */}
            <div>
              <div
                className={`flex items-center border rounded-lg px-3 py-2 ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
              >
                <FaUser
                  className={`mr-2 ${
                    errors.username ? "text-red-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full outline-none"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div
                className={`flex items-center border rounded-lg px-3 py-2 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              >
                <FaLock
                  className={`mr-2 ${
                    errors.password ? "text-red-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-yellow-400 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-4">
            <a href="/admin-login/forgot-password" className="text-sm text-purple-600 hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>
     
      
  );
}
