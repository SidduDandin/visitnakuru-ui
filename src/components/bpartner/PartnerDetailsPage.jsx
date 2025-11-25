
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";


const ALL_STATUS_MAP = {
    1: { label: "Pending Review", style: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    2: { label: "Needs Info", style: "bg-orange-100 text-orange-800 border-orange-200" },
    3: { label: "Approved (Pre-Active - Payment Pending)", style: "bg-lime-100 text-lime-800 border-lime-200" }, 
    4: { label: "Rejected", style: "bg-red-100 text-red-800 border-red-200" },
    5: { label: "Active", style: "bg-green-100 text-green-800 border-green-200" },
    6: { label: "Expired", style: "bg-purple-100 text-purple-800 border-purple-200" },
    7: { label: "Blocked", style: "bg-red-500 text-white border-red-600" }, 
};


const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};




const getAssetUrl = (backendBaseUrl, item) => {
    if (!item) return "#";
   
    const dbPath = item.FilePath || ""; 
    if (!dbPath) return "#";
    const baseUrl = backendBaseUrl.replace(/\/$/, ""); 
    const cleanedDbPath = dbPath.startsWith('/') ? dbPath.substring(1) : dbPath; 
    return `${baseUrl}/${cleanedDbPath}`;
};

const isImage = (filename) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const formatDate2 = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};


const formatCurrency = (amount) => {
    if (!amount) return "0.00";
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
};

const LabelValue = ({ label, value, isLink = false, linkUrl = "#" }) => (
    <div className="mb-4">
        <h5 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-1">{label}</h5>
        {isLink && value ? (
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline truncate block">{value}</a>
        ) : (
            <p className="text-gray-900 dark:text-gray-100 font-medium text-base break-words">
                {value || <span className="text-gray-400 italic text-sm">Not provided</span>}
            </p>
        )}
    </div>
);

const SectionHeader = ({ title, icon }) => (
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xl">{icon}</span>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white uppercase">{title}</h3>
    </div>
);

export default function PartnerDetailsPage({ partnerId }) {
    const router = useRouter();
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [actionLoading, setActionLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', msg: '' });
    
    const [confirmModal, setConfirmModal] = useState({ show: false, status: 0, title: '', message: '' });
    const [requestInfoModal, setRequestInfoModal] = useState({ 
        show: false, 
        reason: '', 
        error: '' 
    });

    const [agreementModal, setAgreementModal] = useState(false);

    const [rejectReason, setRejectReason] = useState("");
    const [rejectError, setRejectError] = useState("");

    const [blockReason, setBlockReason] = useState("");
    const [blockError, setBlockError] = useState("");

    const [successModal, setSuccessModal] = useState({ show: false, title: '', message: '' });

    const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const [historyModal, setHistoryModal] = useState({ 
        show: false, 
        loading: false, 
        error: '',
    });
    const [subscriptions, setSubscriptions] = useState([]);
    const [historyPagination, setHistoryPagination] = useState({
        currentPage: 1,
        rowsPerPage: 10,
        totalCount: 0,
        totalPages: 1,
    });

    const fetchPartnerDetails = useCallback(async () => {
        if (!partner) setLoading(true); 
        try {
            const token = getCookie("authToken");
            if (!token) throw new Error("Authentication token missing.");

            const res = await fetch(`${backendBaseUrl}/api/bpartner/${partnerId}`, {
                headers: { "x-auth-token": token },
            });

            if (!res.ok) throw new Error("Failed to fetch partner details.");
            const data = await res.json();
            setPartner(data.partner);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [partnerId, backendBaseUrl, partner]);

    useEffect(() => {
        fetchPartnerDetails();
    }, []); 

    const initiateAction = (status, title, message) => {
        if (status === 2) { 
            setRequestInfoModal({ show: true, reason: '', error: '' });
            setConfirmModal({ show: false, status, title, message }); 
        } else {
            if (status === 4) {
                setRejectReason("");
                setRejectError("");
            }else if (status === 7) { 
                setBlockReason("");
                setBlockError("");
            }
            setConfirmModal({ show: true, status, title, message });
        }
    };

    const handleStatusUpdate = async () => {
        let reasonToSend = "";

        
        if (confirmModal.status === 2) {
            if (!requestInfoModal.reason.trim()) {
                setRequestInfoModal(prev => ({ ...prev, error: "Please provide the list of details you want from the onboarding partner." }));
                return;
            }
            reasonToSend = requestInfoModal.reason.trim();
        }

        
        if (confirmModal.status === 4) {
            if (!rejectReason.trim()) {
                setRejectError("Please provide a reason for rejection.");
                return;
            }
            reasonToSend = rejectReason.trim();
        }

        if (confirmModal.status === 7) {
            if (!blockReason.trim()) {
                setBlockError("Please provide a reason for blocking this partner.");
                return;
            }
            reasonToSend = blockReason.trim();
        }

        setActionLoading(true);
        setNotification({ show: false, type: '', msg: '' });

        try {
            const token = getCookie("authToken");
            if (!token) {
                setNotification({ show: true, type: 'error', msg: "Auth token missing. Please login again." });
                return;
            }

            const res = await fetch(`${backendBaseUrl}/api/bpartner/${partnerId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token,
                },
                body: JSON.stringify({ 
                    status: confirmModal.status, 
                    Requestmoreinfo: reasonToSend 
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || "Failed to update status");
            }

            setRequestInfoModal({ show: false, reason: '', error: '' });
            setConfirmModal({ ...confirmModal, show: false });

            let successMsg = `Success! Status updated to ${confirmModal.title}.`;
            if(confirmModal.status === 2) {
                successMsg = "Request for information has been submitted successfully.";
            } else if (confirmModal.status === 4) {
                successMsg = "Application rejected. The partner has been notified with the reason.";
            }
            else if (confirmModal.status === 7) {
                 successMsg = "Partner blocked successfully. The partner has been notified.";
            } else if (confirmModal.status === 5) {
                 successMsg = "Partner unblocked successfully and status is now Active.";
            }

            setSuccessModal({
                show: true,
                title: "Action Successful",
                message: successMsg
            });
           
            await fetchPartnerDetails(); 

        } catch (err) {
            setNotification({ show: true, type: 'error', msg: err.message });
        } finally {
            setActionLoading(false);
        }
    };

    // const getStatusBadge = (status) => {
    //     const styles = {
    //         1: "bg-yellow-100 text-yellow-800 border-yellow-200",
    //         2: "bg-orange-100 text-orange-800 border-orange-200",
    //         3: "bg-green-100 text-green-800 border-green-200",
    //         4: "bg-red-100 text-red-800 border-red-200",
    //     };
    //     const labels = { 1: "Pending Review", 2: "Needs Info", 3: "Active", 4: "Rejected" };
    //     return (
    //         <span className={`px-4 py-1 rounded-full text-sm font-bold border ${styles[status] || "bg-gray-100 text-gray-800"}`}>
    //             {labels[status] || "Unknown"}
    //         </span>
    //     );
    // };

    const getStatusBadge = (status) => {
        const statusData = ALL_STATUS_MAP[status] || { label: "Unknown", style: "bg-gray-100 text-gray-800" };
        return (
            <span className={`px-4 py-1 rounded-full text-sm font-bold border ${statusData.style}`}>
                {statusData.label}
            </span>
        );
    };

    const fetchSubscriptions = useCallback(async (page = historyPagination.currentPage, rows = historyPagination.rowsPerPage) => {
    setHistoryModal(p => ({ ...p, loading: true, error: '' }));
    try {
        const token = getCookie('authToken');
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await fetch(`${backendBaseUrl}/api/bpartner/${partnerId}/subscriptions?page=${page}&rowsPerPage=${rows}`, {
            headers: {
                'x-auth-token': token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || "Failed to fetch subscription history.");
        }

        const data = await response.json();
        setSubscriptions(data.subscriptions);
        setHistoryPagination(data.pagination);

    } catch (err) {
        console.error("Subscription fetch error:", err);
        setHistoryModal(p => ({ ...p, error: err.message }));
        setSubscriptions([]);
        setHistoryPagination({ currentPage: 1, rowsPerPage: 10, totalCount: 0, totalPages: 1 });
    } finally {
        setHistoryModal(p => ({ ...p, loading: false }));
    }
}, [partnerId, backendBaseUrl]);



useEffect(() => {
    if (historyModal.show) {
        fetchSubscriptions(historyPagination.currentPage, historyPagination.rowsPerPage);
    }
}, [historyPagination.currentPage, historyPagination.rowsPerPage, historyModal.show, fetchSubscriptions]);


const handleViewHistory = () => {
    setHistoryModal(p => ({ ...p, show: true }));
};


    if (loading && !partner) return <div className="flex h-screen items-center justify-center text-gray-500">Loading Data...</div>;
    if (error) return <div className="flex h-screen items-center justify-center text-red-600 font-bold">Error: {error}</div>;
    if (!partner) return null;


    const latestSubscription = partner.subscriptions && partner.subscriptions.length > 0 ? partner.subscriptions[0] : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 relative">
            
            {/* Error Notification */}
            {notification.show && notification.type === 'error' && (
                <div className="fixed top-5 right-5 z-[100] px-6 py-4 rounded shadow-lg text-white font-bold bg-red-600 animate-fade-in-down">
                    <div className="flex items-center gap-3">
                        <span>⚠️</span>
                        <span>{notification.msg}</span>
                        <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 opacity-75 hover:opacity-100 font-normal text-sm border border-white/30 px-2 rounded">Close</button>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {successModal.show && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 border border-green-500 transform transition-all scale-100 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{successModal.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                            {successModal.message}
                        </p>
                        <button 
                            onClick={() => setSuccessModal({ show: false, title: '', message: '' })}
                            className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Request Info Modal */}
            {requestInfoModal.show && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-700 transform transition-all scale-100">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request More Information</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                            Please specify what information is needed.
                        </p>
                        
                        <textarea
                            value={requestInfoModal.reason}
                            onChange={(e) => setRequestInfoModal({ ...requestInfoModal, reason: e.target.value, error: '' })}
                            rows="4"
                            className={`w-full p-3 border rounded-lg resize-none dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm ${requestInfoModal.error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            placeholder="E.g., Please provide a clear copy of the business permit..."
                            disabled={actionLoading}
                        />
                        {requestInfoModal.error && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{requestInfoModal.error}</p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                onClick={() => setRequestInfoModal({ show: false, reason: '', error: '' })}
                                className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm transition-colors"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleStatusUpdate}
                                className={`px-4 py-2 rounded-lg text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all
                                    ${actionLoading ? 'bg-gray-500' : 'bg-yellow-500 hover:bg-yellow-600'}
                                `}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Processing...</>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Confirmation Modal (Approve / Reject) */}
            {confirmModal.show && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 transform transition-all scale-100">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Action</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">{confirmModal.message}</p>
                        
                        {/* REJECTION REASON INPUT (Only visible if Status is 4) */}
                        {confirmModal.status === 4 && (
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                                    Reason for Rejection <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => { setRejectReason(e.target.value); setRejectError(""); }}
                                    className={`w-full p-3 border rounded-lg resize-none dark:bg-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500 text-sm ${rejectError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    rows="3"
                                    placeholder="Please explain why this application is being rejected..."
                                    disabled={actionLoading}
                                />
                                {rejectError && <p className="text-red-500 text-xs mt-1 font-medium">{rejectError}</p>}
                            </div>
                        )}

                        {confirmModal.status === 7 && (
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                                    Reason for Blocking <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={blockReason} 
                                    onChange={(e) => { setBlockReason(e.target.value); setBlockError(""); }} 
                                    className={`w-full p-3 border rounded-lg resize-none dark:bg-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500 text-sm ${blockError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} // Use blockError
                                    rows="3"
                                    placeholder="Please explain why this verified business partner is being blocked..."
                                    disabled={actionLoading}
                                />
                                {blockError && <p className="text-red-500 text-xs mt-1 font-medium">{blockError}</p>} 
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                                className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm transition-colors"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleStatusUpdate}
                                className={`px-4 py-2 rounded-lg text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all
                                    ${confirmModal.status === 4 ? 'bg-red-600 hover:bg-red-700' : 
                                      confirmModal.status === 3 ? 'bg-green-600 hover:bg-green-700' : 
                                      'bg-yellow-500 hover:bg-yellow-600'}
                                `}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Processing...</>
                                ) : (
                                    `Yes, ${confirmModal.title}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div>
                        <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline mb-2">&larr; Back to List</button>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{partner.BusinessName || "Unnamed Business"}</h1>
                         Listing ID: <span className="font-mono font-bold">{partner.ListingID || "N/A"}</span>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                         <div className="text-right">
                            <span className="text-xs uppercase text-gray-400 font-bold block">Verification Status</span>
                            {getStatusBadge(partner.Status)}
                         </div>
                         <p className="text-xs text-gray-400">Applied: {formatDate(partner.CreatedDate)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
            
                        {(partner.Status === 2 || partner.Status === 4 || partner.Status === 7) && partner.Requestmoreinfo && (
                            <div className={`p-6 rounded-xl shadow-sm border ${
                                partner.Status === 4 
                                    ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" 
                                    : partner.Status === 7
                                    ? "bg-red-100 border-red-400 dark:bg-red-900/40 dark:border-red-600" 
                                    : "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
                            }`}>
                                <SectionHeader 
                                    title={
                                        partner.Status === 4 ? "Reason for Rejection" : 
                                        partner.Status === 7 ? "Reason for Blocking" : 
                                        "Requested Information"
                                    } 
                                    icon={
                                        partner.Status === 4 ? "🚫" : 
                                        partner.Status === 7 ? "⛔" : 
                                        "⚠️"
                                    } 
                                />
                                <div className="text-sm font-medium whitespace-pre-line leading-relaxed text-gray-800 dark:text-gray-200">
                                    {partner.Requestmoreinfo}
                                </div>
                            </div>
                        )}

                        {/* Business Identification */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <SectionHeader title="Business Identification" icon="🏢" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <LabelValue label="Category" value={partner.category?.CatName} />
                                <LabelValue label="Subcategory" value={partner.subcategory?.CatName} />
                                <LabelValue label="Business Name" value={partner.BusinessName} />
                                <LabelValue label="Contact Person" value={partner.ContactName} />
                                <LabelValue label="Operating Hours" value={partner.OperatingHours} />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <SectionHeader title="Contact" icon="🌐" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <LabelValue label="Email" value={partner.Email} isLink linkUrl={`mailto:${partner.Email}`} />
                                <LabelValue label="Phone" value={partner.Phone} />
                                <LabelValue label="WhatsApp" value={partner.WhatsAppNumber} />
                                <LabelValue label="Website" value={partner.Website} isLink linkUrl={partner.Website} />
                                <LabelValue label="Address" value={partner.Address} />
                                
                            </div>
                             <div className="mt-4 pt-4 border-t dark:border-gray-700">
                                <h5 className="text-xs font-bold uppercase text-gray-500 mb-3">Social Media</h5>
                                <div className="flex gap-4 flex-wrap">
                                   {partner.FacebookLink && <a href={partner.FacebookLink} target="_blank" className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100 border border-blue-200">Facebook</a>}
                                    {partner.InstagramLink && <a href={partner.InstagramLink} target="_blank" className="px-3 py-1 bg-pink-50 text-pink-700 text-xs rounded hover:bg-pink-100 border border-pink-200">Instagram</a>}
                                     {partner.XLink && <a href={partner.XLink} target="_blank" className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded hover:bg-gray-200 border border-gray-300">X (Twitter)</a>}
                                     {!partner.FacebookLink && !partner.InstagramLink && !partner.XLink && <span className="text-sm text-gray-400 italic">No social links provided.</span>}
                                 </div>
                             </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <SectionHeader title="Description" icon="📝" />
                            <LabelValue label="Short" value={partner.ShortDescription} />
                            <div className="mt-4">
                                <h5 className="text-xs font-bold uppercase text-gray-500 mb-2">Full Description</h5>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm whitespace-pre-line max-h-60 overflow-y-auto">{partner.Description}</div>
                            </div>
                        </div>

                        {/* Subscriptions */}
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <SectionHeader title="Subscription & Billing" icon="💳" />
                            {latestSubscription ? (
                            //partner.subscriptions && partner.subscriptions.length > 0 ? (
                                
                                //partner.subscriptions.map((sub, idx) => (
                                    //key={idx} 
                                   <div  className="p-4 border border-green-300 bg-green-50 dark:bg-green-900/30 dark:border-green-700 rounded-lg mb-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-extrabold text-green-900 dark:text-green-200 text-xl">
                                                    {latestSubscription.package?.PackageName || "Unknown Package"}
                                                </h4>
                                                <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                                                    Duration: {latestSubscription.package?.DurationInDays ? `${latestSubscription.package.DurationInDays} Days` : "Not Available"} | Total Paid: {formatCurrency(latestSubscription.TotalAmount)}
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold uppercase rounded-full self-center whitespace-nowrap">
                                                {latestSubscription.Status || "Unknown"}
                                            </span>
                                        </div>
                                        <hr className="border-green-200 dark:border-green-800 my-2" />
                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-700 dark:text-gray-400">
                                            <div>
                                                <span className="font-medium text-gray-500 dark:text-gray-400">Validity:</span> 
                                                <p className="text-sm">
                                                    <span className="text-gray-600 dark:text-gray-300">{formatDate2(latestSubscription.StartDate)}</span> &rarr; 
                                                    <span className="font-bold text-red-500 dark:text-red-400"> {formatDate2(latestSubscription.EndDate)}</span>
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-500 dark:text-gray-400">Payment Details:</span>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {latestSubscription.PaymentMethod || "Not Available"} @ {formatCurrency(latestSubscription.PackagePrice) || "Not Available"}
                                                </p>
                                            </div>
                                            {/* <div>
                                                <span className="font-medium text-gray-500 dark:text-gray-400">
                                                    {sub.PaymentMethod ? "Payment Details:" : "Package Amount:"}
                                                </span>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {
                                                        sub.PaymentMethod && sub.PaymentMethod.trim() !== "" 
                                                            ? `${sub.PaymentMethod} @ ${formatCurrency(sub.PackagePrice) || "Not Available"}` 
                                                            : formatCurrency(sub.PackagePrice) || "Not Available"
                                                    }
                                                </p>
                                            </div> */}
                                            <div>
                                                <span className="font-medium text-gray-500 dark:text-gray-400">Transaction ID:</span>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {latestSubscription.TransactionID || "Not Available"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-500 dark:text-gray-400">Paid On:</span>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {latestSubscription.PaymentDate ? formatDate2(latestSubscription.PaymentDate) : "Not Available"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-2 bg-green-100 dark:bg-green-900/50 rounded text-xs italic text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">Description:</span> {latestSubscription.package?.Description || "No description provided."}
                                        </div>
                                    </div>

                                    
                                //))
                            ) : (
                                <p className="text-base text-gray-500 italic p-3">
                                    No active or past subscription records found for this partner.
                                </p>
                            )}
                            
                            <button
                                onClick={handleViewHistory}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-md disabled:opacity-50"
                                disabled={!partner || historyModal.loading}
                            >
                                
                                View Payment History
                            </button>
                        </div>
                       
                        {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                             <SectionHeader title="Agreements" icon="⚖️" />
                             {partner.agreements?.length > 0 ? (
                                <ul className="text-sm list-disc list-inside">
                                    {partner.agreements.map((agr, idx) => (
                                        <li key={idx}>Signed by {agr.SignedName} on {formatDate(agr.SignedDate)}</li>
                                    ))}
                                </ul>
                             ) : <p className="text-sm text-gray-500 italic">No agreements.</p>}
                        </div> */}

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <SectionHeader title="Agreements" icon="⚖️" />
                            {partner.agreements?.length > 0 ? (
                                <>
                                    <ul className="text-sm list-disc list-inside mb-4">
                                        {partner.agreements.map((agr, idx) => (
                                            <li key={idx}>Signed by {agr.SignedName} on {formatDate(agr.SignedDate)}</li>
                                        ))}
                                    </ul>
                                    <button 
                                        onClick={() => setAgreementModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View Agreement
                                    </button>
                                </>
                            ) : <p className="text-sm text-gray-500 italic">No agreements.</p>}
                        </div>
                    </div>

                 
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                             <SectionHeader title="Map" icon="📍" />
                             <LabelValue label="Link" value={partner.MapLink} isLink linkUrl={partner.MapLink} />
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <SectionHeader title="Documents" icon="📂" />
                            <div className="space-y-3">
                                {partner.documents?.map((doc, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                                        <div className="truncate pr-2">
                                            <p className="text-xs font-bold uppercase text-gray-500">{doc.DocumentType}</p>
                                            <p className="text-sm truncate">{doc.DocumentName}</p>
                                        </div>
                                        <a href={getAssetUrl(backendBaseUrl, doc)} target="_blank" rel="noopener noreferrer" className="text-blue-600 bg-blue-100 p-2 rounded-full hover:bg-blue-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </a>
                                    </div>
                                ))}
                                {(!partner.documents || partner.documents.length === 0) && <p className="text-sm text-gray-500 italic">No documents.</p>}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <SectionHeader title="Photos" icon="🖼️" />
                            <div className="grid grid-cols-2 gap-3">
                                {partner.photos?.map((photo, idx) => {
                                    const fileUrl = getAssetUrl(backendBaseUrl, photo);
                                    const isImg = isImage(photo.FileName);
                                    return (
                                        <div key={idx} className="relative group bg-gray-100 aspect-square rounded overflow-hidden border">
                                            {isImg ? (
                                                <img src={fileUrl} alt={photo.PhotoName} className="object-cover w-full h-full" onError={(e) => e.target.src = "https://placehold.co/100?text=No Image"} />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400 text-xs flex-col text-center p-1">
                                                    <span className="text-xl mb-1">📄</span>
                                                    <span>{photo.PhotoName}</span>
                                                </div>
                                            )}
                                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-xs font-bold transition-all">View</a>
                                        </div>
                                    )
                                })}
                                {(!partner.photos || partner.photos.length === 0) && <p className="col-span-2 text-sm text-gray-500 italic text-center">No photos.</p>}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <SectionHeader title="Videos" icon="🎥" />
                            <div className="space-y-2">
                                {partner.videos?.map((video, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded border text-sm">
                                        <span className="text-xl">📹</span>
                                        <a href={getAssetUrl(backendBaseUrl, video)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{video.FileName}</a>
                                    </div>
                                ))}
                                {(!partner.videos || partner.videos.length === 0) && <p className="text-sm text-gray-500 italic">No videos.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            {
                partner.Status !== 6 &&(
                  <div className="mt-10 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border-t-4 border-blue-500 flex flex-wrap justify-end gap-4 sticky bottom-4 z-10">
                    {([1, 2, 3, 4].includes(partner.Status)) && (
                        <>
                            <button 
                        disabled={partner.Status === 2 || actionLoading}
                        className="px-6 py-3 rounded-lg font-bold bg-yellow-500 hover:bg-yellow-600 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => initiateAction(2, "Request More Info", "Are you sure you want to request more information from this partner?")}
                    >
                        Request Info
                    </button>

                    <button 
                         disabled={partner.Status === 4 || actionLoading}
                        className="px-6 py-3 rounded-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => initiateAction(4, "Reject Application", "Are you sure you want to reject this application permanently?")}
                    >
                        Reject
                    </button>

                    <button 
                         disabled={partner.Status === 3 || actionLoading}
                        className="px-6 py-3 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => initiateAction(3, "Approve & Publish", "Are you sure you want to approve this partner’s documents and enable the Pay to List option?")}
                    >
                        Approve & Publish
                    </button>
                    </>
                    )}

                    {partner.Status === 5 && (
                            <button 
                                 disabled={actionLoading}
                                className="px-6 py-3 rounded-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => initiateAction(7, "Block Partner", "Are you sure you want to BLOCK this active partner?", true)} 
                            >
                                Block
                            </button>
                        )}
                        
                       
                        {partner.Status === 7 && (
                            <button 
                                 disabled={actionLoading}
                                className="px-6 py-3 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => initiateAction(5, "Unblock Partner", "Are you sure you want to UNBLOCK this partner and make them Active?", true)} 
                            >
                                Unblock
                            </button>
                        )}

                </div>
                )
            }
                

            </div>


            {/* Agreement Text Modal */}
{agreementModal && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-opacity">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-gray-200 dark:border-gray-700 transform scale-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>⚖️</span> Partner Agreements
                </h3>
                {/* <button 
                    onClick={() => setAgreementModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button> */}
            </div>

            {/* Modal Content */}
            <div className="flex-grow overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
                {partner.agreements?.map((agr, idx) => (
                    <div key={idx} className="mb-8 last:mb-0">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-800 rounded uppercase">
                               Agreement {/* Agreement #{idx + 1} */}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Signed by <span className="text-gray-900 dark:text-white">{agr.SignedName}</span> on {formatDate(agr.SignedDate)}
                            </span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {agr.AgreementText || "No text content available for this agreement."}
                            </pre>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl text-right">
                <button 
                    onClick={() => setAgreementModal(false)}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}


            {historyModal.show && (
<div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-5xl mx-4 my-10 overflow-y-auto max-h-[85vh] transform transition-all duration-300 scale-100">
            
            {/* Modal Header */}
            <div className="sticky top-0 p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-10 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    
                    Partner Subscription & Payment History
                </h3>
                <button 
                    onClick={() => setHistoryModal({ show: false, loading: false, error: '' })}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    aria-label="Close"
                >
                    
                </button>
            </div>

            {/* Modal Body with Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-6">
                
                {historyModal.loading && (
                    <div className="flex justify-center items-center h-full">
                      
                        <p className="ml-3 text-lg text-gray-600 dark:text-gray-300">Loading payment history...</p>
                    </div>
                )}

                {historyModal.error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300" role="alert">
                        <span className="font-medium">Error:</span> {historyModal.error}
                    </div>
                )}
                
                {!historyModal.loading && !historyModal.error && (
                    <>
                        {subscriptions.length === 0 ? (
                            <div className="text-center p-10">
                                <p className="text-xl text-gray-500 dark:text-gray-400">No subscription history found for this partner.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            {["Package Name", "Package Price", "Total Amount", "Payment Method", "Transaction ID", "Paid Date", "Status", "Start Date", "End Date"].map((header) => (
                                                <th
                                                    key={header}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {subscriptions.map((sub, index) => (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sub.PackageName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(sub.PackagePrice)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-semibold">{formatCurrency(sub.TotalAmount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{sub.PaymentMethod || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 break-words max-w-xs overflow-hidden">{sub.TransactionID || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate2(sub.PaymentDate)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {/* Assuming a simple status display based on common values */}
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.Status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                                        {sub.Status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate2(sub.StartDate)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate2(sub.EndDate)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {/* Pagination Controls */}
                        {historyPagination.totalCount > historyPagination.rowsPerPage && (
                            <div className="flex justify-between items-center mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {(historyPagination.currentPage - 1) * historyPagination.rowsPerPage + 1} to{" "}
                                    {Math.min(historyPagination.currentPage * historyPagination.rowsPerPage, historyPagination.totalCount)} of{" "}
                                    {historyPagination.totalCount} records
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        disabled={historyPagination.currentPage === 1 || historyModal.loading}
                                        onClick={() => setHistoryPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))}
                                        className="px-3 py-1 border rounded-lg disabled:opacity-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
                                    >
                                        Prev
                                    </button>
                                    <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
                                        Page {historyPagination.currentPage} of {historyPagination.totalPages || 1}
                                    </span>
                                    <button
                                        disabled={historyPagination.currentPage === historyPagination.totalPages || historyModal.loading || historyPagination.totalCount === 0}
                                        onClick={() => setHistoryPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
                                        className="px-3 py-1 border rounded-lg disabled:opacity-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
             {/* Modal Footer */}
            <div className="sticky bottom-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-right">
                 <button 
                    onClick={() => setHistoryModal({ show: false, loading: false, error: '' })}
                    className="px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
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

