"use client";
import { useEffect, useState, useMemo } from "react";
import { destroyCookie, parseCookies } from "nookies";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
const { userAuthToken } = parseCookies();
const router = useRouter();

const [user, setUser] = useState(null);
const [businesses, setBusinesses] = useState([]);
const [packages, setPackages] = useState([]);
const [activeTab, setActiveTab] = useState("activeBusinesses");
const [searchQuery, setSearchQuery] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);

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
const dashJson = await dashRes.json();
const bizJson = await bizRes.json();
const pkgJson = await pkgRes.json();
    setUser(dashJson.user || null);
    setBusinesses(bizJson.businesses || []);
    setPackages(pkgJson.packages || []);
  } catch (error) {
    console.error(error);
    router.push("/login");
  }
}
loadData();

}, [userAuthToken, router]);

const activeBusinesses = useMemo(() => businesses.filter((b) => b.Status === 5), [businesses]);
const inProgressBusinesses = useMemo(() => businesses.filter((b) => b.Status !== 5), [businesses]);

const filteredBusinesses = useMemo(() => {
const list = activeTab === "activeBusinesses" ? activeBusinesses : inProgressBusinesses;
const q = searchQuery.trim().toLowerCase();
return q ? list.filter((b) => (b.BusinessName || "").toLowerCase().includes(q)) : list;
}, [activeTab, searchQuery, activeBusinesses, inProgressBusinesses]);

const totalPages = Math.max(1, Math.ceil(filteredBusinesses.length / itemsPerPage));
const paginatedBusinesses = useMemo(() => {
const start = (currentPage - 1) * itemsPerPage;
return filteredBusinesses.slice(start, start + itemsPerPage);
}, [filteredBusinesses, currentPage, itemsPerPage]);

const getPackagesForPartner = (partnerId) => packages.filter((p) => String(p.PartnerID) === String(partnerId));

const goToPage = (page) => {
if (page < 1) page = 1;
if (page > totalPages) page = totalPages;
setCurrentPage(page);
window.scrollTo({ top: 0, behavior: "smooth" });
};

const handlePayment = (partnerId) => alert(`Proceed to payment for PartnerID: ${partnerId}`);
const handleAddDetails = (subscriptionId) => alert(`Add details for SubscriptionID: ${subscriptionId}`);
const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

if (!user) return <p className="p-6 text-center">Loading...</p>;

return (
  <div className="min-h-screen bg-gray-100 text-gray-800 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.UserFullName}</h1>
            <p className="text-sm text-gray-600 mt-1">Your businesses & packages</p>
          </div>
          <button
            onClick={() => { destroyCookie(null, "userAuthToken"); router.push("/register"); }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      {/* ---- ONE SINGLE BOX SHADOW WRAPPER START ---- */}
      <div className="bg-white shadow-xl rounded-xl p-6">

        {/* Header (no shadow) */}
      

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => { setActiveTab("activeBusinesses"); setCurrentPage(1); }}
            className={`px-5 py-3 rounded-lg font-semibold ${
              activeTab === "activeBusinesses"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Active Businesses ({activeBusinesses.length})
          </button>

          <button
            onClick={() => { setActiveTab("inProgress"); setCurrentPage(1); }}
            className={`px-5 py-3 rounded-lg font-semibold ${
              activeTab === "inProgress"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            In-Progress Businesses ({inProgressBusinesses.length})
          </button>
        </div>

        {/* Search Row */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search business..."
            className="w-full sm:w-1/2 px-3 py-2 border rounded"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />

          <div className="flex items-center gap-3">
            <label className="text-sm">Show</label>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 border rounded"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm">per page</span>
          </div>
        </div>

        {/* Business + Packages Inside Same Shadow */}
        <div className="space-y-6">
          {paginatedBusinesses.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded text-center">No businesses found.</div>
          ) : (
            paginatedBusinesses.map((b) => {
              const pkgs = getPackagesForPartner(b.PartnerID);

              return (
                <div
                  key={b.PartnerID}
                  className="border rounded-xl p-6 bg-gray-50 hover:shadow-md transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* LEFT: Business Info */}
                    <div>
                      <h3 className="text-xl font-semibold">{b.BusinessName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {b.category?.CatName || "N/A"}
                      </p>

                      <p className="text-sm text-gray-700 mt-2">
                        <strong>Contact:</strong> {b.ContactName || "-"} |
                        <strong> Email:</strong> {b.Email || "-"} |
                        <strong> Phone:</strong> {b.Phone || "-"}
                      </p>

                      <p className="text-xs text-gray-500 mt-2">
                        <strong>Listing ID:</strong> {b.ListingID || b.PartnerID} |
                        <strong> Applied:</strong> {formatDate(b.AppliedDate || b.CreatedDate)}
                      </p>

                      {/* Status Pill */}
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm ${
                            statusLabels[b.Status]?.color
                          }`}
                        >
                          {statusLabels[b.Status]?.label}
                        </span>
                      </div>

                      {/* Payment Button (ONLY Approved + inProgress tab) */}
                      {activeTab === "inProgress" && b.Status === 3 && (
                        <button
                          onClick={() => handlePayment(b.PartnerID)}
                          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Make Payment
                        </button>
                      )}
                    </div>

                    {/* RIGHT: Packages */}
                    <div className="border-l pl-6">
                      <h4 className="font-semibold mb-3">Packages</h4>

                      {pkgs.length === 0 ? (
                        <p className="text-gray-500 text-sm">No packages found.</p>
                      ) : (
                        pkgs.map((p) => {
                          const statusStr = String(p.Status).toLowerCase();
                          const isRequestInfo =
                            statusStr === "2" || statusStr.includes("request");

                          return (
                            <div
                              key={p.SubscriptionID}
                              className="border rounded-lg p-4 bg-white mb-3"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-semibold">
                                    {p.package?.PackageName || "Package"}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    Price: ${p.PackagePrice ?? "-"}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Start: {formatDate(p.StartDate)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    End: {formatDate(p.EndDate)}
                                  </p>
                                </div>

                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    isRequestInfo
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {statusLabels[p.Status]?.label || p.Status}
                                </span>
                              </div>

                              {/* Request Info Button */}
                              {isRequestInfo && (
                                <button
                                  onClick={() => handleAddDetails(p.SubscriptionID)}
                                  className="mt-3 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                                >
                                  Add Details
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

        {/* Pagination */}
        <div className="mt-6 p-4 flex items-center justify-between bg-gray-50 border rounded-lg">
          <div className="text-sm">
            Showing{" "}
            {filteredBusinesses.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}{" "}
            to {Math.min(currentPage * itemsPerPage, filteredBusinesses.length)} of{" "}
            {filteredBusinesses.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-white border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>Page {currentPage} / {totalPages}</span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-white border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ---- ONE SINGLE BOX SHADOW WRAPPER END ---- */}
    </div>
  </div>
);

}
