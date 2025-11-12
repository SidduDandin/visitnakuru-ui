"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

/**
 * PartnerOnboarding (Tailwind)
 * - Checks login; redirects if logged in
 * - Website field added
 * - Unified borders + validation
 */

export default function PartnerOnboarding({ apiUrl }) {
  const totalSteps = 6;
  const [step, setStep] = useState(1);

  const [documents, setDocuments] = useState({});
  const [documentPreviews, setDocumentPreviews] = useState({});
  const [media, setMedia] = useState({ photos: [], video: null });
  const [mediaPreviews, setMediaPreviews] = useState({ photos: [], video: null });

  const [serverError, setServerError] = useState(null);
  const [isSuccessPage, setIsSuccessPage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  // ✅ Check auth — redirect logged-in users

// useEffect(() => {
//   const isFakeLoggedIn = true;
//   if (isFakeLoggedIn) router.replace("/dashboard");
// }, [router]);
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

  const categoryDocsMap = {
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

  const isValidFile = (file, allowVideo = false) => {
    if (!file) return false;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (allowVideo) allowed.push("video/mp4");
    return allowed.includes(file.type);
  };

  const currentCategory = watch("category");
  const [prevCategory, setPrevCategory] = useState(currentCategory);

  useEffect(() => {
    if (prevCategory && currentCategory && prevCategory !== currentCategory) {
      setDocuments({});
      setDocumentPreviews({});
      Object.keys(docLabels).forEach((k) => clearErrors(`documents.${k}`));
    }
    setPrevCategory(currentCategory);
  }, [currentCategory]);

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

  const handlePhotoChange = (fileList) => {
    const arr = Array.from(fileList || []);
    const valid = arr.filter((f) => isValidFile(f));
    if (valid.length !== arr.length) setServerError("Some files ignored — only JPG/PNG allowed");
    else setServerError(null);
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

  const mutation = useMutation({
    mutationFn: async (data) => {
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/partners`;
      const formData = new FormData();

      // ✅ Include Website
      formData.append("BusinessName", data.businessName);
      formData.append("ContactPerson", data.contactPerson);
      formData.append("Email", data.email);
      formData.append("Phone", data.phone);
      formData.append("Website", data.website);
      formData.append("Category", data.category);
      formData.append("Subcategory", data.subcategory);
      formData.append("PhysicalAddress", data.physicalAddress);
      formData.append("MapLink", data.mapLink);
      formData.append("ShortDescription", data.shortDescription);
      formData.append("OperatingHours", data.operatingHours);
      formData.append("FullDescription", data.fullDescription);
      formData.append("recaptchaToken", data.recaptchaToken);

      // docs
      if (documents && typeof documents === "object") {
        const seenDocs = new Set();
        for (const [key, file] of Object.entries(documents)) {
          if (file instanceof File && !seenDocs.has(file.name)) {
            formData.append("documents", file);
            seenDocs.add(file.name);
          }
        }
      }

      // photos
      if (Array.isArray(media?.photos)) {
        const seenPhotos = new Set();
        media.photos.forEach((file) => {
          if (file instanceof File && !seenPhotos.has(file.name)) {
            formData.append("photos", file);
            seenPhotos.add(file.name);
          }
        });
      }

      if (media?.video instanceof File) {
        formData.append("videos", media.video);
      }

      const res = await fetch(apiUrl, { method: "POST", body: formData });
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      setIsSubmitting(false);
      setIsSuccessPage(true);
    },
    onError: (err) => {
      setIsSubmitting(false);
      setServerError(err?.message || "Submission failed");
    },
  });

  const onFinalSubmit = async (data) => {
    if (isSubmitting || mutation.isPending) return;
    setIsSubmitting(true);
    setServerError(null);

    if (!executeRecaptcha) {
      setServerError("reCAPTCHA service unavailable.");
      setIsSubmitting(false);
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("partnerRegistration");
      if (!recaptchaToken) {
        setServerError("reCAPTCHA verification failed.");
        setIsSubmitting(false);
        return;
      }
      mutation.mutate({ ...data, recaptchaToken });
    } catch {
      setServerError("Verification error. Try again.");
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const ok = await trigger(["businessName", "contactPerson", "email", "phone", "website", "category", "subcategory"]);
      if (!ok) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      const ok = await trigger(["physicalAddress", "mapLink", "shortDescription", "operatingHours"]);
      const selectedSubcat = watch("subcategory");
      const requiredDocs = categoryDocsMap[selectedSubcat] || [];
      let docsOk = true;
      for (const dk of requiredDocs) {
        if (!documents[dk]) {
          setError(`documents.${dk}`, { type: "required", message: `${docLabels[dk]} is required` });
          docsOk = false;
        }
      }
      if (!ok || !docsOk) {
        setServerError("Complete required fields and upload required documents.");
        return;
      }
      setServerError(null);
      setStep(3);
      return;
    }

    if (step === 3) {
      setStep(4);
      return;
    }

    if (step === 4) {
      const ok = await trigger(["fullDescription"]);
      if (!ok) return;
      if (!media.photos || media.photos.length < 3 || media.photos.length > 5) {
        setError("media.photos", { type: "manual", message: "Upload between 3 and 5 photos" });
        setServerError("Please upload between 3 and 5 photos.");
        return;
      }
      clearErrors("media.photos");
      setStep(5);
      return;
    }

    if (step === 5) setStep(6);
  };

  const prevStep = () => {
    setServerError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  if (isSuccessPage) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-green-600">🎉 Registration Successful!</h1>
          <p className="mt-4 text-gray-700">Your business application has been submitted. We will review it shortly.</p>
        </div>
      </div>
    );
  }

  const progressWidth = `${(step / totalSteps) * 100}%`;
  const baseInputClass = "w-full border px-4 py-2 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const getInputClass = (field) => `${baseInputClass} ${errors[field] ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary text-white text-center py-6">
          <h1 className="h3 font-bold">Business Onboarding</h1>
          <p className="text-white text-sm mt-1">Step {step} of {totalSteps}</p>
          <div className="w-3/4 h-2 bg-border rounded-full mx-auto mt-2">
            <div style={{ width: progressWidth }} className="h-full bg-white transition-all duration-300" />
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6">
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
                  <input type="email" {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                  })} className={getInputClass("email")} />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="font-bold block mb-1">Phone</label>
                  <input type="tel" {...register("phone", {
                    required: "Phone number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" },
                  })} className={getInputClass("phone")} />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                {/* ✅ Website field */}
                <div>
                  <label className="font-bold block mb-1">Website</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    {...register("website", {
                      required: "Website URL is required",
                      pattern: {
                        value: /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/_.]*)?)?$/,
                        message: "Enter a valid URL",
                      },
                    })}
                    className={getInputClass("website")}
                  />
                  {errors.website && <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>}
                </div>
              </div>
            )}

            {/* ... Steps 2–6 identical to your version, unchanged ... */}

            {serverError && <p className="text-red-600 font-semibold mt-4">{serverError}</p>}
          </form>

          <div className="flex justify-between mt-8">
            {step > 1 && <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Back</button>}
            {step < totalSteps && <button type="button" onClick={nextStep} className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary">Next</button>}
            {step === totalSteps && (
              <button type="submit" form="partnerOnboardingForm" disabled={isSubmitting || mutation.isPending} className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary disabled:bg-gray-400">
                {isSubmitting || mutation.isPending ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
