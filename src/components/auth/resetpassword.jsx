// app/admin/reset-password/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";

// Inline SVG components for the eye icons
const EyeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    {...props}
  >
    <path d="M12 4.5c5.05 0 9.27 3.03 11 7.5-1.73 4.47-5.95 7.5-11 7.5S2.73 16.47 1 12c1.73-4.47 5.95-7.5 11-7.5zm0 13c3.03 0 5.5-2.47 5.5-5.5S15.03 7 12 7s-5.5 2.47-5.5 5.5S8.97 17.5 12 17.5zm0-9.5c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z" />
  </svg>
);

const EyeCloseIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    {...props}
  >
    <path d="M12 6.5c-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5 5.5-2.47 5.5-5.5S15.03 6.5 12 6.5zM12 16.5c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm11-4.5c-1.73 4.47-5.95 7.5-11 7.5S2.73 16.47 1 12c1.73-4.47 5.95-7.5 11-7.5s9.27 3.03 11 7.5zM3.6 5.86l-2.09-2.09-1.41 1.41 19.34 19.34 1.41-1.41-1.41-1.41L3.6 5.86z" />
  </svg>
);

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlToken = searchParams.get("token");
      if (urlToken) {
        setToken(urlToken);
      } else {
        setError("No reset token found in the URL. Please ensure you clicked the link from your email.");
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (message || error) {
      timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [message, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setNewPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Step 1: Validate new password for complexity and emptiness
    if (!newPassword.trim()) {
      setNewPasswordError("New password is required.");
      isValid = false;
    } else if (!passwordRegex.test(newPassword)) {
      setNewPasswordError(
        "Password must be at least 8 characters long and include one uppercase, one lowercase, one number, and one special character."
      );
      isValid = false;
    }

    // Step 2: Validate confirm password for complexity and emptiness
    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Confirm password is required.");
      isValid = false;
    } else if (!passwordRegex.test(confirmPassword)) {
      setConfirmPasswordError(
        "Password must be at least 8 characters long and include one uppercase, one lowercase, one number, and one special character."
      );
      isValid = false;
    }

    // Exit early if either password field is invalid
    if (!isValid) {
      return;
    }

    // Step 3: Check if both passwords match after they have passed complexity checks
    if (newPassword !== confirmPassword) {
      setError("New password do not match with confirm new passwod.");
      return;
    }

    if (!token) {
      setError("Missing reset token. Please try the forgot password link again.");
      return;
    }

    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      if (!backendUrl) {
        setError("Backend URL is not configured. Please check your .env.local file.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, token }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password reset successfully. Redirecting to login...");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          router.push("/admin/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password. The link may have expired or is invalid.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
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
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your new password below.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
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
              {!token && !error && (
                <p className="text-gray-500 text-sm mt-2 mb-4 text-center">
                  Loading token...
                </p>
              )}

              {token && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="newPassword">
                      New Password: <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        placeholder="Enter new password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        autocomplete="new-password"
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
                    <Label htmlFor="confirmPassword">
                      Confirm New Password: <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        placeholder="Confirm new password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autocomplete="new-password"
                      />
                      <span
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                    {confirmPasswordError && (
                      <p className="mt-2 text-sm text-red-500">{confirmPasswordError}</p>
                    )}
                  </div>

                  <div>
                    <Button type="submit" className="w-full" size="sm" disabled={loading}>
                      {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </div>
                </div>
              )}
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
