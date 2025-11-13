// components/account/ResetPassword.jsx

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";


const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/;
const PASSWORD_ERROR_MSG = 
  "Password must be at least 8 characters long and include: 1 uppercase, 1 lowercase, 1 number, and 1 special character.";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({ 
    newPassword: "", 
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!token && !successMsg) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h2>
        <p className="text-gray-600 mb-6">
          The password reset link is missing or invalid. Please request a new one.
        </p>
        <Link href="/forgot-password" className="text-orange-600 hover:underline font-medium">
          Request New Link
        </Link>
      </div>
    );
  }


  const validate = () => {
    const newErrors = {};
    const { newPassword, confirmPassword } = formData;

    
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!PASSWORD_REGEX.test(newPassword)) {
     
      newErrors.newPassword = PASSWORD_ERROR_MSG;
    }

  
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (newPassword && confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSuccessMsg("");
    
    if (errors.general) setErrors((prev) => ({ ...prev, general: "" }));


    if (errors[name]) {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

   
    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            newPassword: formData.newPassword, 
            token 
          }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setSuccessMsg("✅ " + data.message);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setErrors({ general: data.message || "Failed to reset password. Token may be expired." });
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
        Reset Password
      </h2>

      {errors.general && (
        <p className="text-red-600 text-center mb-3">{errors.general}</p>
      )}
      {successMsg && (
        <div className="text-center">
            <p className="text-green-600 mb-3 font-semibold">{successMsg}</p>
            <p className="text-gray-500 text-sm">Redirecting to login...</p>
        </div>
      )}

      {!successMsg && (
        <form onSubmit={handleSubmit} className="space-y-5">
         
          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

         
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

         
          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}