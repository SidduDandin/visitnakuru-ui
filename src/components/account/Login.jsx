"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCookie } from "nookies";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // OTP SCREEN
  const [otpStage, setOtpStage] = useState(false);
  const [otpBoxes, setOtpBoxes] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  const [tempUserId, setTempUserId] = useState(null);

  // OTP TIMER (5 min)
  const [timer, setTimer] = useState(300);
  const timerRef = useRef(null);

  // WRONG ATTEMPTS
  const otpLimit = 3;
  const [otpAttempts, setOtpAttempts] = useState(0);

  const [shake, setShake] = useState(false);
  const [locked, setLocked] = useState(false);

  const maxAgeSeconds = 60 * 60 * 24 * 7;

  // ----------------------------------------------------
  // Validation
  // ----------------------------------------------------
  const validateField = (name, value) => {
    const error = {};

    if (name === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error.email = "Email is required";
      else if (!regex.test(value)) error.email = "Invalid email address";
    }

    if (name === "password") {
      if (!value) error.password = "Password is required";
      else if (value.length < 8)
        error.password = "Password must be at least 8 characters";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, ...fieldError, general: "" }));
  };

  // ----------------------------------------------------
  // Start timer
  // ----------------------------------------------------
  const startTimer = () => {
    setTimer(300);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ----------------------------------------------------
  // Login submit
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMsg("");

    const emailErr = validateField("email", formData.email);
    const passErr = validateField("password", formData.password);
    const newErrors = { ...emailErr, ...passErr };

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || "Invalid credentials" });
        setLoading(false);
        return;
      }

      // GO TO OTP SCREEN
      setTempUserId(data.userId);
      setOtpStage(true);

      // Auto-fill OTP for testing only
      if (data.otp && data.otp.length === 6) {
        setOtpBoxes(data.otp.split(""));
      } else {
        setOtpBoxes(["", "", "", "", "", ""]);
      }

      startTimer();
      setOtpAttempts(0);
      setLocked(false);
    } catch (err) {
      console.error(err);
      setErrors({ general: "Unable to connect to server" });
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // OTP Input (auto move, allow only digits, block paste)
  // ----------------------------------------------------
  const handleOtpChange = (e, index) => {
    if (locked) return;

    const value = e.target.value;

    // Only digits allowed
    if (value && !/^\d$/.test(value)) return;

    const updated = [...otpBoxes];
    updated[index] = value;
    setOtpBoxes(updated);

    // Move forward
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }

    // Backspace → move back
    if (!value && index > 0 && e.nativeEvent.inputType === "deleteContentBackward") {
      otpRefs.current[index - 1].focus();
    }
  };

  const blockPaste = (e) => e.preventDefault();

  // ----------------------------------------------------
  // Submit OTP
  // ----------------------------------------------------
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (locked) return;

    const otp = otpBoxes.join("");

    if (otp.length !== 6) {
      setErrors({ general: "Enter 6-digit OTP" });
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

      const response = await fetch(`${apiUrl}/api/users/verify-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: tempUserId, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        const attempts = otpAttempts + 1;
        setOtpAttempts(attempts);

        // SHAKE ANIMATION
        setShake(true);
        setTimeout(() => setShake(false), 400);

        if (attempts >= otpLimit) {
          setLocked(true);
          setErrors({
            general: "You have entered incorrect OTP 3 times. Please login again.",
          });
        } else {
          setErrors({
            general: `Wrong OTP. Attempts left: ${otpLimit - attempts}`,
          });
        }
        return;
      }

      // SUCCESS → set cookie
      setCookie(null, "userAuthToken", data.token, {
        maxAge: maxAgeSeconds,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setErrors({ general: "Server error" });
    }
  };

  // ----------------------------------------------------
  // Timer Format
  // ----------------------------------------------------
  const formatTimer = () => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // ----------------------------------------------------
  // JSX
  // ----------------------------------------------------
  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Welcome Back
      </h2>

      {errors.general && (
        <p className="text-red-600 text-center mb-3">{errors.general}</p>
      )}

      {!otpStage && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border rounded-lg p-3 ${
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
              className={`w-full border rounded-lg p-3 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right mt-1">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register */}
          <p className="text-sm text-gray-500 text-center mt-3">
            Don’t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Create Account
            </Link>
          </p>
        </form>
      )}

      {/* OTP SCREEN */}
      {otpStage && (
        <form onSubmit={handleOtpSubmit} className="space-y-5">
          <h3 className="text-center text-lg">Enter OTP</h3>

          <div className={`flex justify-center gap-3 ${shake ? "animate-shake" : ""}`}>
            {otpBoxes.map((digit, i) => (
              <input
                key={i}
                maxLength="1"
                disabled={locked}
                ref={(el) => (otpRefs.current[i] = el)}
                className="w-12 h-12 border text-center text-xl rounded-lg"
                value={digit}
                onPaste={blockPaste}
                onChange={(e) => handleOtpChange(e, i)}
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-500">
            Time remaining: {formatTimer()}
          </p>

          {/* Verify button */}
          {!locked && (
            <button
              type="submit"
              className="w-full btn btn-primary py-3"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          )}

          {/* LOCKED → show login again */}
          {locked && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full btn btn-primary py-3"
            >
              Login Again
            </button>
          )}
        </form>
      )}

      {/* SHAKE ANIMATION */}
      <style jsx global>{`
        .animate-shake {
          animation: shake 0.3s linear;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
