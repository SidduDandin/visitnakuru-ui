"use client";
import { useEffect, useMemo, useState } from "react";
import { destroyCookie, parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import PartnerDetailsModal from "../../../components/partner/PartnerDetailsModal";

export default function DashboardPage() {
const { userAuthToken } = parseCookies();
const router = useRouter();

// top-level hooks
const [user, setUser] = useState(null);
const [businesses, setBusinesses] = useState([]);
const [packages, setPackages] = useState([]);
const [activeTab, setActiveTab] = useState("activeBusinesses"); // "activeBusinesses" | "inProgress"
const [searchQuery, setSearchQuery] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);

const [showModal, setShowModal] = useState(false);
const [selectedPartnerId, setSelectedPartnerId] = useState(null);

const statusLabels = {
0: { label: "Draft", color: "bg-gray-200 text-gray-800" },
1: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
2: { label: "Request Info", color: "bg-orange-100 text-orange-800" },
3: { label: "Approved", color: "bg-green-100 text-green-800" },
4: { label: "Rejected", color: "bg-red-100 text-red-800" },
5: { label: "Active", color: "bg-blue-100 text-blue-800" },
6: { label: "Expired", color: "bg-gray-100 text-gray-800" },
7: { label: "Blocked", color: "bg-red-200 text-red-900" },
};

// fetch data
useEffect(() => {
async function loadData() {
if (!userAuthToken) {
router.push("/login");
return;
}

  try {
    const base = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const [dashRes, bizRes, pkgRes] = await Promise.all([
      fetch(`${base}/api/users/dashboard`, { headers: { "x-auth-token": userAuthToken } }),
      fetch(`${base}/api/users/get-user-businesses`, { headers: { "x-auth-token": userAuthToken } }),
      fetch(`${base}/api/users/get-user-packages`, { headers: { "x-auth-token": userAuthToken } }),
    ]);

    const dashJson = dashRes.ok ? await dashRes.json() : {};
    const bizJson = bizRes.ok ? await bizRes.json() : {};
    const pkgJson = pkgRes.ok ? await pkgRes.json() : {};

    setUser(dashJson.user || null);
    setBusinesses(bizJson.businesses || []);
    setPackages(pkgJson.packages || []);
  } catch (err) {
    console.error("Failed to load dashboard data:", err);
    router.push("/login");
  }
}

loadData();


}, [userAuthToken, router]);

// memoized lists
const activeBusinesses = useMemo(() => businesses.filter(b => b.Status === 5), [businesses]);
const inProgressBusinesses = useMemo(() => businesses.filter(b => b.Status !== 5), [businesses]);

const filteredBusinesses = useMemo(() => {
const list = activeTab === "activeBusinesses" ? activeBusinesses : inProgressBusinesses;
const q = (searchQuery || "").trim().toLowerCase();
if (!q) return list;
return list.filter(b => (b.BusinessName || "").toLowerCase().includes(q));
}, [activeTab, searchQuery, activeBusinesses, inProgressBusinesses]);

const totalPages = Math.max(1, Math.ceil(filteredBusinesses.length / itemsPerPage));
const paginatedBusinesses = useMemo(() => {
const start = (currentPage - 1) * itemsPerPage;
return filteredBusinesses.slice(start, start + itemsPerPage);
}, [filteredBusinesses, currentPage, itemsPerPage]);

// helper: packages linked by PartnerID
const getPackagesForPartner = (partnerId) => packages.filter(p => String(p.PartnerID) === String(partnerId));

// handlers
const goToPage = (page) => {
if (page < 1) page = 1;
if (page > totalPages) page = totalPages;
setCurrentPage(page);
window.scrollTo({ top: 0, behavior: "smooth" });
};

const handlePayment = (subscriptionId) => {
// open payment flow for partner
//alert(`Proceed to payment for PartnerID:${subscriptionId}`);
// e.g. router.push(/payment?partnerId=${partnerId})
};

const handleAddDetails = (PartnerId) => {
// open add-details flow - either subscription id or partner id depending on context
alert(`Open add details for ID: ${PartnerId}`);
// e.g. router.push(/business/add-details/${subscriptionIdOrPartnerId})
};

const openAddDetailsModal = (partnerId) => {
setSelectedPartnerId(partnerId);
setShowModal(true);
};

const closeModal = () => {
setShowModal(false);
setSelectedPartnerId(null);
};

const formatDate = (d) => {
if (!d) return "-";
try {
return new Date(d).toLocaleDateString();
} catch {
return d;
}
};


if (!user) return <p className="min-h-screen bg-gray-50 flex justify-center items-center">Loading...</p>;

// UI: single white wrapper with shadow (tabs/search/cards/pagination inside)
return (
<div className="min-h-screen bg-gray-50 text-gray-800 py-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Page header (NOT inside shadow) */}
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user.UserFullName}</h1>
        <p className="text-sm text-gray-600 mt-1">Your businesses & packages</p>
      </div>
      {/* <div className="flex items-center gap-2">
        <button
          onClick={() => { destroyCookie(null, "userAuthToken"); router.push("/register"); }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div> */}
    </div>

    {/* SINGLE SHARED SHADOW WRAPPER */}
    <div className="bg-white shadow-xl rounded-xl p-6">

      {/* Tabs row (inside wrapper) */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => { setActiveTab("activeBusinesses"); setCurrentPage(1); }}
          className={`px-5 py-3 rounded-lg font-semibold ${activeTab === "activeBusinesses" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Active Businesses ({activeBusinesses.length})
        </button>

        <button
          onClick={() => { setActiveTab("inProgress"); setCurrentPage(1); }}
          className={`px-5 py-3 rounded-lg font-semibold ${activeTab === "inProgress" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          In-Progress Businesses ({inProgressBusinesses.length})
        </button>
      </div>

      {/* Search + page size */}
      <div className="mt-6 p-4 flex flex-col sm:flex-row justify-between bg-gray-50 mb-6 gap-4">
        <input
          type="text"
          placeholder="Search business..."
          className="w-full sm:w-1/2 px-3 py-2 bg-white border border-gray-300 rounded"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
        />

        <div className="flex items-center gap-3">
          <label className="text-sm">Show</label>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm">per page</span>
        </div>
      </div>

      {/* Business + Package cards (each row is a light-gray bordered block inside same wrapper) */}
      <div className="space-y-6">
        {paginatedBusinesses.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded text-center">No businesses found.</div>
        ) : (
          paginatedBusinesses.map((b) => {
            const pkgs = getPackagesForPartner(b.PartnerID);

            return (
              <div key={b.PartnerID} className="rounded-xl p-6 bg-gray-50 shadow-md transition">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* LEFT: Business details */}
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Business Details</h2>

                    <div className="flex items-start gap-4 border border-gray-300 rounded-lg p-4 bg-white mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{b.BusinessName}</h3>
                        <p className="text-sm text-gray-600 mt-2"> <strong>Category: </strong>{b.category?.CatName || "N/A"}</p>

                        <p className="mt-3 text-sm text-gray-700">
                          <strong>Contact:</strong> {b.ContactName || "-"}                       
                        </p>
                        <p className="mt-3 text-sm text-gray-700">              
                          <strong> Email:</strong> {b.Email || "-"}                          
                        </p>
                        <p className="mt-3 text-sm text-gray-700">                       
                          <strong> Phone:</strong> {b.Phone || "-"}
                        </p>
                        <p className="mt-3 text-sm text-gray-700">
                          <strong>Listing ID:</strong> {b.ListingID || "N/A"}                      
                        </p>
                        <p className="mt-3 text-sm text-gray-700">                      
                          <strong> Applied:</strong> {formatDate(b.AppliedDate || b.CreatedDate)}
                        </p>
                         {/* Buttons area */}
                    <div className="mt-4 flex gap-3">
                      {/* Make Payment: only for Approved (3) and only when viewing In-Progress tab */}
                     
                      {/* Business-level Add Details when business status is Request Info (2) */}
                      {/* {activeTab === "inProgress" && b.Status === 2 && (
                        <button
                          onClick={() => handleAddDetails(b.PartnerID)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          Add Details
                        </button>
                      )} */}
                           {activeTab === "inProgress" && b.Status === 2 && (
                      <button onClick={() => openAddDetailsModal(b.PartnerID)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Add Details</button>
                    )}
                       {activeTab === "inProgress" && b.Status !== 2 && (
                      <button onClick={() => openAddDetailsModal(b.PartnerID)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">View Details</button>
                    )}
                    </div>
                      </div>

                      {/* status badge float-right */}
                      <div className="shrink-0">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusLabels[b.Status]?.color || "bg-gray-100 text-gray-800"} float-right`}>
                          {statusLabels[b.Status]?.label || "Unknown"}
                        </span>
                      </div>
                    </div>

                   
                  </div>

                  {/* RIGHT: Selected Package */}
                  <div className="border-gray-300 pl-6">
                    <h2 className="text-lg font-semibold mb-3">Selected Package</h2>

                    {pkgs.length === 0 ? (
                      <p className="text-gray-500 text-sm">No packages found for this business.</p>
                    ) : (
                      pkgs.map((p) => {
                        const statusLower = String(p.Status || "").toLowerCase();
                        const isRequestInfo = statusLower === "2" || statusLower.includes("request");
                        const isPending = statusLower === "pending" || statusLower === "1";
                        const badgeClass = isRequestInfo ? "bg-orange-100 text-orange-800" : isPending ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800";

                        return (
                          <div key={p.SubscriptionID} className="border border-gray-300 rounded-lg p-4 bg-white mb-3">
                            <div className="flex justify-between items-start">
                              <div>
                               <h4 className="font-semibold text-lg">{p.package?.PackageName || "Package"}</h4>
  <p className="text-sm mt-2">
   {p.package?.Description || "-"}
  </p>
  <p className="text-sm mt-2">
    <strong>Duration:</strong> {p.package?.DurationInDays || "N/A"} days
  </p>
  <p className="text-sm mt-2">
    <strong>Price:</strong> Ksh {p.PackagePrice || "N/A"}
  </p>
 <p className="text-sm mt-2">
    <strong>Start Date:</strong> {p.StartDate ? formatDate(p.StartDate) : "N/A"}
  </p>
  <p className="text-sm mt-2">
    <strong>End Date:</strong> {p.EndDate ? formatDate(p.EndDate) : "N/A"}
  </p>
                              </div>

                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
                                {statusLabels[p.Status]?.label || String(p.Status || "").toUpperCase() || "UNKNOWN"}
                              </span>
                            </div>

                            
                             {activeTab === "inProgress" && p.Status === String(p.Status) && (
                        <button
                          onClick={() => handlePayment(p.SubscriptionID)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Make Payment
                        </button>
                      )}

                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination row (inside same wrapper) */}
      <div className="mt-6 p-4 flex items-center justify-between bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing {filteredBusinesses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          {" "}to {Math.min(currentPage * itemsPerPage, filteredBusinesses.length)} of {filteredBusinesses.length}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <div className="px-3 py-1 text-sm">Page {currentPage} / {totalPages}</div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    {/* END single wrapper */}

     {/* modal */}
    {showModal && (
      <PartnerDetailsModal partnerId={selectedPartnerId} isOpen={showModal} onClose={closeModal} />
    )}
  </div>
</div>


);
}