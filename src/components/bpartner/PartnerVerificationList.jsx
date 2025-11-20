

"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; 

const STATUS_MAP = {
    pending: 1, 
    reqinfo: 2, 
    approved: 3, 
    reject: 4, 
};


const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function PartnerVerificationList() {
    const router = useRouter(); 
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const [pagination, setPagination] = useState({
        currentPage: 1,
        rowsPerPage: 10,
        totalCount: 0,
        totalPages: 1,
    });
    
    const [activeTab, setActiveTab] = useState('pending');
    const [search, setSearch] = useState(""); 
 
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL; 

    const fetchPartners = useCallback(async (tabKey, page, rows) => {
        const statusCode = STATUS_MAP[tabKey];
        if (!statusCode) return;

        setLoading(true);
        setError("");

        try {
            const token = getCookie("authToken");
            console.log(token);
            const res = await fetch(
                `${backendUrl}/api/bpartner/status/${statusCode}?page=${page}&rowsPerPage=${rows}`, 
                {
                    headers: { "x-auth-token": token },
                }
            );
            
            if (!res.ok) {
                if (res.status === 404) {
                    setPartners([]);
                    setPagination(p => ({ ...p, totalCount: 0, totalPages: 1 }));
                    return;
                }
                throw new Error(`Failed to fetch partners for status ${tabKey}`);
            }
            
            const { partners, totalCount, currentPage, rowsPerPage, totalPages } = await res.json();
            
            setPartners(partners);
            setPagination({ totalCount, currentPage, rowsPerPage, totalPages });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl]);


    const handleTabChange = (newTab) => {
        setSearch("");
        setPagination(p => ({ ...p, currentPage: 1 }));
        setActiveTab(newTab);
    };

    const handleRowsPerPageChange = (e) => {
        const newRowsPerPage = Number(e.target.value);
        setPagination(p => ({ ...p, rowsPerPage: newRowsPerPage, currentPage: 1 }));
    };

    useEffect(() => {
        fetchPartners(activeTab, pagination.currentPage, pagination.rowsPerPage);
    }, [activeTab, pagination.currentPage, pagination.rowsPerPage, fetchPartners]);


    if (error) return <p className="text-red-500 p-4">Error: {error}</p>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            
           
            <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6">
                {Object.keys(STATUS_MAP).map(tabKey => (
                    <button
                        key={tabKey}
                        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 
                            ${activeTab === tabKey 
                                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        onClick={() => handleTabChange(tabKey)}
                    >
                        {tabKey.toUpperCase().replace('REQINFO', 'GET MORE INFO')} 
                        <span className="ml-1 text-xs">({tabKey === activeTab ? pagination.totalCount : '...'})</span>
                    </button>
                ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
                 <select
                    value={pagination.rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="border px-3 py-2 rounded-lg"
                    disabled={loading}
                >
                    {[10, 25, 50, 100].map((size) => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>
                
                <input
                    type="text"
                    placeholder="Search current page..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full md:w-1/3"
                    disabled={loading}
                />
            </div>

          
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Business Name</th>
                            <th className="px-6 py-3">Contact Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Phone</th>
                            <th className="px-6 py-3">Listing ID</th>
                            <th className="px-6 py-3">Applied Date</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                             <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                        ) : (
                            partners.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4">No partners found in this status.</td></tr>
                            ) : (
                                partners.filter((p) =>
                                    [p.BusinessName, p.ContactName, p.Email, p.ListingID]
                                    .join(" ")
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                                ).map((p) => (
                                    <tr
                                        key={p.PartnerID}
                                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.BusinessName}</td>
                                        <td className="px-6 py-4">{p.ContactName}</td>
                                        <td className="px-6 py-4">{p.Email}</td>
                                        <td className="px-6 py-4">{p.Phone || 'N/A'}</td>
                                        <td className="px-6 py-4">{p.ListingID || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            {new Date(p.CreatedDate)
                                                .toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                .replace(/ /g, "/")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => router.push(`/admin/business-partner-details/${p.PartnerID}`)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                            >
                                                Review Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )
                        )}
                    </tbody>
                </table>
            </div>

           
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {(pagination.currentPage - 1) * pagination.rowsPerPage + 1} to{" "}
                    {Math.min(pagination.currentPage * pagination.rowsPerPage, pagination.totalCount)} of{" "}
                    {pagination.totalCount} partners
                </p>
                <div className="flex gap-2">
                    <button
                        disabled={pagination.currentPage === 1 || loading}
                        onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-3 py-1">
                        Page {pagination.currentPage} of {pagination.totalPages || 1}
                    </span>
                    <button
                        disabled={pagination.currentPage === pagination.totalPages || loading || pagination.totalCount === 0}
                        onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}