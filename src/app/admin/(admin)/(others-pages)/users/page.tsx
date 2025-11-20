import UserList from "@/components/user/UserList"; 

export const metadata = {
  title: "Admin User Management | Visit Nakuru",
  description: "Manage system administrators and their status.",
};

export default function UsersPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
       User Management
      </h2>
      <UserList />
    </div>
  );
}