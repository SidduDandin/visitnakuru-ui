
import { Suspense } from 'react';
import ResetPassword from "@/components/account/ResetPassword";
export const metadata = {
  title: "Reset Password | Visit Nakuru",
  description: "Set a new password using your reset token.",
};
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6">
        <Suspense fallback={
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <p className="text-xl font-medium text-gray-700">Loading password reset form...</p>
            </div>
        }>
            <ResetPassword />
        </Suspense>
    </div>
  );
}