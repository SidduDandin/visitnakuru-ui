"use client";

import { useState } from "react";

export default function ProfileForm({ user, token, onUpdate }) {
  const [formData, setFormData] = useState({
    fullName: user?.UserFullName || "",
    email: user?.EmailAddress || "",
    updatedAt: user?.UpdatedAt ? new Date(user.UpdatedAt).toLocaleString() : "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
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

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            name: formData.fullName,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      // Update UI
      setSuccess("Profile updated successfully!");

      const updatedTime = new Date(data.user.UpdatedAt).toLocaleString();

      setFormData((prev) => ({
        ...prev,
        updatedAt: updatedTime,
      }));

      if (onUpdate) onUpdate(data.user);
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

     

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Your full name"
          className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 ${
            errors.fullName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

        {/* Email FIRST */}
      <div>
        <label className="block text-sm font-medium mb-1">Email Address</label>
        <input
          type="email"
          value={formData.email}
          disabled
          className="w-full p-3 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>
      
      {/* Updated At */}
      <div>
        <label className="block text-sm font-medium mb-1">Last Updated</label>
        <input
          type="text"
          value={formData.updatedAt}
          disabled
          className="w-full p-3 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn btn-primary text-white font-semibold py-3 rounded transition"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
