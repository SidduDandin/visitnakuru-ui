"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");


  useEffect(() => {
    let timer;
    if (successMsg) {
      timer = setTimeout(() => {
        setSuccessMsg("");
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMsg]); 



  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value.trim()) {
      return "email address is required"; 
    }
    if (!regex.test(value)) {
      return "Invalid email address"; 
    }
    
    return null;
  };
  

  const handleValidation = (name, value) => {
      const newErrors = { ...errors };
      if (name === "email") {
          const error = validateEmail(value);
          if (error) {
              newErrors.email = error;
          } else {
              delete newErrors.email;
          }
      }
      setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);
    setSuccessMsg("");
    
    handleValidation(name, value);

    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMsg("");


    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok || response.status === 200) {
        setSuccessMsg(data.message);
        
        setEmail(""); 
        setErrors({}); 
      } else {
        setErrors({ general: data.message || "Failed to initiate password reset." });
      }
    } catch (err) {
      console.error("⚠️ Frontend fetch error:", err);
      setLoading(false);
      setErrors({ general: "⚠️ Unable to connect to server." });
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Forgot Password
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email address to receive a password reset link.
      </p>

      {errors.general && (
        <p className="text-red-600 text-center mb-3">{errors.general}</p>
      )}

      {successMsg && (
        <p className="text-green-600 text-center mb-3">{successMsg}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
       
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleChange}
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        
        <button
          type="submit"
          disabled={loading || successMsg || errors.email}
          className="w-full btn btn-primary text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {loading ? "Sending Link..." : "Send Reset Link"}
        </button>

       
        <p className="text-sm text-gray-500 text-center mt-3">
          <Link
            href="/login"
            className="text-primary hover:underline font-medium" 
          >
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}