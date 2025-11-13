// app/forgot-password/page.js

import ForgotPassword from "@/components/account/ForgotPassword";

export const metadata = {
  title: "Forgot Password | Visit Nakuru",
  description: "Request a password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6">
      <ForgotPassword />
    </div>
  );
}