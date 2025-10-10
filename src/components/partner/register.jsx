"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

/**
 * PartnerOnboarding (Tailwind)
 * - Unified input borders (error => red border)
 * - File upload dashed border with same color, turns red on error
 * - Category/subcategory preserved when navigating back
 * - Document requirements per subcategory
 * - Drag & drop + click uploads, previews, delete, validation
 */

export default function PartnerOnboarding({ apiUrl }) {
  const totalSteps = 6;
  const [step, setStep] = useState(1);

  // uploaded files / previews
  const [documents, setDocuments] = useState({}); // { DOC_KEY: File }
  const [documentPreviews, setDocumentPreviews] = useState({}); // { DOC_KEY: url | filename }
  const [media, setMedia] = useState({ photos: [], video: null });
  const [mediaPreviews, setMediaPreviews] = useState({ photos: [], video: null });

  const [serverError, setServerError] = useState(null);
  const [isSuccessPage, setIsSuccessPage] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  /* -----------------------
     Categories & documents
  ------------------------*/
  const categories = {
    "Accommodation & Hospitality": ["Hotel", "Lodge", "Serviced Apartment", "Airbnb & Homestay"],
    "Food & Beverage": ["Restaurant", "Café", "Nyama Choma Joint", "Bar/Club/Lounge"],
    "Transport & Travel": ["Taxi Operator", "Car Hire/Rental", "Shuttle Service", "Tour/Safari Operator"],
    "Attractions & Experiences": ["Park/Nature Reserve", "Cultural Centre/Art Gallery", "Entertainment Venue", "Event Organizer"],
    "Shopping & Services": ["Shop/Boutique", "Mall/Market", "Beauty/Wellness", "Professional Service"],
    "Events & Conferences": ["Event/Conference Centre"],
  };

  // Document requirements per subcategory (keys map to human labels below)
  const categoryDocsMap = {
    // Accommodation & Hospitality
    Hotel: ["BUSINESS_REGISTRATION", "COUNTY_PERMIT", "HEALTH_SAFETY", "MANAGER_ID"],
    Lodge: ["BUSINESS_REGISTRATION", "COUNTY_PERMIT", "HEALTH_SAFETY", "MANAGER_ID"],
    "Serviced Apartment": ["BUSINESS_REGISTRATION", "COUNTY_PERMIT", "MANAGER_ID"],
    "Airbnb & Homestay": ["BUSINESS_REGISTRATION", "COUNTY_PERMIT", "MANAGER_ID"],

    // Food & Beverage
    Restaurant: ["FOOD_HYGIENE", "COUNTY_PERMIT", "MENU_SAMPLE", "MANAGER_ID"],
    Café: ["FOOD_HYGIENE", "COUNTY_PERMIT", "MENU_SAMPLE", "MANAGER_ID"],
    "Nyama Choma Joint": ["FOOD_HYGIENE", "COUNTY_PERMIT", "MENU_SAMPLE", "MANAGER_ID"],
    "Bar/Club/Lounge": ["FOOD_HYGIENE", "COUNTY_PERMIT", "MENU_SAMPLE", "MANAGER_ID"],

    // Transport & Travel
    "Taxi Operator": ["TRA_LICENSE", "VEHICLE_INSURANCE", "DRIVER_LICENSE", "BUSINESS_REGISTRATION"],
    "Car Hire/Rental": ["TRA_LICENSE", "VEHICLE_INSURANCE", "DRIVER_LICENSE", "BUSINESS_REGISTRATION"],
    "Shuttle Service": ["TRA_LICENSE", "VEHICLE_INSURANCE", "BUSINESS_REGISTRATION"],
    "Tour/Safari Operator": ["TRA_LICENSE", "VEHICLE_INSURANCE", "BUSINESS_REGISTRATION"],

    // Shopping & Services
    "Shop/Boutique": ["BUSINESS_REGISTRATION", "TRADING_LICENSE", "PROOF_OF_LOCATION"],
    "Mall/Market": ["BUSINESS_REGISTRATION", "TRADING_LICENSE", "PROOF_OF_LOCATION"],
    "Beauty/Wellness": ["BUSINESS_REGISTRATION", "TRADING_LICENSE", "PROOF_OF_LOCATION"],
    "Professional Service": ["BUSINESS_REGISTRATION", "TRADING_LICENSE", "PROOF_OF_LOCATION"],

    // Events & Entertainment
    "Event/Conference Centre": ["EVENT_PERMIT", "SOUND_LICENSE", "BUSINESS_REGISTRATION", "VENUE_IMAGES"],
    "Entertainment Venue": ["EVENT_PERMIT", "SOUND_LICENSE", "BUSINESS_REGISTRATION", "VENUE_IMAGES"],

    // Attractions & Experiences
    "Park/Nature Reserve": ["BUSINESS_REGISTRATION", "PERMIT_IF_APPLICABLE", "PROOF_OF_LOCATION"],
    "Cultural Centre/Art Gallery": ["BUSINESS_REGISTRATION", "PERMIT_IF_APPLICABLE", "PROOF_OF_LOCATION"],
    "Event Organizer": ["BUSINESS_REGISTRATION", "EVENT_REFERENCES", "PROOF_OF_LOCATION"],
  };

  // user-facing labels for doc keys
  const docLabels = {
    BUSINESS_REGISTRATION: "Business Registration Certificate / Certificate of Incorporation",
    COUNTY_PERMIT: "County Business Permit (Nakuru County)",
    HEALTH_SAFETY: "Fire & Health Safety Certificate",
    MANAGER_ID: "Manager / Director ID / Passport",
    FOOD_HYGIENE: "Food Hygiene Certificate",
    MENU_SAMPLE: "Menu Sample",
    TRA_LICENSE: "Tourism License (TRA)",
    VEHICLE_INSURANCE: "Vehicle Insurance",
    DRIVER_LICENSE: "Driver's License",
    TRADING_LICENSE: "Trading / Business License",
    PROOF_OF_LOCATION: "Proof of Location (utility bill, lease, title deed)",
    EVENT_PERMIT: "Event Permit (if applicable)",
    SOUND_LICENSE: "Sound / DJ License (if applicable)",
    VENUE_IMAGES: "Venue Images",
    PERMIT_IF_APPLICABLE: "Relevant Permit (if applicable)",
    EVENT_REFERENCES: "Past Event References",
  };

  /* -------------------------
     File validation helpers
  ------------------------- */
  const isValidFile = (file, allowVideo = false) => {
    if (!file) return false;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (allowVideo) allowed.push("video/mp4");
    return allowed.includes(file.type);
  };

  /* ----------------------------------
     Clear documents automatically if
     category changed (preserve values when user navigates back)
     ---------------------------------- */
  const currentCategory = watch("category");
  const [prevCategory, setPrevCategory] = useState(currentCategory);
  useEffect(() => {
    if (prevCategory === undefined) {
      setPrevCategory(currentCategory);
      return;
    }
    if (prevCategory && currentCategory && prevCategory !== currentCategory) {
      setDocuments({});
      setDocumentPreviews({});
      Object.keys(docLabels).forEach((k) => {
        try {
          clearErrors(`documents.${k}`);
        } catch (e) {}
      });
    }
    setPrevCategory(currentCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory]);

  /* -------------------------
     Step 2: doc handlers
  ------------------------- */
  const handleFileChange = useCallback(
    (docKey, file) => {
      if (!file) return;
      if (!isValidFile(file)) {
        setError(`documents.${docKey}`, { type: "manual", message: "Only PDF/JPG/PNG allowed" });
        return;
      }
      clearErrors(`documents.${docKey}`);
      setDocuments((p) => ({ ...p, [docKey]: file }));
      setDocumentPreviews((p) => ({
        ...p,
        [docKey]: file.type === "application/pdf" ? file.name : URL.createObjectURL(file),
      }));
      setServerError(null);
    },
    [setError, clearErrors]
  );

  const handleRemoveDoc = (docKey) => {
    setDocuments((p) => {
      const next = { ...p };
      delete next[docKey];
      return next;
    });
    setDocumentPreviews((p) => {
      const next = { ...p };
      delete next[docKey];
      return next;
    });
    clearErrors(`documents.${docKey}`);
  };

  /* -------------------------
     Step 4: media handlers
  ------------------------- */
  const handlePhotoChange = (fileList) => {
    const arr = Array.from(fileList || []);
    const valid = arr.filter((f) => isValidFile(f));
    if (valid.length !== arr.length) {
      setServerError("Some files were ignored — only JPG/PNG allowed");
    } else {
      setServerError(null);
    }
    setMedia((p) => ({ ...p, photos: valid }));
    setMediaPreviews((p) => ({ ...p, photos: valid.map((f) => URL.createObjectURL(f)) }));
    clearErrors("media.photos");
  };

  const handleRemovePhoto = (index) => {
    setMedia((p) => ({ ...p, photos: p.photos.filter((_, i) => i !== index) }));
    setMediaPreviews((p) => ({ ...p, photos: p.photos.filter((_, i) => i !== index) }));
    clearErrors("media.photos");
  };

  const handleVideoChange = (file) => {
    if (!file) return;
    if (!isValidFile(file, true)) {
      setError("media.video", { type: "manual", message: "Only MP4 allowed" });
      return;
    }
    clearErrors("media.video");
    setMedia((p) => ({ ...p, video: file }));
    setMediaPreviews((p) => ({ ...p, video: URL.createObjectURL(file) }));
    setServerError(null);
  };

  const handleRemoveVideo = () => {
    setMedia((p) => ({ ...p, video: null }));
    setMediaPreviews((p) => ({ ...p, video: null }));
    clearErrors("media.video");
  };

  /* -------------------------
     Submit mutation
  ------------------------- */
  const mutation = useMutation({
    mutationFn: async (formValues) => {
      setServerError(null);
      const formData = new FormData();

      // append text fields
      Object.entries(formValues).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") formData.append(k, v);
      });

      // append documents (prefix with key)
      Object.entries(documents).forEach(([docKey, file]) => {
        if (file) formData.append("documents", file, `${docKey}_${file.name}`);
      });

      // append media
      media.photos.forEach((f) => formData.append("media", f));
      if (media.video) formData.append("media", media.video);

      const res = await fetch(apiUrl, { method: "POST", body: formData });
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `HTTP ${res.status}`);
      }
      return res.json();
    },
    onSuccess: () => setIsSuccessPage(true),
    onError: (err) => setServerError(err?.message || "Submission failed"),
  });

  /* -------------------------
     Navigation & validation
  ------------------------- */
  const nextStep = async () => {
    // Step 1: validate registration fields
    if (step === 1) {
      const ok = await trigger(["businessName", "contactPerson", "email", "phone", "category", "subcategory"]);
      if (!ok) return;
      setStep(2);
      return;
    }

    // Step 2: validate address/short description/operating hours + required documents
    if (step === 2) {
      const ok = await trigger(["physicalAddress", "mapLink", "shortDescription", "operatingHours"]);
      const selectedSubcat = watch("subcategory");
      const requiredDocs = categoryDocsMap[selectedSubcat] || [];

      let docsOk = true;
      for (const dk of requiredDocs) {
        if (!documents[dk]) {
          setError(`documents.${dk}`, { type: "required", message: `${docLabels[dk]} is required` });
          docsOk = false;
        } else {
          clearErrors(`documents.${dk}`);
        }
      }

      if (!ok || !docsOk) {
        setServerError("Please complete required fields and upload required documents.");
        return;
      }
      setServerError(null);
      setStep(3);
      return;
    }

    // Step 3 -> Step 4 (no validation)
    if (step === 3) {
      setStep(4);
      return;
    }

    // Step 4: validate fullDescription & photos count
    if (step === 4) {
      const ok = await trigger(["fullDescription"]);
      if (!ok) return;
      if (!media.photos || media.photos.length < 3 || media.photos.length > 5) {
        setError("media.photos", { type: "manual", message: "Upload between 3 and 5 photos" });
        setServerError("Please upload between 3 and 5 photos.");
        return;
      }
      clearErrors("media.photos");
      setServerError(null);
      setStep(5);
      return;
    }

    if (step === 5) {
      setStep(6);
      return;
    }
  };

  const prevStep = () => {
    setServerError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  /* -------------------------
     Success screen
  ------------------------- */
  if (isSuccessPage) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-green-600">🎉 Registration Successful!</h1>
          <p className="mt-4 text-gray-700">Your partner application has been submitted. We will review it shortly.</p>
        </div>
      </div>
    );
  }

  const progressWidth = `${(step / totalSteps) * 100}%`;

  /* -------------------------
     Tailwind input style used everywhere
     Add per-field error red border by checking errors[name]
  ------------------------- */
  const baseInputClass =
    "w-full border px-4 py-2 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const getInputClass = (fieldName) =>
    `${baseInputClass} ${errors[fieldName] ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header (kept exactly as requested) */}
        <div className="bg-primary text-white text-center py-6">
          <h1 className="h3 font-bold">Partner Onboarding</h1>
          <p className="text-white text-sm mt-1">Step {step} of {totalSteps}</p>
          <div className="w-3/4 h-2 bg-border rounded-full mx-auto mt-2">
            <div style={{ width: progressWidth }} className="h-full bg-white transition-all duration-300" />
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary">Step 1: Account Registration</h2>

                <div>
                  <label className="font-bold block mb-1">Business Name</label>
                  <input {...register("businessName", { required: "Business Name is required" })} className={getInputClass("businessName")} />
                  {errors.businessName && <p className="text-sm text-red-600 mt-1">{errors.businessName.message}</p>}
                </div>

                <div>
                  <label className="font-bold block mb-1">Contact Person</label>
                  <input {...register("contactPerson", { required: "Contact Person is required" })} className={getInputClass("contactPerson")} />
                  {errors.contactPerson && <p className="text-sm text-red-600 mt-1">{errors.contactPerson.message}</p>}
                </div>

                <div>
                  <label className="font-bold block mb-1">Email</label>
                  <input type="email" {...register("email", { required: "Email is required" })} className={getInputClass("email")} />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="font-bold block mb-1">Phone</label>
                  <input {...register("phone", { required: "Phone is required" })} className={getInputClass("phone")} />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select {...register("category", { required: "Category is required" })} className={getInputClass("category")}>
                    <option value="">Select Category</option>
                    {Object.keys(categories).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  {watch("category") && (
                    <>
                      <label className="font-bold block mb-1">Subcategory</label>
                      <select {...register("subcategory", { required: "Subcategory is required" })} className={getInputClass("subcategory")}>
                        <option value="">Select Subcategory</option>
                        {(categories[watch("category")] || []).map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.subcategory && <p className="text-sm text-red-600 mt-1">{errors.subcategory.message}</p>}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary">Step 2: Upload Required Documents</h2>

                {/* show documents for the selected subcategory (or show a helpful message) */}
                {(() => {
                  const selectedSubcat = watch("subcategory");
                  const requiredDocs = categoryDocsMap[selectedSubcat] || [];

                  if (!selectedSubcat) {
                    return <p className="text-gray-600">Please select a Category & Subcategory on Step 1 first.</p>;
                  }

                  if (requiredDocs.length === 0) {
                    return <p className="text-gray-600">No specific documents are defined for this subcategory.</p>;
                  }

                  return requiredDocs.map((dk) => (
                    <div key={dk} className="mb-4">
                      <label className="font-bold block mb-1">{docLabels[dk] || dk}</label>

                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          handleFileChange(dk, file);
                        }}
                        onClick={() => document.getElementById(`doc-${dk}`)?.click()}
                        className={`rounded-lg p-4 text-center cursor-pointer transition
                          border-2 border-dashed
                          ${errors.documents?.[dk] ? "border-red-500  ring-red-500" : "border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary hover:border-primary hover:ring-1 hover:ring-primary"}
                        `}
                      >
                        <p className={`text-gray-600 ${errors.documents?.[dk] ? "text-red-600" : ""}`}>Drag &amp; Drop or Click to Upload</p>
                        <p className="text-xs text-gray-500 mt-1">Allowed: PDF, JPG, PNG</p>
                        <input id={`doc-${dk}`} type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleFileChange(dk, e.target.files?.[0])} />
                      </div>

                      {errors.documents?.[dk] && <p className="text-sm text-red-600 mt-2">{errors.documents[dk].message}</p>}

                      {documentPreviews[dk] && (
                        <div className="mt-2 flex items-center gap-2">
                          {String(documentPreviews[dk]).toLowerCase().endsWith(".pdf") ? (
                            <p className="text-gray-700">📄 {documentPreviews[dk]}</p>
                          ) : (
                            <img src={documentPreviews[dk]} alt="preview" className={`h-20 w-20 object-cover rounded border ${errors.documents?.[dk] ? "border-red-500" : "border-gray-200"}`} />
                          )}
                          <button type="button" onClick={() => handleRemoveDoc(dk)} className="text-red-500 text-sm hover:underline">Remove</button>
                        </div>
                      )}
                    </div>
                  ));
                })()}

                <div>
                  <label className="font-bold block mb-1">Physical Address</label>
                  <input {...register("physicalAddress", { required: "Physical address is required" })} className={getInputClass("physicalAddress")} />
                  {errors.physicalAddress && <p className="text-sm text-red-600 mt-1">{errors.physicalAddress.message}</p>}
                </div>

                <div>
                  <label className="font-bold block mb-1">Google Map Link</label>
                  <input {...register("mapLink", { required: "Google Map link is required" })} className={getInputClass("mapLink")} />
                  {errors.mapLink && <p className="text-sm text-red-600 mt-1">{errors.mapLink.message}</p>}
                </div>

                <div>
                  <label className="font-bold block mb-1">Short Description</label>
                  <textarea {...register("shortDescription", { required: "Short description is required" })} rows={3} className={getInputClass("shortDescription")} />
                  {errors.shortDescription && <p className="text-sm text-red-600 mt-1">{errors.shortDescription.message}</p>}
                </div>

                <div>
                  <label className="font-bold block mb-1">Operating Hours</label>
                  <input {...register("operatingHours", { required: "Operating hours are required" })} className={getInputClass("operatingHours")} />
                  {errors.operatingHours && <p className="text-sm text-red-600 mt-1">{errors.operatingHours.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-secondary">Step 3: Review & Vetting</h2>
                <p className="text-gray-700">VisitNakuru.com verification team will review the uploaded documents and may request clarifications. If everything looks good, proceed to content submission.</p>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary">Step 4: Content Submission</h2>

                <div>
                  <label className="font-bold block mb-1">Full Description</label>
                  <textarea {...register("fullDescription", { required: "Full description is required" })} rows={6} className={getInputClass("fullDescription")} />
                  {errors.fullDescription && <p className="text-sm text-red-600 mt-1">{errors.fullDescription.message}</p>}
                </div>

                <div>
                  <label className="font-bold block mb-1">Upload 3–5 Photos</label>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handlePhotoChange(e.dataTransfer.files);
                    }}
                    onClick={() => document.getElementById("photos-input")?.click()}
                    className={`rounded-lg p-4 text-center cursor-pointer transition
                      border-2 border-dashed
                      ${errors.media?.photos ? "border-red-500 ring-red-500" : "border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary hover:border-primary hover:ring-1 hover:ring-primary"}
                    `}
                  >
                    <p className={`text-gray-600 ${errors.media?.photos ? "text-red-600" : ""}`}>Drag &amp; Drop photos here or Click to Upload</p>
                    <p className="text-xs text-gray-500 mt-1">Allowed: JPG, PNG (3–5 photos)</p>
                    <input id="photos-input" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(e.target.files)} />
                  </div>

                  {errors.media?.photos && <p className="text-sm text-red-600 mt-2">{errors.media.photos.message}</p>}

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {mediaPreviews.photos.map((src, i) => (
                      <div key={i} className="relative">
                        <img src={src} alt={`photo-${i}`} className="h-24 w-24 object-cover rounded border border-gray-200" />
                        <button type="button" onClick={() => handleRemovePhoto(i)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold block mt-3">Intro Video (Optional)</label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleVideoChange(e.dataTransfer.files?.[0]);
                    }}
                    onClick={() => document.getElementById("video-input")?.click()}
                    className={`rounded-lg p-4 text-center cursor-pointer transition
                      border-2 border-dashed
                      ${errors.media?.video ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary hover:border-primary hover:ring-1 hover:ring-primary"}
                    `}
                  >
                    <p className={`text-gray-600 ${errors.media?.video ? "text-red-600" : ""}`}>Drag &amp; Drop video here or Click to Upload</p>
                    <p className="text-xs text-gray-500 mt-1">Allowed: MP4</p>
                    <input id="video-input" type="file" accept="video/mp4" className="hidden" onChange={(e) => handleVideoChange(e.target.files?.[0])} />
                  </div>

                  {errors.media?.video && <p className="text-sm text-red-600 mt-2">{errors.media.video.message}</p>}

                  {mediaPreviews.video && (
                    <div className="relative mt-2">
                      <video src={mediaPreviews.video} controls className="rounded w-full max-h-64" />
                      <button type="button" onClick={handleRemoveVideo} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Remove</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-secondary">Step 5: Approval & Publishing</h2>
                <p className="text-gray-700">Approved listings go live under the selected category. Admin will manage publishing and notify you on approval.</p>
              </div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-secondary">Step 6: Periodic Reverification</h2>
                <p className="text-gray-700">Listings are periodically reverified (monthly/quarterly/annually). Automatic reminders are sent 30 days before expiry.</p>
              </div>
            )}

            {/* Navigation buttons (kept styles requested) */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="btn btn-secondary">
                  Back
                </button>
              )}

              {step < totalSteps ? (
                <button type="button" onClick={nextStep} className="btn btn-primary ml-auto">
                  Next
                </button>
              ) : (
                <button type="submit" className="btn btn-primary ml-auto">
                  Submit
                </button>
              )}
            </div>

            {serverError && <div className="bg-red-100 text-primary p-4 rounded mt-4">❌ {serverError}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
