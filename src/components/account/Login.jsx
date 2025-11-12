"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCookie } from "nookies";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  

  // 🧩 Validate input fields
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) newErrors.email = "Email is required";
      else if (!regex.test(value)) newErrors.email = "Invalid email address";
      else delete newErrors.email;
    }

    if (name === "password") {
      if (!value) newErrors.password = "Password is required";
      else if (value.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      else delete newErrors.password;
    }

    setErrors(newErrors);
    return newErrors;
  };

  // 🧠 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // 🚀 Submit login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMsg("");
    const maxAgeSeconds = 60 * 60 * 24 * 7;

    // ✅ Full validation on submit
    const newErrors = {
      ...validateField("email", formData.email),
      ...validateField("password", formData.password),
    };

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // important if backend sets cookie
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        const token = data.token;
        // Set cookie
         setCookie(null, "userAuthToken", token, {
                maxAge: maxAgeSeconds,
                path: "/",
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
              });
        
        setSuccessMsg("✅ Login successful!");
       
        router.replace("/dashboard"); // redirect after login
      } else {
        setErrors({ general: data.message || "Invalid credentials" });
      }
    } catch (error) {
      setLoading(false);
      setErrors({ general: "⚠️ Unable to connect to server" });
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Welcome Back
      </h2>

      {errors.general && (
        <p className="text-red-600 text-center mb-3">{errors.general}</p>
      )}
      {successMsg && (
        <p className="text-green-600 text-center mb-3">{successMsg}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-500 text-center mt-3">
          Don’t have an account?{" "}
           <Link href="/register" className="text-primary hover:underline font-medium">Create Account</Link>
          {/* <a
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Create Account
          </a> */}
         
        </p>
      </form>
    </div>
  );
}
