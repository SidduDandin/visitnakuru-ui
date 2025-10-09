"use client";

import { useEffect, useState } from "react";

// Helper: Get cookie
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  // Pagination + search
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const token = getCookie("authToken");
      const res = await fetch(`${backendUrl}/api/contacts`, {
        headers: { "x-auth-token": token },
      });

      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const token = getCookie("authToken");
      const res = await fetch(`${backendUrl}/api/contacts/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });

      if (!res.ok) throw new Error("Failed to delete contact");
      setContacts(contacts.filter((c) => c.ContactId !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) return <p>Loading contacts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;


  const filteredContacts = contacts.filter((c) =>
    [c.ContactName, c.ContactEmail, c.ContactSubject, c.ContactMessage]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredContacts.length / rowsPerPage);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
     
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
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-lg w-full md:w-1/3"
        />
       
      </div>

      {/*  Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.map((c) => (
              <tr
                key={c.ContactId}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">{c.ContactName}</td>
                <td className="px-6 py-4">{c.ContactEmail}</td>
                <td className="px-6 py-4">{c.ContactPhoneNumber}</td>
                <td className="px-6 py-4">{c.ContactSubject}</td>
                <td className="px-6 py-4">
                  {new Date(c.ContactDate)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, "/")}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => setSelectedContact(c)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteContact(c.ContactId)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentContacts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {indexOfFirst + 1} to{" "}
          {Math.min(indexOfLast, filteredContacts.length)} of{" "}
          {filteredContacts.length} contacts
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

      
      {selectedContact && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Contact Details
              </h3>
            </div>

            <div className="border rounded-lg divide-y divide-gray-200 dark:divide-gray-700 max-h-[50vh] overflow-y-auto">
              <div className="flex justify-between px-4 py-2">
                <span className="font-medium">Name:</span>
                <span>{selectedContact.ContactName}</span>
              </div>
              <div className="flex justify-between px-4 py-2">
                <span className="font-medium">Contact Date:</span>
                <span>
                  {new Date(selectedContact.ContactDate)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, "/")}
                </span>
              </div>
              <div className="flex justify-between px-4 py-2">
                <span className="font-medium">Email:</span>
                <a
                  href={`mailto:${selectedContact.ContactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {selectedContact.ContactEmail}
                </a>
              </div>
              <div className="flex justify-between px-4 py-2">
                <span className="font-medium">Phone Number:</span>
                <span>{selectedContact.ContactPhoneNumber}</span>
              </div>
               <div className="flex justify-between px-4 py-2">
                    <span className="font-medium">Subject:</span>
                    <span>{selectedContact.ContactSubject}</span>
                </div>
              <div className="px-4 py-2">
                <span className="font-medium block mb-1">Contact Message:</span>
                <p className="whitespace-pre-line">
                  {selectedContact.ContactMessage}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
