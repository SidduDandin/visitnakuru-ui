"use client";
import { useEffect, useState } from "react";


const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  
  const token = getCookie("authToken");


  const fetchUsers = async () => {
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/users`, {
        headers: { "x-auth-token": token },
      });
      
      if (res.status === 401) {
         throw new Error("Authorization failed. Token invalid or expired.");
      }
      if (!res.ok) {
         throw new Error("Failed to fetch users");
      }
      
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const toggleUserStatus = async (userId, currentStatus) => {
   
    const newStatus = currentStatus === 1 ? 2 : 1;
    const action = newStatus === 1 ? "Activate" : "Block";
    
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const res = await fetch(`${backendUrl}/api/users/status/${userId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-auth-token": token 
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to update user status");
      }
      
      const data = await res.json();
      
      
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.UserID === userId ? { ...user, Status: newStatus } : user
        )
      );
      setStatusMessage(data.msg); 

    } catch (err) {
      setStatusMessage(err.message);
    }
  };

  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);
  
 
  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

 
  const filteredUsers = users.filter((u) =>
    [u.UserFullName, u.EmailAddress]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
     
      {statusMessage && (
        <div
          className={`p-3 mb-4 text-sm rounded-lg ${
            statusMessage.includes("success") || statusMessage.includes("updated") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage}
        </div>
      )}
     
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
         <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-lg"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-lg w-full md:w-1/3"
        />
       
      </div>
      
     
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Email Address</th>
              <th className="px-6 py-3">Created Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((u) => (
              <tr
                key={u.UserID}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{u.UserFullName}</td>
                <td className="px-6 py-4">{u.EmailAddress}</td>
                <td className="px-6 py-4">
                  {new Date(u.CreatedAt)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, "/")}
                </td>
                <td className="px-6 py-4">
                   <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                        u.Status === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {u.Status === 1 ? 'Active' : 'Blocked'}
                    </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleUserStatus(u.UserID, u.Status)}
                    className={`px-3 py-1 text-white rounded ${
                      u.Status === 1 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {u.Status === 1 ? 'Block' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {currentUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {indexOfFirst + 1} to{" "}
          {Math.min(indexOfLast, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}