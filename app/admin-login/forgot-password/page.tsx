"use client"

import { useState } from "react"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email) {
      setError("Email is required")
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      )

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Something went wrong")

      setSuccess(data.message)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.")
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow">
        <Image
          src="/visitnakuru.jpg"
          alt="Admin Logo"
          width={80}
          height={80}
          className="object-cover"
        />
      </div>

      <h1 className="text-2xl font-bold text-center mb-2">Forgot Password</h1>
      <p className="text-sm text-gray-600 text-center mb-6">
        Enter your email and we’ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-yellow-400 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
        >
          Send Reset Link
        </button>
      </form>

      {success && (
        <p className="text-green-600 text-sm mt-4 text-center">{success}</p>
      )}

      <div className="mt-6 text-center">
        <a
          href="/admin-login"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}
