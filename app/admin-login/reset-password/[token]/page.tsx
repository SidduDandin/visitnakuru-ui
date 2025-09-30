"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function ResetPasswordPage() {
  const params = useParams()
  const token = params?.token as string
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; api?: string }>({})
  const [success, setSuccess] = useState("")

  const validate = () => {
    const errs: typeof errors = {}
    if (!password) errs.password = "New password is required"
    else if (password.length < 6) errs.password = "Password must be at least 6 characters"
    if (!confirmPassword) errs.confirmPassword = "Confirm password is required"
    else if (confirmPassword !== password) errs.confirmPassword = "Passwords do not match"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess("")
    setErrors({})

    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")

      setSuccess("Password reset successful! Redirecting to login...")
      setTimeout(() => router.push("/admin-login"), 2000)
    } catch (err: any) {
      setErrors({ api: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow">
          <Image
            src="/visitnakuru.jpg"
            alt="Admin Logo"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-yellow-400 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          
          <Link href="/admin-login" className="text-sm text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    
  )
}
