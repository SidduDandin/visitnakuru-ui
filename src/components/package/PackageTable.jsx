'use client';

import React, { useState, useEffect } from "react";


const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(/ /g, "/");
};


const StatusToggle = ({ packageId, currentStatus, onToggle }) => {
    const isChecked = currentStatus === 1;

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                value="" 
                className="sr-only peer" 
                checked={isChecked}
                onChange={() => onToggle(packageId, currentStatus)}
            />
           
            <div className="w-11 h-6 bg-red-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-red-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-red-600 peer-checked:bg-green-600"></div>
         
           
        </label>
    );
};


export default function PackageTable({
    packages,
    backendUrl,
    authToken,
    onEditClick,
    onPackageAction, 
    onError,
    handleAuthError,
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [selectedPackage, setSelectedPackage] = useState(null);

    const handleDelete = async (packageId) => {
        if (window.confirm("Are you sure you want to delete this package?")) {
            try {
                const res = await fetch(`${backendUrl}/api/admin/packages/${packageId}`, {
                    method: "DELETE",
                    headers: { "x-auth-token": authToken || "" },
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        handleAuthError();
                        return;
                    }
                    const errorData = await res.json();
                    throw new Error(errorData.msg || `Failed to delete package: Server responded with ${res.status}`);
                }
                onPackageAction(); 
            } catch (err) {
                onError(err.message);
            }
        }
    };
    
    // The logic remains the same, it just gets called by the toggle now
    const handleToggleStatus = async (packageId, currentStatus) => {
        const action = currentStatus === 1 ? 'deactivate' : 'activate';
        // Removed window.confirm here to make the toggle feel more instantaneous, 
        // you might want to add a small confirmation/revert logic if the API call fails.
        // For now, we'll keep the confirmation for the action
        if (!window.confirm(`Are you sure you want to ${action} this package?`)) {
            return;
        }
        
        try {
            const res = await fetch(`${backendUrl}/api/admin/packages/toggle-status/${packageId}`, {
                method: "PUT",
                headers: { "x-auth-token": authToken || "" },
            });

            if (!res.ok) {
                if (res.status === 401) {
                    handleAuthError();
                    return;
                }
                const errorData = await res.json();
                throw new Error(errorData.msg || `Failed to toggle package status: Server responded with ${res.status}`);
            }
            onPackageAction(); 
        } catch (err) {
            onError(err.message);
        }
    };


    const filteredPackages = packages.filter((p) =>
        [p.PackageName, p.Description]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentPackages = filteredPackages.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredPackages.length / rowsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, rowsPerPage, packages]);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">List of Packages</h2>
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
                <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="border px-3 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    {[10, 25, 50, 100].map((size) => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search packages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full md:w-1/3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            
            
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Package Name</th>
                            <th className="px-6 py-3">Duration (Days)</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3 text-center">Status</th> 
                            <th className="px-6 py-3">Created At</th>
                            <th className="px-6 py-3">Toggle Status</th> 
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPackages.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4"> 
                                    No packages found
                                </td>
                            </tr>
                        ) : (
                            currentPackages.map((pkg) => (
                                <tr key={pkg.PackageID} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{pkg.PackageName}</td>
                                    <td className="px-4 py-3">{pkg.DurationInDays}</td>
                                    <td className="px-4 py-3">${parseFloat(pkg.PackagePrice).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            pkg.Status === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                        }`}>
                                            {pkg.Status === 1 ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{formatDate(pkg.CreatedDate)}</td>
                                  
                                    <td className="px-4 py-3">
                                        <StatusToggle
                                            packageId={pkg.PackageID}
                                            currentStatus={pkg.Status}
                                            onToggle={handleToggleStatus}
                                        />
                                    </td>
                                  
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedPackage(pkg)}
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                        > View </button>
                                        <button
                                            onClick={() => onEditClick(pkg)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        > Edit </button>
                                        <button
                                            onClick={() => handleDelete(pkg.PackageID)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        > Delete </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-700 dark:text-gray-400">
                    Showing {indexOfFirst + 1} to{" "}
                    {Math.min(indexOfLast, filteredPackages.length)} of{" "}
                    {filteredPackages.length}
                </p>
                <div className="flex gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-white"
                    >
                        Prev
                    </button>
                    <span className="px-3 py-1 text-sm dark:text-white">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-white"
                    >
                        Next
                    </button>
                </div>
            </div>

            {selectedPackage && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
                    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-xl mx-4 my-10 max-h-[85vh] overflow-y-auto transform transition-all duration-300 scale-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold dark:text-white">Package Details</h3>
                            <button onClick={() => setSelectedPackage(null)} className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">Close</button>
                        </div>
                        
                         <div className="border rounded-lg divide-y divide-gray-100 dark:divide-gray-700 dark:text-gray-300">
                             <div className="p-4 space-y-3">
                                 <div className="flex justify-between">
                                     <span className="font-medium text-gray-700 dark:text-gray-300">Package Name:</span>
                                     <span className="text-gray-900 dark:text-white text-right font-semibold">{selectedPackage.PackageName}</span>
                                 </div>
                                 <div className="flex justify-between">
                                     <span className="font-medium text-gray-700 dark:text-gray-300">Duration In Days:</span>
                                     <span className="text-gray-900 dark:text-white text-right">{selectedPackage.DurationInDays}</span>
                                 </div>
                                 <div className="flex justify-between">
                                     <span className="font-medium text-gray-700 dark:text-gray-300">Package Price:</span>
                                     <span className="text-gray-900 dark:text-white text-right">${parseFloat(selectedPackage.PackagePrice).toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between">
                                     <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                                     <span className={`text-right font-semibold ${selectedPackage.Status === 1 ? 'text-green-500' : 'text-red-500'}`}>
                                         {selectedPackage.Status === 1 ? 'Active' : 'Inactive'}
                                     </span>
                                 </div>
                                 <div className="flex justify-between">
                                     <span className="font-medium text-gray-700 dark:text-gray-300">Created Date:</span>
                                     <span className="text-gray-900 dark:text-white text-right">{formatDate(selectedPackage.CreatedDate)}</span>
                                 </div>
                             </div>
                             <div className="p-4">
                                 <h4 className="font-semibold text-lg mb-2 dark:text-white">Description</h4>
                                 <p className="whitespace-pre-wrap dark:text-gray-400">{selectedPackage.Description}</p>
                             </div>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
}