"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";

export default function AdminChangePasswordCard() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [formKey, setFormKey] = useState(0);

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // This useEffect handles the success message fade-out.
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmNewPasswordError("");

    let isValid = true;

    
    if (!oldPassword) {
      setOldPasswordError("Please enter your old password.");
      isValid = false;
    }

    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!newPassword) {
      setNewPasswordError("Please enter a new password.");
      isValid = false;
    } else if (!passwordRegex.test(newPassword)) {
      setNewPasswordError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
      );
      isValid = false;
    }

   
    if (!confirmNewPassword) {
      setConfirmNewPasswordError("Please enter your new password again.");
      isValid = false;
    } else if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError("New passwords do not match.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      if (!backendUrl) {
        setError("Backend URL is not configured. Please check your .env.local file.");
        return;
      }

      const cookies = parseCookies();
      const token = cookies.authToken;

      if (!token) {
        setError("Authentication token not found. Please log in again.");
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`${backendUrl}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (response.ok) {
        // ⭐ Moved the state clearing here for immediate effect
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setFormKey(prevKey => prevKey + 1);
        setSuccess("Password updated successfully!");
      } else {
        const data = await response.json();
        setError(data.msg || "Failed to update password. Please try again.");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-500">
           
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Change Password
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your account password
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-grow flex-col justify-between" key={formKey}>
          <div>
            {error && (
              <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
            )}
            {success && (
              <p className="mb-4 text-sm text-green-500 text-center">{success}</p>
            )}
            <div className="flex flex-col gap-5">
              <div>
                <Label htmlFor="oldPassword">
                  Old Password
                </Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showOldPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
                {oldPasswordError && (
                  <p className="mt-2 text-sm text-red-500">{oldPasswordError}</p>
                )}
              </div>
              <div>
                <Label htmlFor="newPassword">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showNewPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
                {newPasswordError && (
                  <p className="mt-2 text-sm text-red-500">{newPasswordError}</p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmNewPassword">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmNewPassword"
                    type={showConfirmNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showConfirmNewPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
                {confirmNewPasswordError && (
                  <p className="mt-2 text-sm text-red-500">{confirmNewPasswordError}</p>
                )}
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-5 w-full" size="sm">
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
}