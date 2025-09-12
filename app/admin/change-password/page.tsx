"use client"
import { useState, useEffect } from "react"
import { FaLock } from "react-icons/fa"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{ oldPassword?: string; newPassword?: string; confirmPassword?: string }>({})
  const [token, setToken] = useState<string | null>(null)

  const router = useRouter()

  // ✅ Run only on client
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/admin-login")
    } else {
      setToken(storedToken)
    }
  }, [router])

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!oldPassword.trim()) newErrors.oldPassword = "Old password is required"
    if (!newPassword.trim()) newErrors.newPassword = "New password is required"
    if (!confirmPassword.trim()) newErrors.confirmPassword = "Confirm password is required"
    if (confirmPassword !== newPassword) newErrors.confirmPassword = "Passwords do not match"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !token) return

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ oldPassword, newPassword }),
    })

    const data = await res.json()
    if (res.ok) {
      toast.success("Password updated successfully")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      toast.error(data.error || "Password update failed")
    }
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg">
        <h2 className="text-xl font-semibold mb-6 border-b pb-3">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Old Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>
            {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <button className="w-full py-2 bg-gradient-to-r from-green-600 to-green-400 text-white font-medium rounded-lg shadow">
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}
