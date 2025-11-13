"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCookie } from "nookies";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ Pure validation function
  const validateField = (name, value) => {
    if (name === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) return "Email is required";
      if (!regex.test(value)) return "Invalid email address";
    }

    if (name === "password") {
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
    }

    return ""; // no error
  };

  // ✅ On change: validate the field inline
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const errorMsg = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg, // update only this field
      general: "",      // clear general errors while typing
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrors({}); // clear previous errors

    // Validate all fields before submit
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setCookie(null, "userAuthToken", data.token, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        });
        setSuccessMsg("✅ Login successful!");
        window.location.href="/dashboard";
        //router.push("/dashboard");
      } else {
        setErrors({ general: data.message || "Invalid credentials" });
      }
    } catch (err) {
      console.error("⚠️ Frontend fetch error:", err);
      setErrors({ general: "⚠️ Unable to connect to server" });
      setLoading(false);
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
      
         <div className="text-right mt-1">
            <Link
                href="/forgot-password"
                className="text-sm text-primary  hover:underline font-medium"
            >
                Forgot Password?
            </Link>
          </div>
          
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-500 text-center mt-3">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}
