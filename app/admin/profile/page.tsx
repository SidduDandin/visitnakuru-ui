"use client"

import { useEffect, useState } from "react"
import { FaUser, FaEnvelope } from "react-icons/fa"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"


export default function ProfilePage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [createdAt, setCreatedAt] = useState("")
  const [updatedAt, setUpdatedAt] = useState("")
  const [errors, setErrors] = useState<{ username?: string; email?: string }>({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  // 🔹 Fetch profile once on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      
      router.push("/admin-login")
      
    }

    const controller = new AbortController()

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile")
        return res.json()
      })
      .then((data) => {
        // ✅ Safely bind DB values into textboxes
        setUsername(data?.username ?? "")
        setEmail(data?.email ?? "")
        setCreatedAt(data?.createdAt ? new Date(data.createdAt).toLocaleString() : "")
        setUpdatedAt(data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : "")
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("❌ Profile fetch error:", err)
          toast.error("Failed to load profile")
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  // 🔹 Validation
  const validate = () => {
    const newErrors: { username?: string; email?: string } = {}
    if (!username.trim()) newErrors.username = "Username is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔹 Update profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const token = localStorage.getItem("token")
    if (!token) return toast.error("Not authenticated")

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, email }),
    })

    const data = await res.json()
    if (res.ok) {
      toast.success("✅ Profile updated successfully")
      setUpdatedAt(new Date(data.admin.updatedAt).toLocaleString())
    } else {
      toast.error(data.error || "Update failed")
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-start">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 flex justify-start">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
        {/* Header inside card */}
        <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-800">
          Admin Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 outline-none text-gray-700"
                placeholder="Enter username"
              />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 outline-none text-gray-700"
                placeholder="Enter email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
          >
            Update Profile
          </button>
        </form>

        {/* Meta Info */}
        <div className="mt-6 text-sm text-gray-600 border-t pt-4">
          <p><span className="font-medium">📅 Created At:</span> {createdAt}</p>
          <p><span className="font-medium">⏳ Last Updated:</span> {updatedAt}</p>
        </div>
      </div>
    </div>
  )
}
