"use client";
import React, { useEffect, useState, useRef } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
/**
 * PartnerDetailsModal.jsx
 * Minimal edits to your UI — changed submit packing so each file is paired
 * with a docKey_<index> field (guarantees backend alignment).
 */

// (CATEGORY_DOCS_MAP and DOC_LABELS unchanged — copy from your existing file)
const CATEGORY_DOCS_MAP = {
  Hotel: ["BUSINESS_REGISTRATION", "COUNTY_PERMIT", "HEALTH_SAFETY", "MANAGER_ID"],
  Lodge: ["BUSINESS_REGISTRATION", "COUNTY_PERMIT", "HEALTH_SAFETY", "MANAGER_ID"],
  "Serviced Apartment": ["BUSINESS_REGISTRATION", "COUNTY_PERMIT", "MANAGER_ID"],
  "Airbnb & Homestay": ["BUSINESS_REGISTRATION", "COUNTY_PERMIT", "MANAGER_ID"],
  Restaurant: ["FOOD_HYGIENE", "COUNTY_PERMIT", "MENU_SAMPLE", "MANAGER_ID"],
  Café: ["FOOD_HYGIENE", "COUNTY_PERMIT", "MENU_SAMPLE", "MANAGER_ID"],
  "Nyama Choma Joint": ["FOOD_HYGIENE", "COUNTY_PERMIT", "MENU_SAMPLE", "MANAGER_ID"],
  "Bar/Club/Lounge": ["FOOD_HYGIENE", "COUNTY_PERMIT", "MENU_SAMPLE", "MANAGER_ID"],
  "Taxi Operator": ["TRA_LICENSE", "VEHICLE_INSURANCE", "DRIVER_LICENSE", "BUSINESS_REGISTRATION"],
  "Car Hire/Rental": ["TRA_LICENSE", "VEHICLE_INSURANCE", "DRIVER_LICENSE", "BUSINESS_REGISTRATION"],
  "Shuttle Service": ["TRA_LICENSE", "VEHICLE_INSURANCE", "BUSINESS_REGISTRATION"],
  "Tour/Safari Operator": ["TRA_LICENSE", "VEHICLE_INSURANCE", "BUSINESS_REGISTRATION"],
  "Shop/Boutique": ["BUSINESS_REGISTRATION", "TRADING_LICENSE", "PROOF_OF_LOCATION"],
  "Mall/Market": ["BUSINESS_REGISTRATION", "TRADING_LICENSE", "PROOF_OF_LOCATION"],
  "Beauty/Wellness": ["BUSINESS_REGISTRATION", "TRADING_LICENSE", "PROOF_OF_LOCATION"],
  "Professional Service": ["BUSINESS_REGISTRATION", "TRADING_LICENSE", "PROOF_OF_LOCATION"],
  "Event/Conference Centre": ["EVENT_PERMIT", "SOUND_LICENSE", "BUSINESS_REGISTRATION", "VENUE_IMAGES"],
  "Entertainment Venue": ["EVENT_PERMIT", "SOUND_LICENSE", "BUSINESS_REGISTRATION", "VENUE_IMAGES"],
  "Park/Nature Reserve": ["BUSINESS_REGISTRATION", "PERMIT_IF_APPLICABLE", "PROOF_OF_LOCATION"],
  "Cultural Centre/Art Gallery": ["BUSINESS_REGISTRATION", "PERMIT_IF_APPLICABLE", "PROOF_OF_LOCATION"],
  "Event Organizer": ["BUSINESS_REGISTRATION", "EVENT_REFERENCES", "PROOF_OF_LOCATION"],
};

const DOC_LABELS = {
  BUSINESS_REGISTRATION: "Business Registration Certificate / Certificate of Incorporation",
  COUNTY_PERMIT: "County Business Permit (Nakuru County)",
  HEALTH_SAFETY: "Fire & Health Safety Certificate",
  MANAGER_ID: "Manager / Director ID / Passport",
  FOOD_HYGIENE: "Food Hygiene Certificate",
  MENU_SAMPLE: "Menu / Price List",
  TRA_LICENSE: "Tourism License (TRA)",
  VEHICLE_INSURANCE: "Vehicle Insurance",
  DRIVER_LICENSE: "Driver's License",
  TRADING_LICENSE: "Trading / Business License",
  PROOF_OF_LOCATION: "Proof of Location (utility bill, lease, title deed)",
  EVENT_PERMIT: "Event Permit (if applicable)",
  SOUND_LICENSE: "Sound / DJ License (if applicable)",
  VENUE_IMAGES: "Venue Images / Floor Plans",
  PERMIT_IF_APPLICABLE: "Relevant Permit (if applicable)",
  EVENT_REFERENCES: "Past Event References / Client List",
  OTHER_DOC: "Additional Supporting Document",
};

const empty = (v) => (v === undefined || v === null ? "" : String(v));
const isKnownDocKey = (k) => !!DOC_LABELS[String(k).trim()];

export default function PartnerDetailsModal({ partnerId, isOpen, onClose, onSaved }) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";
  const cookies = parseCookies();
  const token = cookies.userAuthToken || "";
  //const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [toast, setToast] = useState(null);
  const [partner, setPartner] = useState(null);

  const [form, setForm] = useState({
    BusinessName: "",
    CategoryID: "",
    SubcategoryID: "",
    ContactName: "",
    Email: "",
    Phone: "",
    WhatsAppNumber: "",
    Address: "",
    MapLink: "",
    OperatingHours: "",
    FacebookLink: "",
    InstagramLink: "",
    XLink: "",
    Website: "",
    Description: "",
    ShortDescription: "",
    Requestmoreinfo:"",
  });

  // docs: DocumentID?, DocumentName?, FilePath?, docKey?, isNew?, file?, preview?, kind: 'required'|'other'
  const [docs, setDocs] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState(null);

  const contentRef = useRef(null);
  const MAX_DOCS_EXTRA = 10;
  const MAX_PHOTOS = 5;

  const TABS = [
    "Business Details",
    "Documents & Location",
    "Social Links",
    "Agreement",
    "Photos & Media",
    "Selected Package",
    "Review & Submit",
  ];

  const showToast = (type, message, ms = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), ms);
  };

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const makePreviewUrl = (objOrPath) => {
    if (!objOrPath) return "";
    if (typeof objOrPath === "string") {
      if (objOrPath.startsWith("http")) return objOrPath;
      return base + (objOrPath.startsWith("/") ? "" : "/") + objOrPath;
    }
    if (typeof objOrPath === "object") {
      if (objOrPath.preview) return objOrPath.preview;
      if (objOrPath.FilePath) {
        const fp = objOrPath.FilePath;
        if (fp.startsWith("http")) return fp;
        return base + (fp.startsWith("/") ? "" : "/") + fp;
      }
    }
    return "";
  };

  const extOf = (name = "") => (name.split(".").pop() || "").toLowerCase();

  // derive subcategory name
  const currentSubcatName =
    partner?.subcategory?.CatName || partner?.subCategoryName || form.SubcategoryID || "";

    const Requestmoreinfo =
     form.Requestmoreinfo || "";

  const requiredDocKeys = CATEGORY_DOCS_MAP[currentSubcatName] || [];

  const docsByKey = (docKey) =>
    docs.filter((d) => (d.docKey || d.DocumentName || "OTHER_DOC") === docKey);
  const otherDocs = docs.filter((d) => (d.docKey || d.DocumentName || "OTHER_DOC") === "OTHER_DOC");

  // Load partner details
  useEffect(() => {
    if (!isOpen || !partnerId) return;
    let cancelled = false;
    async function loadPartner() {
      setLoading(true);
      try {
        const res = await fetch(`${base}/api/partners/get-details/${partnerId}`, {
          headers: { "x-auth-token": token || "" },
        });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || !json.success) {
          showToast("error", json?.message || "Failed to load partner");
          setLoading(false);
          return;
        }
        const p = json.partner || {};
        setPartner(p);
        setForm({
          BusinessName: empty(p.BusinessName),
          CategoryID: empty(p.CategoryID),
          SubcategoryID: empty(p.SubcategoryID),
          ContactName: empty(p.ContactName),
          Email: empty(p.Email),
          Phone: empty(p.Phone),
          WhatsAppNumber: empty(p.WhatsAppNumber),
          Address: empty(p.Address),
          MapLink: empty(p.MapLink),
          OperatingHours: empty(p.OperatingHours),
          FacebookLink: empty(p.FacebookLink),
          InstagramLink: empty(p.InstagramLink),
          XLink: empty(p.XLink),
          Website: empty(p.Website),
          Description: empty(p.Description),
          ShortDescription: empty(p.ShortDescription),
          Requestmoreinfo: empty(p.Requestmoreinfo),
        });

        // Map DB docs -> our UI model
        const existingDocs = (p.documents || []).map((d) => {
          const key = isKnownDocKey(d.DocumentName) ? d.DocumentName : "OTHER_DOC";
          return {
            ...d,
            isNew: false,
            docKey: key,
            kind: key === "OTHER_DOC" ? "other" : "required",
            
          };
        });

      
        setDocs(existingDocs);

        setPhotos((p.photos || []).map((ph) => ({ ...ph, isNew: false })));
        setVideo((p.videos && p.videos[0]) ? { ...p.videos[0], isNew: false } : null);

        showToast("success", "Business Details loaded");
      } catch (err) {
        console.error(err);
        showToast("error", "Error loading partner");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadPartner();
    return () => { cancelled = true; };
  }, [isOpen, partnerId, base, token]);

  useEffect(() => {
    if (!isOpen) {
      setTab(1);
      setPartner(null);
      setDocs([]);
      setPhotos([]);
      setVideo(null);
      setToast(null);
      setLoading(false);
    }
  }, [isOpen]);

  // File handlers
  const onAddDocsForKey = (docKey) => (e) => {
    const filesArr = Array.from(e.target.files || []);
    if (!filesArr.length) return;
    const mapped = filesArr.map((f) => ({
      isNew: true,
      file: f,
      preview: URL.createObjectURL(f),
      FileName: f.name,
      DocumentName: docKey,
      docKey,
      kind: "required",
    }));
    setDocs((prev) => {
      // Remove any existing DB required doc for that key (so update flow will delete it)
      const filtered = prev.filter((d) => !(d.kind === "required" && d.docKey === docKey && !d.isNew));
      return [...filtered, ...mapped];
    });
  };

  const onAddOtherDocs = (e) => {
    const filesArr = Array.from(e.target.files || []);
    if (!filesArr.length) return;
    const mapped = filesArr.map((f) => ({
      isNew: true,
      file: f,
      preview: URL.createObjectURL(f),
      FileName: f.name,
      DocumentName: "OTHER_DOC",
      docKey: "OTHER_DOC",
      kind: "other",
    }));
    setDocs((prev) => [...prev, ...mapped]);
  };

  // allow ONLY other-doc removal
  const removeDoc = (docObj) => {
    if ((docObj.docKey || docObj.DocumentName || "OTHER_DOC") !== "OTHER_DOC") return;
    setDocs((prev) =>
      prev.filter((d) => {
        if (d.docKey !== "OTHER_DOC") return true;
        if (d.isNew && docObj.isNew && d.file === docObj.file) return false;
        if (!d.isNew && !docObj.isNew && d.DocumentID === docObj.DocumentID) return false;
        return true;
      })
    );
  };

  const onAddPhotos = (e) => {
    const filesArr = Array.from(e.target.files || []);
    if (!filesArr.length) return;
    if (photos.length + filesArr.length > MAX_PHOTOS) {
      showToast("error", `Max ${MAX_PHOTOS} photos allowed`);
      return;
    }
    const mapped = filesArr.map((f) => ({ isNew: true, file: f, preview: URL.createObjectURL(f), FileName: f.name }));
    setPhotos((prev) => [...prev, ...mapped]);
  };

  const removePhoto = (idx) => setPhotos((prev) => prev.filter((_, i) => i !== idx));

  const dragIndexRef = useRef(null);
  const onPhotoDragStart = (e, idx) => { dragIndexRef.current = idx; };
  const onPhotoDrop = (e, idx) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from == null || from === idx) return;
    setPhotos((prev) => {
      const c = [...prev];
      const [it] = c.splice(from, 1);
      c.splice(idx, 0, it);
      return c;
    });
    dragIndexRef.current = null;
  };

  const onAddVideo = (e) => {
    const f = (e.target.files && e.target.files[0]) || null;
    if (!f) return;
    if (video && !video.isNew) {
      showToast("error", "Only 1 video allowed");
      return;
    }
    setVideo({ isNew: true, file: f, preview: URL.createObjectURL(f), FileName: f.name });
  };
  const removeVideo = () => setVideo(null);

  // Submit handler (important changes: pair files with docKey_<index>)
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const fd = new FormData();

      // basic fields
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));

      // ALWAYS send existingDocs[] — even if empty
const keepDocs = docs.filter(d => !d.isNew && d.DocumentID);

if (keepDocs.length === 0) {
  // tell backend: no documents kept
  fd.append("existingDocs[]", "");
} else {
  keepDocs.forEach(d => {
    fd.append("existingDocs[]", String(d.DocumentID));
  });
}

console.log("FD: existingDocs[]", keepDocs.map(d => d.DocumentID));


      // 2) new documents -> we MUST pair each file with docKey_index
      const newDocs = docs.filter((d) => d.isNew && d.file);
      newDocs.forEach((d, i) => {
        // append file (ordering preserved by browser as added)
        fd.append("documents", d.file);
        // append a paired docKey using the upload index order
        // IMPORTANT: use indexes 0..n-1 for the uploaded documents in this submission
        fd.append(`docKey_${i}`, d.docKey || d.DocumentName || "OTHER_DOC");
      });

      // 3) photos
      const keptPhotos = photos.filter((p) => !p.isNew && p.PhotoID);
      if (keptPhotos.length === 0) {
        // explicit empty -> backend will treat as "remove all"
        fd.append("existingPhotos[]", "");
      } else {
        keptPhotos.forEach((p) => fd.append("existingPhotos[]", String(p.PhotoID)));
      }
      photos.filter((p) => p.isNew && p.file).forEach((p) => fd.append("photos", p.file));

      // 4) video
      if (video) {
        if (video.isNew && video.file) fd.append("videos", video.file);
        else if (!video.isNew && video.VideoID) fd.append("existingVideo", String(video.VideoID));
      } else {
        // explicit signal: no existing video
        fd.append("existingVideo", "");
      }

      const res = await fetch(`${base}/api/partners/update-details/${partnerId}`, {
        method: "POST",
        headers: { "x-auth-token": token || "" },
        body: fd,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast("error", json.message || "Failed to save");
        setLoading(false);
        return;
      }

      showToast("success", "Updated successfully");
      //router.push("/dashboard");
      window.location.href="/dashboard";
      if (typeof onSaved === "function") onSaved();
      setTimeout(() => onClose && onClose(), 400);
    } catch (err) {
      console.error(err);
      showToast("error", "Server error while saving");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ... UI markup is identical to yours, using the helper functions above.
  // For brevity, paste the UI markup from your existing file unchanged.
  // (The rest of the component's UI remains the same as the version you provided.)
  // Make sure TABS, currentSubcatName, docsByKey and other helpers remain in this file (they are).
  //
  // For space, I'm returning the same markup you already have (no visible UI changes),
  // which uses onAddDocsForKey, onAddOtherDocs, removeDoc, etc. as implemented above.

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-6">
      {/* ... paste the full modal UI from your existing file here (no changes required) ... */}
      {/* For brevity I omitted repeated markup – keep your existing template */}
      <div className="bg-white w-full max-w-7xl rounded-2xl shadow-2xl flex flex-col" style={{ maxHeight: "90vh", minHeight: "70vh" }}>
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold">Update Business Details</h2>
            <p className="text-sm text-gray-600 mt-1">Edit business information, documents and media</p>
            <h4 className="text-sm text-gray-600 mt-1">Request for: {Requestmoreinfo || "N/A"}</h4>
          </div>
          <button onClick={onClose} className="text-xl text-gray-500 hover:text-gray-800">✖</button>
        </div>

        {/* tabs and content — keep your original markup, using the handlers above */}
        {/* For the full working file use the large UI you already have. */}
        <div className="px-6 py-3 border-t border-b border-gray-200 bg-white sticky top-0 z-20">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {TABS.map((label, i) => {
              const active = tab === i + 1;
              return (
                <button
                  key={label}
                  onClick={() => { setTab(i + 1); if (contentRef.current) contentRef.current.scrollTop = 0; }}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition ${active ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div ref={contentRef} className="px-6 py-6 overflow-y-auto" style={{ flex: "1 1 auto" }}>
          {/* Copy the same content markup you have; the submitted handlers are already wired */}
          {/* ... */}
           {/* ... put your existing tab contents here ... */}
              {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="grid grid-cols-2 gap-6">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded col-span-2" />
              </div>
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          )}

          {!loading && (
            <div className="space-y-8">
              {/* TAB 1: Business Details */}
              {tab === 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Business Details</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <FormInput label="Business Name" value={form.BusinessName} onChange={(v) => setField("BusinessName", v)} />
                    <FormInput label="Category" value={partner?.category?.CatName || ""} disabled />
                    <FormInput label="Subcategory" value={partner?.subcategory?.CatName || ""} disabled />
                    <FormInput label="Contact Person" value={form.ContactName} onChange={(v) => setField("ContactName", v)} />
                    <FormInput label="Email" value={form.Email} onChange={(v) => setField("Email", v)} />
                    <FormInput label="Phone" value={form.Phone} onChange={(v) => setField("Phone", v)} />
                    <FormInput label="WhatsApp Number" value={form.WhatsAppNumber} onChange={(v) => setField("WhatsAppNumber", v)} />
                    <FormInput label="Operating Hours" value={form.OperatingHours} onChange={(v) => setField("OperatingHours", v)} />
                    <FormTextarea label="Short Description" value={form.ShortDescription} onChange={(v) => setField("ShortDescription", v)} />
                  </div>
                </div>
              )}

              {/* TAB 2: Documents & Location */}
              {tab === 2 && (
                <div>
                 
                  <h3 className="text-lg font-semibold mb-4">Required Documents ({currentSubcatName || "N/A"})</h3>
                  
                  {requiredDocKeys.length === 0 && <p className="text-sm text-gray-600 mb-4">No specific documents configured for this subcategory.</p>}

                  <div className="space-y-6">
                    {requiredDocKeys.map((docKey) => {
                      const label = DOC_LABELS[docKey] || docKey;
                      const keyDocs = docsByKey(docKey);
                      const hasFile = keyDocs.length > 0;

                      return (
                        <div key={docKey}>
                          <p className="font-semibold text-sm mb-1">{label}</p>
                          <div className={`border-2 border-dashed rounded-lg p-4 text-center text-sm ${hasFile ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
                            <label className="cursor-pointer block">
                              <span className="font-medium text-yellow-700">{hasFile ? "Replace document" : "Click or drag file here to upload"}</span>
                              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={onAddDocsForKey(docKey)} />
                              <div className="text-xs text-gray-500 mt-1">Allowed: PDF, JPG, PNG</div>
                            </label>

                            {hasFile && (
                              <div className="mt-3 space-y-1 text-left">
                                {keyDocs.map((d) => {
                                  const name = d.FileName || d.file?.name || d.OriginalFileName || d.DocumentName || "Document";
                                  const preview = d.isNew ? d.preview : makePreviewUrl(d.FilePath || d);
                                  const ext = extOf(name);
                                  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
                                  const key = docKey + "-" + (d.DocumentID || name);

                                  return (
                                    <div key={key} className="flex items-center justify-between bg-white rounded px-3 py-1 shadow-sm">
                                      <div className="flex items-center gap-2 truncate">
                                        {isImage && preview && <img src={preview} alt={name} className="w-8 h-8 rounded object-cover" />}
                                        <span className="text-xs truncate max-w-[200px]">{name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {preview && <a href={preview} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">View</a>}
                                        {/* no remove for required docs */}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Additional docs */}
                  <div className="mt-8">
                    <h4 className="text-md font-semibold mb-2">Additional Supporting Documents (Optional)</h4>
                    <div className="border border-dashed rounded-lg p-4">
                      <label className="cursor-pointer inline-block px-4 py-2 bg-white border border-gray-300 rounded text-sm">
                        Add Other Documents
                        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={onAddOtherDocs} />
                      </label>

                      {otherDocs.length > 0 && (
                        <div className="mt-3 space-y-1 text-left">
                          {otherDocs.map((d) => {
                            const name = d.FileName || d.file?.name || d.OriginalFileName || d.DocumentName || "Document";
                            const preview = d.isNew ? d.preview : makePreviewUrl(d.FilePath || d);
                            const ext = extOf(name);
                            const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
                            const key = "OTHER-" + (d.DocumentID || name);

                            return (
                              <div key={key} className="flex items-center justify-between bg-white rounded px-3 py-1 shadow-sm">
                                <div className="flex items-center gap-2 truncate">
                                  {isImage && preview && <img src={preview} alt={name} className="w-8 h-8 rounded object-cover" />}
                                  <span className="text-xs truncate max-w-[200px]">{name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {preview && <a href={preview} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">View</a>}
                                  <button type="button" onClick={() => removeDoc(d)} className="text-xs text-red-600">Remove</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="border-t mt-8 pt-6">
                    <h4 className="text-lg font-semibold mb-3">Location &amp; Contact Details</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <FormTextarea label="Full Address" value={form.Address} onChange={(v) => setField("Address", v)} />
                      <FormInput label="Map Link" value={form.MapLink} onChange={(v) => setField("MapLink", v)} />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Social Links */}
              {tab === 3 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Social &amp; Web Links (Optional)</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <FormInput label="Facebook Link" value={form.FacebookLink} onChange={(v) => setField("FacebookLink", v)} />
                    <FormInput label="Instagram Link" value={form.InstagramLink} onChange={(v) => setField("InstagramLink", v)} />
                    <FormInput label="X / Twitter" value={form.XLink} onChange={(v) => setField("XLink", v)} />
                    <FormInput label="Website" value={form.Website} onChange={(v) => setField("Website", v)} />
                  </div>
                </div>
              )}

              {/* TAB 4: Agreement */}
              {tab === 4 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Agreement (View Only)</h3>
                  <div className="p-4 rounded border bg-gray-50 text-sm text-gray-700 whitespace-pre-line">
                    {partner?.agreements?.[0]?.AgreementText || "No agreement found."}
                  </div>
                </div>
              )}

              {/* TAB 5: Photos & Media */}
              {tab === 5 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Photos &amp; Media</h3>

                  <div className="mb-6">
                    <p className="font-semibold text-sm mb-2">Photos (Max {MAX_PHOTOS}) — Drag to reorder</p>
                    <div className="flex gap-4 flex-wrap">
                      {photos.map((p, idx) => (
                        <div key={idx} draggable onDragStart={(e) => onPhotoDragStart(e, idx)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onPhotoDrop(e, idx)} className="relative">
                          <img src={p.preview || makePreviewUrl(p.FilePath || p)} alt={p.FileName || "photo"} className="w-36 h-28 object-cover rounded shadow" />
                          <button onClick={() => removePhoto(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">✖</button>
                        </div>
                      ))}

                      {photos.length < MAX_PHOTOS && (
                        <label className="w-36 h-28 flex items-center justify-center rounded border border-dashed cursor-pointer text-sm text-gray-500">
                          <input type="file" accept="image/*" multiple className="hidden" onChange={onAddPhotos} />
                          Add Photos
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Intro Video (Optional)</h4>
                    {video ? (
                      <div className="relative inline-block">
                        <video controls src={video.preview || makePreviewUrl(video.FilePath || video)} className="w-80 rounded shadow" />
                        <button onClick={removeVideo} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">✖</button>
                      </div>
                    ) : (
                      <label className="inline-block px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer text-sm">
                        Upload video
                        <input type="file" accept="video/*" className="hidden" onChange={onAddVideo} />
                      </label>
                    )}
                  </div>

                  <FormTextarea label="Full Description" value={form.Description} onChange={(v) => setField("Description", v)} />
                </div>
              )}

              {/* TAB 6: Selected Package */}
              {tab === 6 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Selected Package</h3>
                  {partner?.subscriptions && partner.subscriptions.length ? (
                    partner.subscriptions.map((s) => (
                      <div key={s.SubscriptionID} className="border p-4 rounded bg-white mb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{s.package?.PackageName || "Package"}</h4>
                            <p className="text-sm text-gray-600 mt-2">{s.package?.Description || "-"}</p>
                            <p className="text-sm mt-2"><strong>Price:</strong> {s.PackagePrice ?? s.TotalAmount ?? "-"}</p>
                            <p className="text-sm mt-1"><strong>Start:</strong> {s.StartDate ? new Date(s.StartDate).toLocaleDateString() : "N/A"}</p>
                            <p className="text-sm mt-1"><strong>End:</strong> {s.EndDate ? new Date(s.EndDate).toLocaleDateString() : "N/A"}</p>
                          </div>
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-medium">{String(s.Status || "").toUpperCase()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No package found.</div>
                  )}
                </div>
              )}

              {/* TAB 7: Review & Submit */}
              {tab === 7 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Review &amp; Submit</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Business</h4>
                      <div className="bg-white border rounded p-4 text-sm space-y-1">
                        <p><strong>Name:</strong> {form.BusinessName || "-"}</p>
                        <p><strong>Contact:</strong> {form.ContactName || "-"}</p>
                        <p><strong>Email:</strong> {form.Email || "-"}</p>
                        <p><strong>Phone:</strong> {form.Phone || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Uploads</h4>
                      <div className="bg-white border rounded p-4 text-sm space-y-1">
                        <p><strong>Documents:</strong> {docs.length}</p>
                        <p><strong>Photos:</strong> {photos.length}</p>
                        <p><strong>Video:</strong> {video ? video.FileName || "Video" : "None"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
       
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
          <div className="text-xs text-gray-500">{loading ? "Saving..." : "Make sure all required docs are attached."}</div>
          <div className="flex gap-3">
            <button onClick={() => setTab(t => Math.max(1, t - 1))} disabled={tab === 1 || loading} className="px-4 py-2 bg-gray-100 rounded text-sm disabled:opacity-50">Back</button>
            {tab < TABS.length ? (
              <button onClick={() => setTab(t => Math.min(TABS.length, t + 1))} disabled={loading} className="px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:opacity-60">Next</button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-60">{loading ? "Saving..." : "Submit"}</button>
            )}
          </div>
        </div>

        {toast && <div className={`fixed bottom-6 right-6 px-4 py-3 rounded shadow-lg text-sm ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>{toast.message}</div>}
      </div>
    </div>
  );
}

// small components (FormInput, FormTextarea) – copy from your existing file unchanged.
function FormInput({ label, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input className={`w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none ${disabled ? "bg-gray-50" : "bg-white"}`}
        value={value} onChange={(e) => onChange && onChange(e.target.value)} disabled={!!disabled} />
    </div>
  );
}
function FormTextarea({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea rows={6} className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-sm" value={value} onChange={(e) => onChange && onChange(e.target.value)} />
    </div>
  );
}
