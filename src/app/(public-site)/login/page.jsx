import Login from "@/components/account/Login";

export const metadata = {
  title: "Login | Visit Nakuru",
  description: "Secure user login page.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6">
      <Login />
    </div>
  );
}
