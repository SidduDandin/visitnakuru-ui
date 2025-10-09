// app/admin/forgot-password/page.jsx
"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function ForgotPasswordPage() {
  const [formKey, setFormKey] = useState(0); // This is good!

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (message || error) {
      timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 10000); // 10000 milliseconds = 10 seconds
    }
    return () => clearTimeout(timer);
  }, [message, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setMessage(null);
    setError(null);
    setLoading(true);

    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      if (!backendUrl) {
        setError("Backend URL is not configured. Please check your .env.local file.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password reset link sent to your email.");
        setEmail(""); 
        setFormKey((prevKey) => prevKey + 1); 
      } else {
        setError(data.message || "Failed to send reset link. Please try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Forgot Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              {/* Conditional rendering for messages/errors */}
              {message && (
                <p className="text-green-500 text-sm mt-2 mb-4 text-center transition-opacity duration-1000 ease-out">
                  {message}
                </p>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-2 mb-4 text-center transition-opacity duration-1000 ease-out">
                  {error}
                </p>
              )}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    key={formKey} // This is correctly applied
                    id="email"
                    placeholder="info@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autocomplete="off" // Keep this for good measure
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-500">{emailError}</p>
                  )}
                </div>

                <div>
                  <Button type="submit" className="w-full" size="sm" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/admin/login"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}