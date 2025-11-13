"use client";

import { useState } from "react";

export default function ChangePasswordForm({ token }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.oldPassword) newErrors.oldPassword = "Please enter your old password.";
    if (!formData.newPassword) newErrors.newPassword = "Please enter a new password.";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your new password.";
    else if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
     console.log(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/change-password`)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      if (!backendUrl) {
        setError("Backend URL is not configured. Please check your .env.local file.");
        return;
      }

       if (!token) {
        setError("Authentication token not found. Please log in again.");
        router.push("/admin/login");
        return;
      }

      setLoading(true);
      const res = await fetch(`${backendUrl}/api/users/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      setSuccess("Password updated successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && <div className="bg-green-100 text-green-600 p-2 rounded">{success}</div>}
      {errors.form && <div className="text-red-500 text-sm">{errors.form}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Old Password</label>
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={formData.oldPassword}
          onChange={handleChange}
          className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 ${
            errors.oldPassword ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.oldPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">New Password</label>
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 ${
            errors.newPassword ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 ${
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
        className="w-full btn btn-primary text-white font-semibold py-3 rounded transition"
      >
        {loading ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
}
