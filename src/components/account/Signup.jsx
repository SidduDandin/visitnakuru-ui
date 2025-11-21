"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCookie } from "nookies";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [step, setStep] = useState(1); // Step 1: Register, Step 2: Verify OTP
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);



  // Password strength
  const getPasswordStrength = (password) => {
    if (!password) return "";
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return "Weak";
    if (score === 2) return "Medium";
    if (score >= 3) return "Strong";
  };

  // Inline validation
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (name === "name" && value.trim()) delete newErrors.name;
    if (name === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (regex.test(value)) delete newErrors.email;
      else newErrors.email = "Invalid email address";
    }
    if (name === "password") {
      if (value.length >= 8) delete newErrors.password;
      setPasswordStrength(getPasswordStrength(value));
    }
    if (name === "confirmPassword" && value === formData.password) delete newErrors.confirmPassword;
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Countdown effect for Resend OTP
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Step 1: Register -> Send OTP
  const handleRegister = async (e) => {
  e.preventDefault();
  setErrors({});
  setSuccessMsg("");

  // Full validation
  const newErrors = {};
  if (!formData.name.trim()) newErrors.name = "Full name is required";
  if (!formData.email) newErrors.email = "Email address is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address";
  if (!formData.password) newErrors.password = "Password is required";
  else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
  if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm your password is required";
  else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match";

  if (Object.keys(newErrors).length) return setErrors(newErrors);

  setLoading(true);

  try {
    // Ensure we only send the required fields
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    console.log("Sending OTP request with payload:", payload);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      // if (data.otp) {
      //   alert(`Your test OTP is: ${data.otp}`);
      // }
      setOtp(data.otp);
      setStep(2);
      setSuccessMsg("✅ OTP sent successfully");
      setResendDisabled(true);
      setResendTimer(15 * 60); // 15 minutes cooldown
    } else {
      setErrors({ general: data.message || "Something went wrong" });
    }
  } catch (err) {
    console.error("Error sending OTP:", err);
    setLoading(false);
    setErrors({ general: "⚠️ Unable to reach server. Try again later." });
  }
};

  // Step 2: Verify OTP -> Save user in DB
  const handleVerifyOTP = async (e) => {
  e.preventDefault();
  if (!otp) return setErrors({ otp: "OTP is required" });

  setLoading(true);
  setErrors({});
  setSuccessMsg("");
  const maxAgeSeconds = 60 * 60 * 24 * 7;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send cookies automatically
      body: JSON.stringify({ email: formData.email, otp }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      const token = data.token;
     
      // Set cookie
      setCookie(null, "userAuthToken", token, {
        maxAge: maxAgeSeconds,
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });

      setSuccessMsg("✅ Verified! Redirecting to dashboard...");
      window.location.href = "/dashboard";
    } else {
      // Backend error message (Invalid OTP, expired, or user not found)
      setErrors({ otp: data.message || "Invalid OTP" });
    }
  } catch (err) {
    console.error("Frontend error in handleVerifyOTP:", err);
    setLoading(false);
    setErrors({ otp: "Server error. Please try again." });
  }
};

  // Resend OTP
  const handleResendOTP = async () => {
    setResendDisabled(true);
    setResendTimer(15 * 60);
    setErrors({});
    setSuccessMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) setSuccessMsg("✅ OTP resent successfully.");
      else setErrors({ general: data.message || "Could not resend OTP" });
    } catch {
      setErrors({ general: "Server error while resending OTP." });
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === "Weak") return "text-red-500";
    if (passwordStrength === "Medium") return "text-yellow-500";
    if (passwordStrength === "Strong") return "text-green-600";
    return "text-gray-400";
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      {step === 1 ? (
        <>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
          {errors.general && <p className="text-red-600 text-center mb-3">{errors.general}</p>}
          {successMsg && <p className="text-green-600 text-center mb-3">{successMsg}</p>}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="First and last name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter at least 8 characters"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              {passwordStrength && <p className={`text-sm mt-1 ${getStrengthColor()}`}>Password strength: {passwordStrength}</p>}
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              {loading ? "Creating Account..." : "Verify email address"}
            </button>

            <p className="text-sm text-gray-500 text-center mt-3">
           Already have an account?{" "}
           
          <Link href="/login" className="text-primary hover:underline font-medium">Login</Link>
           
        </p>
              <p className="text-xs text-gray-500 text-center mt-3">
          By proceeding, you agree to Visitnakuru&apos;s {" "}
          <a href="/privacy-policy" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms-condition" className="text-blue-500 hover:underline">
            Terms & Conditions
          </a>
          .
        </p>

          </form>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Verify Your Email</h2>
          {errors.otp && <p className="text-red-600 text-center mb-3">{errors.otp}</p>}
          {successMsg && <p className="text-green-600 text-center mb-3">{successMsg}</p>}

          <form onSubmit={handleVerifyOTP} className="space-y-5">
            {/* Disabled email field */}
            <div>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
             {successMsg && (
    <p className="text-blue-600 text-center mt-1">
      Your OTP is: <strong>{otp || "Not generated yet"}</strong>
    </p>
  )}
              {/* <p className="text-gray-500 text-sm mt-1 text-center">OTP has been sent to this email</p> */}
            </div>

            {/* OTP boxes */}
           <div className="flex justify-center space-x-2">
  {[0, 1, 2, 3, 4, 5].map((_, idx) => (
    <input
      key={idx}
      type="text"
      maxLength="1"
      value={otp[idx] || ""}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/, ""); // Only digits
        const newOtp = otp.split("");

        newOtp[idx] = val; // allow empty string
        setOtp(newOtp.join(""));

        // Move focus if user typed a number
        if (val && e.target.nextSibling) e.target.nextSibling.focus();
      }}
      onKeyDown={(e) => {
        const newOtp = otp.split("");

        if (e.key === "Backspace") {
          newOtp[idx] = ""; // clear current
          setOtp(newOtp.join(""));

          // Move focus to previous input
          if (e.target.previousSibling) e.target.previousSibling.focus();
        }
      }}
      className={`w-12 h-12 text-center border rounded-lg text-xl focus:outline-none focus:ring-2 ${
        errors.otp ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500 border-gray-300"
      }`}
    />
  ))}
</div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary text-white py-3 rounded-lg transition duration-200"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend OTP */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendDisabled}
                className="text-blue-600 underline"
              >
                {resendDisabled
                  ? `Resend in ${Math.floor(resendTimer / 60)}:${resendTimer % 60 < 10 ? "0" : ""}${resendTimer % 60}`
                  : "Resend OTP"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
