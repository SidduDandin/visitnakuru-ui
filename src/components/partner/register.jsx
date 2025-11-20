"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Link from "next/link";


/**
 * PartnerOnboarding (Tailwind) - UPDATED
 * - Total steps increased to 6
 * - Added Step 5 (Package Selection) and Step 6 (Review & Submit)
 */

// --- Agreement Text Content ---
// Effective Date and Last Updated placeholders
const AGREEMENT_TEXT = `This document sets out the rules, regulations, and code of conduct for all companies, service providers, and partners listed on VisitNakuru.com, the official visitor guide for Nakuru County. By being listed, each Partner agrees to comply with these standards.

1. General Conduct
All listed companies must:
• Operate in compliance with Kenyan laws, county government regulations, and industry licensing requirements.
• Provide truthful, accurate, and up-to-date information in their listing (name, address, contacts, services, pricing, photos).
• Maintain high standards of professionalism, safety, and customer service.
• Treat all customers, staff, and other businesses with respect, courtesy, and integrity.

2. Unacceptable Behaviours (Grounds for Immediate Removal)
A company’s listing may be suspended or terminated without prior notice if found engaging in any of the following:
• Misrepresentation or Dishonesty
  o Providing false business information, fake photos, or misleading pricing.
  o Failing to honour bookings or advertised offers.
• Unprofessional or Offensive Conduct
  o Use of abusive, discriminatory, or offensive language towards customers, staff, or platform representatives.
  o Harassment or inappropriate behaviour online or in-person.
• Poor Service Quality
  o Repeated negative customer reviews or complaints showing consistent failure to meet service standards.
  o Unsafe or unhygienic practices that endanger customers.
• Fraudulent or Illegal Activities
  o Operating without the required business licenses or approvals.
  o Engaging in corruption, bribery, theft, scams, or any criminal activity.
• Misuse of VisitNakuru.com Platform
  o Uploading irrelevant, spam, or offensive content.
  o Using the platform to promote unrelated or illegal services.
  o Attempting to manipulate reviews, ratings, or booking data.
• Breach of Agreement
  o Non-payment of agreed listing fees, commissions, or sponsorship obligations.
  o Failure to comply with VisitNakuru.com’s Terms & Conditions or directives.

3. Code of Conduct
To remain on VisitNakuru.com, all partners must:
• Maintain professional business standards at all times.
• Respond to customer inquiries and complaints promptly and respectfully.
• Ensure services offered (e.g., rooms, tours, meals, transport) match descriptions and advertised quality.
• Cooperate with VisitNakuru.com in providing documentation (business registration, licensing, insurance, etc.) for verification.
• Respect Nakuru County’s image by upholding ethical tourism practices, sustainability, and cultural sensitivity.

4. Disciplinary Actions
• Warning Notice: For minor or first-time breaches.
• Suspension: Temporary removal until issues are resolved.
• Termination: Permanent removal from VisitNakuru.com for serious or repeated violations.
• Blacklisting: Offending businesses may be barred from future listings or partnerships.

5. Appeals Process
• Partners may appeal suspensions or terminations by submitting a written explanation and supporting documents within 14 days of notice.
• Appeals will be reviewed by VisitNakuru.com management, whose decision is final.

6. Governing Law
This Agreement is governed by the laws of Kenya, and disputes shall be handled under the jurisdiction of Kenyan courts.
`;
// --- END Agreement Text Content ---

// --- Sample Packages Data for Step 5 ---
const packages = [
    {
        PackageID: "1",
        PackageName: "Basic Plan",
        PackagePrice: 19.99,
        Duration: "30 Days",
        Features: ["Name & Contact", "Basic Description", "2 Photos"],
    },
    {
        PackageID: "2",
        PackageName: "Standard Plan",
        PackagePrice: 39.99,
        Duration: "60 Days",
        Features: ["Full Profile", "5 Photos", "Map Link", "Basic Analytics"],
    },
    {
        PackageID: "3",
        PackageName: "Premium Plan",
        PackagePrice: 59.99,
        Duration: "90 Days",
        Features: ["Top Placement", "Video Upload", "Priority Support", "Featured Toggle"],
    },
];
// --- END Sample Packages Data ---


export default function PartnerOnboarding({ apiUrl,userAuthToken,user }) {
  
    const initialEmail = user?.EmailAddress || "";
  // 6 Steps: 1. Registration, 2. Documents & Location, 3. Agreement, 4. Content & Media, 5. Packages, 6. Review
    const totalSteps = 6; 
    const [step, setStep] = useState(1);
    
    // Hardcoded email for the logged-in user simulation
    //const LOGGED_IN_USER_EMAIL = formData.email; 

    // uploaded files / previews
    const [documents, setDocuments] = useState({}); // { DOC_KEY: File }
    const [documentPreviews, setDocumentPreviews] = useState({}); // { DOC_KEY: url | filename }
    const [media, setMedia] = useState({ photos: [], video: null });
    const [mediaPreviews, setMediaPreviews] = useState({ photos: [], video: null });
    
    // Category states (dynamic)
const [topCategories, setTopCategories] = useState([]); // { CatId, CatName }
const [subCategories, setSubCategories] = useState([]); // { CatId, CatName }

    const [serverError, setServerError] = useState(null);
    const [isSuccessPage, setIsSuccessPage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    const { executeRecaptcha } = useGoogleReCaptcha();
    
    const { register, handleSubmit, trigger, watch, setError, clearErrors, setValue, formState: { errors }, } = useForm({ 
        mode: "onBlur",
        defaultValues: {
            // Set the logged-in email as default and register it
            email: initialEmail,
            // Default package selection to force user choice
            packageID: "", 
            isFeatured: false,
        }
    });
    useEffect(() => {
setValue("email", initialEmail);
}, [initialEmail, setValue]);

    // Watch the selected package ID to conditionally enable the 'isFeatured' toggle
    const selectedPackageID = watch("packageID");
    const selectedPackage = packages.find(pkg => pkg.PackageID === selectedPackageID);
    //const canBeFeatured = selectedPackage?.PackageName.includes("Premium") || false; // Only Premium can be featured
  
    
    /* ----------------------- Categories & documents ------------------------*/
    // Fetch top-level categories on mount
useEffect(() => {
let active = true;
const fetchTop = async () => {
try {
const res = await fetch("http://localhost:5000/api/categories/admin/category");
if (!res.ok) throw new Error("Failed to fetch categories");
const json = await res.json();
if (!active) return;
setTopCategories(Array.isArray(json) ? json : []);
} catch (e) {
console.error("Error fetching top categories", e);
setTopCategories([]);
}
};
fetchTop();
return () => { active = false; };
}, []);

// When category (parent) changes, fetch its subcategories
useEffect(() => {
const parentId = watch("category");
if (!parentId) {
setSubCategories([]);
return;
}
let active = true;
const fetchSub = async () => {
try {
const res = await fetch("http://localhost:5000/api/categories/admin/subcategory?parentId=${parentId}");
if (!res.ok) throw new Error("Failed to fetch subcategories");
const json = await res.json();
if (!active) return;
setSubCategories(Array.isArray(json) ? json : []);
} catch (e) {
console.error("Error fetching subcategories", e);
setSubCategories([]);
}
};
fetchSub();
return () => { active = false; };
}, [watch("category")]);

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



    /* ------------------------- File validation helpers ------------------------- */
    const isValidFile = (file, allowVideo = false) => {
        if (!file) return false;
        const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
        if (allowVideo) allowed.push("video/mp4");
        return allowed.includes(file.type);
    };

    /* ---------------------------------- Clear documents automatically if category changed (preserve values when user navigates back) ---------------------------------- */
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
                } catch (e) { }
            });
        }
        setPrevCategory(currentCategory);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCategory]);

    /* ------------------------- Step 2: doc handlers ------------------------- */
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

    /* ------------------------- Step 4: media handlers ------------------------- */
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

    /* ------------------------- Submit mutation ------------------------- */
    const mutation = useMutation({
        mutationFn: async (data) => {
            const partnerApiUrl = `${apiUrl}`; // Use apiUrl prop if passed, otherwise default is used implicitly in the original code's structure
            const formData = new FormData();

            // 🟢 Map frontend -> backend field names
           formData.append("BusinessName", data.businessName || "");
  formData.append("ContactPerson", data.contactPerson || "");
  // include email (hidden / read-only in UI)
  formData.append("Email", data.email || LOGGED_IN_USER_EMAIL || "");
  formData.append("Phone", data.phone || "");
  // send IDs: category and subcategory are numeric IDs in selects
  formData.append("CategoryID", data.category || "");
  formData.append("SubcategoryID", data.subcategory || "");
  formData.append("PhysicalAddress", data.physicalAddress || "");
  formData.append("MapLink", data.mapLink || "");
  formData.append("ShortDescription", data.shortDescription || "");
  formData.append("OperatingHours", data.operatingHours || "");
  formData.append("FullDescription", data.fullDescription || "");
  formData.append("recaptchaToken", data.recaptchaToken || "");

  // social
  formData.append("Website", data.Website || "");
  formData.append("WhatsAppNumber", data.WhatsAppNumber || "");
  formData.append("FacebookLink", data.FacebookLink || "");
  formData.append("XLink", data.XLink || "");
  formData.append("InstagramLink", data.InstagramLink || "");

  // agreement fields
  formData.append("agreementAcknowledged", data.agreementAcknowledged ? "true" : "false");
  formData.append("acknowledgementDate", data.acknowledgementDate || "");
  formData.append("acknowledgementSignature", data.acknowledgementSignature || "");
  formData.append("acknowledgementStaffName", data.acknowledgementStaffName || "");
  formData.append("acknowledgementPosition", data.acknowledgementPosition || "");
  formData.append("companyNameAcknowledgement", data.companyNameAcknowledgement || "");
  formData.append("kenyanIdNo", data.kenyanIdNo || "");

  // subscription
  formData.append("PackageID", data.packageID || "");
  formData.append("IsFeatured", data.isFeatured ? "true" : "false");
            
            // 🟢 Append documents (object form)
            if (documents && typeof documents === "object") {
                const seenDocs = new Set();
                for (const [key, file] of Object.entries(documents)) {
                    if (file instanceof File && !seenDocs.has(file.name)) {
                        formData.append("documents", file, file.name);
                        formData.append("documentLabels", key);
                        seenDocs.add(file.name);
                    }
                }
            }
            
            // 🟢 Append photos (avoid duplicates)
            if (Array.isArray(media?.photos)) {
                const seenPhotos = new Set();
                media.photos.forEach((file) => {
                    if (file instanceof File && !seenPhotos.has(file.name)) {
                        formData.append("photos", file);
                        seenPhotos.add(file.name);
                    }
                });
            }
            
            // 🟢 Append single video
            if (media?.video instanceof File) {
                formData.append("videos", media.video);
            }

            const res = await fetch(partnerApiUrl, {
                method: "POST",
                headers: {
                    // Send the token received from the parent component
                    // This is required by your backend's auth middleware (authUser)
                    'x-auth-token': userAuthToken,
                },
                body: formData,
            });

            if (!res.ok) {
                const txt = await res.text().catch(() => null);
                throw new Error(txt || `HTTP ${res.status}`);
            }

            return res.json();
        },
        onSuccess: () => {
            setIsSubmitting(false); // Clear local submitting state
            setIsSuccessPage(true);
        },
        onError: (err) => {
            setIsSubmitting(false); // Clear local submitting state
            setServerError(err?.message || "Submission failed");
        },
    });

    const onFinalSubmit = async (data) => {
        // This function is only called on the final step's submit button press.
        if (isSubmitting || mutation.isPending) return;
        setIsSubmitting(true);
        setServerError(null);

        if (!executeRecaptcha) {
            setServerError("reCAPTCHA service not available. Please try again.");
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Execute reCAPTCHA with a specific action name
            const recaptchaToken = await executeRecaptcha("partnerRegistration");

            if (!recaptchaToken) {
                setServerError("reCAPTCHA verification failed. Cannot submit form.");
                setIsSubmitting(false);
                return;
            }

            // 2. Call mutation with the combined data object
            mutation.mutate({ ...data, recaptchaToken });

        } catch (error) {
            console.error("reCAPTCHA/Submission error:", error);
            setServerError("An internal error occurred during verification. Try again.");
            setIsSubmitting(false);
        }
    };

    /* ------------------------- Navigation & validation ------------------------- */
    const nextStep = async () => {
        setServerError(null);

        // Step 1: validate registration fields
        if (step === 1) {
            const ok = await trigger(["category", "subcategory", "businessName", "contactPerson", "email", "phone"]);
            if (!ok) return;
            setStep(2);
            return;
        }

        // Step 2: validate address/short description/operating hours + required documents
        if (step === 2) {
            const ok = await trigger(["physicalAddress", "mapLink", "shortDescription", "operatingHours"]);

            const selectedSubcatId  = watch("subcategory");
           const selectedSubcatObj = subCategories.find(s => String(s.CatId) === String(selectedSubcatId));
  const selectedSubcatName = selectedSubcatObj?.CatName;
  const requiredDocs = categoryDocsMap[selectedSubcatName] || [];
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
        
        // Step 3: Validate Agreement form fields
        if (step === 3) {
            const ok = await trigger([
                "agreementAcknowledged",
                "kenyanIdNo",
                "companyNameAcknowledgement",
                "acknowledgementSignature",
                "acknowledgementStaffName",
                "acknowledgementPosition",
                "acknowledgementDate"
            ]);
            
            if (!ok) {
                setServerError("Please acknowledge the agreement and complete all signature fields.");
                return;
            }
            
            setServerError(null);
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
            setStep(5); // Move to Step 5 (Packages)
            return;
        }
        
        // Step 5: Validate package selection
        if (step === 5) {
            const ok = await trigger(["packageID"]);
            if (!ok) {
                setServerError("Please select a package to proceed.");
                return;
            }
            setServerError(null);
            setStep(6); // Move to Step 6 (Review)
            return;
        }

        // Step 6: Review - no validation needed here, just leads to submit
        if (step === 6) {
            // The submit button handles the final submission logic
            return;
        }
    };

    const prevStep = () => {
        setServerError(null);
        setStep((s) => Math.max(1, s - 1));
    };

    /* ------------------------- Success screen ------------------------- */
    if (isSuccessPage) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="p-8 bg-white rounded-lg shadow-lg text-center">
                    <h1 className="text-2xl font-bold text-green-600">🎉 Registration Successful!</h1>
                    <p className="mt-4 text-gray-700">Your business onboarding has been completed. We will review it shortly.</p>
                     <a href="/business/register"className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition ml-auto"> List My Business</a>
                </div>
            </div>
        );
    }

    const progressWidth = `${(step / totalSteps) * 100}%`;

    /* ------------------------- Tailwind input style used everywhere Add per-field error red border by checking errors[name] ------------------------- */
    const baseInputClass = "w-full border px-4 py-2 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
    const getInputClass = (fieldName) => `${baseInputClass} ${errors[fieldName] || (errors.documents && errors.documents[fieldName]) ? "border-red-500" : "border-gray-300"}`;
    
    // Helper for agreement form fields (which might use different names)
    const getAgreementInputClass = (fieldName) => `${baseInputClass} ${errors[fieldName] ? "border-red-500" : "border-gray-300"}`;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white text-center py-6">
                    <h1 className="h3 font-bold">Business Onboarding</h1>
                    <p className="text-white text-sm mt-1">Step {step} of {totalSteps}</p>
                    <div className="w-3/4 h-2 bg-border rounded-full mx-auto mt-2">
                        <div style={{ width: progressWidth }} className="h-full bg-white transition-all duration-300" />
                    </div>
                </div>
                
                <div className="p-8">
                    <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6">
                        {/* STEP 1: Registration */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-secondary">Step 1: Account Registration</h2>
                                
                                {/* Category */}
                                <div>
                                    <label className="font-bold block mb-1">Category</label>
                                    <select {...register("category", { required: "Category is required" })} className={getInputClass("category")}>
                <option value="">Select Category</option>
                {topCategories.map(c => (
                  <option key={c.CatId} value={c.CatId}>{c.CatName}</option>
                ))}
              </select>
              {errors.category && (<p className="text-sm text-red-600 mt-1">{errors.category.message}</p>)}
                                </div>
                                
                                {/* Subcategory (Conditional) */}
                                <div>
                                    {watch("category") && (
                                        <>
                                            <label className="font-bold block mb-1">Sub Category</label>
                                            <select {...register("subcategory", { required: "Sub Category is required" })} className={getInputClass("subcategory")}>
                    <option value="">Select Subcategory</option>
                    {subCategories.map(s => (
                      <option key={s.CatId} value={s.CatId}>{s.CatName}</option>
                    ))}
                  </select>
                  {errors.subcategory && (<p className="text-sm text-red-600 mt-1">{errors.subcategory.message}</p>)}
                                        </>
                                    )}
                                </div>
                                
                               
                                
                                {/* Business Name */}
                                <div>
                                    <label className="font-bold block mb-1">Business Name</label>
                                    <input {...register("businessName", { required: "Business Name is required" })} className={getInputClass("businessName")} />
                                    {errors.businessName && ( <p className="text-sm text-red-600 mt-1">{errors.businessName.message}</p> )}
                                </div>
                                
                                {/* Contact Person */}
                                <div>
                                    <label className="font-bold block mb-1">Contact Person</label>
                                    <input {...register("contactPerson", { required: "Contact Person is required" })} className={getInputClass("contactPerson")} />
                                    {errors.contactPerson && ( <p className="text-sm text-red-600 mt-1">{errors.contactPerson.message}</p> )}
                                </div>
                                
                                {/* Email (Read-only as per request) */}
                                <div>
                                    <label className="font-bold block mb-1">Email</label>
                                    <input type="email" readOnly className={`${getInputClass("email")} bg-gray-100 cursor-not-allowed`} value={initialEmail} />
                                </div>
                                
                                {/* Phone */}
                                <div>
                                    <label className="font-bold block mb-1">Phone</label>
                                    <input type="tel" {...register("phone", { 
                                        required: "Phone number is required", 
                                        pattern: { value: /^[0-9]{10}$/, message: "Phone number must be 10 digits", },
                                    })} className={getInputClass("phone")} />
                                    {errors.phone && ( <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p> )}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Documents & Location */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-secondary">Step 2: Documents & Location</h2>
                                
                                {/* Document Uploads */}
                                {(() => {
              const selectedSubcatId = watch("subcategory");
              const selectedSubcatObj = subCategories.find(s => String(s.CatId) === String(selectedSubcatId));
              const selectedSubcatName = selectedSubcatObj?.CatName;
              const requiredDocs = categoryDocsMap[selectedSubcatName] || [];

              if (!selectedSubcatId) {
                return <p className="text-gray-600">Please select a Category & Subcategory on Step 1 first.</p>;
              }
              if (requiredDocs.length === 0) {
                return <p className="text-gray-600">No specific documents are defined for this subcategory.</p>;
              }

              return (
                <>
                  <p className="font-bold text-md mb-2">Required Documents</p>
                  {requiredDocs.map((dk) => (
                    <div key={dk} className="mb-4">
                      <label className="font-bold block mb-1">{docLabels[dk] || dk}</label>
                      <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; handleFileChange(dk, file); }}
                        onClick={() => document.getElementById(`doc-${dk}`)?.click()}
                        className={`rounded-lg p-4 text-center cursor-pointer transition border-2 border-dashed ${errors.documents?.[dk] ? "border-red-500 ring-red-500" : "border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary hover:border-primary hover:ring-1 hover:ring-primary"} `}
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
                  ))}
                </>
              );
            })()}
                               
                                
                                <p className="font-bold text-md mb-2">Location & Contact Details</p>

                                {/* Physical Address */}
                                <div>
                                    <label className="font-bold block mb-1">Physical Address</label>
                                    <input {...register("physicalAddress", { required: "Physical address is required" })} className={getInputClass("physicalAddress")} />
                                    {errors.physicalAddress && <p className="text-sm text-red-600 mt-1">{errors.physicalAddress.message}</p>}
                                </div>
                                
                                {/* Google Map Link */}
                                <div>
                                    <label className="font-bold block mb-1">Google Map Link</label>
                                    <input {...register("mapLink", { required: "Google Map link is required" })} className={getInputClass("mapLink")} />
                                    {errors.mapLink && <p className="text-sm text-red-600 mt-1">{errors.mapLink.message}</p>}
                                </div>
                                
                                {/* Short Description */}
                                <div>
                                    <label className="font-bold block mb-1">Short Description</label>
                                    <textarea {...register("shortDescription", { required: "Short description is required" })} rows={3} className={getInputClass("shortDescription")} />
                                    {errors.shortDescription && <p className="text-sm text-red-600 mt-1">{errors.shortDescription.message}</p>}
                                </div>
                                
                                {/* Operating Hours */}
                                <div>
                                    <label className="font-bold block mb-1">Operating Hours</label>
                                    <input {...register("operatingHours", { required: "Operating hours are required" })} className={getInputClass("operatingHours")} />
                                    {errors.operatingHours && <p className="text-sm text-red-600 mt-1">{errors.operatingHours.message}</p>}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Agreement Form */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-secondary">Step 3: Rules, Regulations & Code of Conduct for Partners </h2>
                                
                                {/* Agreement Text - Styled as requested */}
                                <div className="border border-gray-300 rounded p-4 h-96 overflow-y-scroll bg-gray-50 text-sm">
                                    <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                                        {AGREEMENT_TEXT}
                                    </pre>
                                </div>
                                
                              
                                
                                <p className="font-bold text-md mb-2">Social & Web Links (Optional)</p>
                                
                                {/* Website */}
                                <div>
                                    <label className="font-bold block mb-1">Website</label>
                                    <input {...register("Website")} className={getInputClass("Website")} placeholder="e.g., https://www.yourbusiness.com" />
                                </div>

                                {/* WhatsAppNumber */}
                                <div>
                                    <label className="font-bold block mb-1">WhatsApp Number</label>
                                    <input type="tel" {...register("WhatsAppNumber")} className={getInputClass("WhatsAppNumber")} placeholder="e.g., +254700123456" />
                                </div>

                                {/* FacebookLink */}
                                <div>
                                    <label className="font-bold block mb-1">Facebook Link</label>
                                    <input {...register("FacebookLink")} className={getInputClass("FacebookLink")} placeholder="e.g., https://facebook.com/yourpage" />
                                </div>
                                
                                {/* XLink (Twitter) */}
                                <div>
                                    <label className="font-bold block mb-1">X (Twitter) Link</label>
                                    <input {...register("XLink")} className={getInputClass("XLink")} placeholder="e.g., https://x.com/yourhandle" />
                                </div>
                                
                                {/* InstagramLink */}
                                <div>
                                    <label className="font-bold block mb-1">Instagram Link</label>
                                    <input {...register("InstagramLink")} className={getInputClass("InstagramLink")} placeholder="e.g., https://instagram.com/yourhandle" />
                                </div>
                                
                              

                                {/* Agreement Acknowledgement */}
                                <p className="font-bold text-md mb-2">Agreement Acknowledgement</p>
                                <div className="space-y-3 p-4 border border-gray-300 rounded bg-white">
                                    {/* Company Name (from agreement structure) */}
                                    <div>
                                        <label className="font-bold block mb-1">I, of Kenyan ID No:</label>
                                        <input {...register("kenyanIdNo", { required: "Kenyan ID No is required" })} className={getAgreementInputClass("kenyanIdNo")} />
                                        {errors.kenyanIdNo && <p className="text-sm text-red-600 mt-1">{errors.kenyanIdNo.message}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="font-bold block mb-1">representing (Company Name):</label>
                                        <input {...register("companyNameAcknowledgement", { required: "Company Name is required for acknowledgement" })} className={getAgreementInputClass("companyNameAcknowledgement")} />
                                        {errors.companyNameAcknowledgement && <p className="text-sm text-red-600 mt-1">{errors.companyNameAcknowledgement.message}</p>}
                                    </div>
                                    
                                    <p className="text-gray-700">
                                        acknowledge that I have read, understood, and agree that our staff and employees agree to abide by the terms of this VisitNakuru.com – Rules, Regulations & Code of Conduct for Listed Partners.
                                    </p>

                                    {/* Signature Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-bold block mb-1">Signed </label>
                                            <input {...register("acknowledgementSignature", { required: "Signature/Name is required" })} className={getAgreementInputClass("acknowledgementSignature")} placeholder="Type your full name" />
                                            {errors.acknowledgementSignature && <p className="text-sm text-red-600 mt-1">{errors.acknowledgementSignature.message}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold block mb-1">Staff Name</label>
                                            <input {...register("acknowledgementStaffName", { required: "Staff Name is required" })} className={getAgreementInputClass("acknowledgementStaffName")} />
                                            {errors.acknowledgementStaffName && <p className="text-sm text-red-600 mt-1">{errors.acknowledgementStaffName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold block mb-1">Position</label>
                                            <input {...register("acknowledgementPosition", { required: "Position is required" })} className={getAgreementInputClass("acknowledgementPosition")} />
                                            {errors.acknowledgementPosition && <p className="text-sm text-red-600 mt-1">{errors.acknowledgementPosition.message}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold block mb-1">Date</label>
                                            <input type="date" {...register("acknowledgementDate", { required: "Date is required" })} className={getAgreementInputClass("acknowledgementDate")} />
                                            {errors.acknowledgementDate && <p className="text-sm text-red-600 mt-1">{errors.acknowledgementDate.message}</p>}
                                        </div>
                                    </div>
                                    
                                    {/* Final Acknowledgment Checkbox */}
                                    <div className="flex items-start mt-4">
                                        <input type="checkbox" id="agreement-check" {...register("agreementAcknowledged", { required: "You must acknowledge the agreement" })} className={`mt-1 w-4 h-4 text-primary rounded ${errors.agreementAcknowledged ? 'border-red-500' : 'border-gray-300'}`} />
                                        <label htmlFor="agreement-check" className="ml-2 text-sm text-gray-900 font-bold">I confirm I have reviewed and accepted the terms of this agreement.</label>
                                    </div>
                                    {errors.agreementAcknowledged && <p className="text-sm text-red-600 mt-1">{errors.agreementAcknowledged.message}</p>}
                                </div>
                            </div>
                        )}
                        
                        {/* STEP 4: Content Submission */}
                        {step === 4 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-secondary">Step 4: Content Submission</h2>
                                
                                {/* Full Description */}
                                <div>
                                    <label className="font-bold block mb-1">Full Description</label>
                                    <textarea {...register("fullDescription", { required: "Full description is required" })} rows={6} className={getInputClass("fullDescription")} />
                                    {errors.fullDescription && <p className="text-sm text-red-600 mt-1">{errors.fullDescription.message}</p>}
                                </div>
                                
                                {/* Photos Upload */}
                                <div>
                                    <label className="font-bold block mb-1">Upload 3–5 Photos</label>
                                    <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handlePhotoChange(e.dataTransfer.files); }}
                                        onClick={() => document.getElementById("photos-input")?.click()}
                                        className={`rounded-lg p-4 text-center cursor-pointer transition border-2 border-dashed ${errors.media?.photos ? "border-red-500 ring-red-500" : "border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary hover:border-primary hover:ring-1 hover:ring-primary"} `}
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
                                
                                {/* Video Upload */}
                                <div>
                                    <label className="font-bold block mt-3">Intro Video (Optional)</label>
                                    <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleVideoChange(e.dataTransfer.files?.[0]); }}
                                        onClick={() => document.getElementById("video-input")?.click()}
                                        className={`rounded-lg p-4 text-center cursor-pointer transition border-2 border-dashed ${errors.media?.video ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary hover:border-primary hover:ring-1 hover:ring-primary"} `}
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
                        
                        {/* STEP 5: Package selection & featured toggle */}
                        {step === 5 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-secondary">Step 5: Package Selection</h2>
                                <p className="text-gray-700">Select the package that best fits your business needs. Required field.</p>
                                
                                {packages.map((pkg) => (
                                    <label key={pkg.PackageID} className={`block p-4 rounded-lg cursor-pointer transition-all ${watch("packageID") === pkg.PackageID ? "border-2 border-primary ring-1 ring-primary bg-primary-light" : "border border-gray-300 hover:border-primary"} `}>
                                        <div className="flex items-start">
                                            <input type="radio" value={pkg.PackageID} {...register("packageID", { required: "Package selection is required" })} className="mt-1 w-4 h-4 text-primary" />
                                            <div className="ml-3">
                                                <span className="font-bold text-lg block">{pkg.PackageName} - KES {pkg.PackagePrice.toLocaleString()}</span>
                                                <p className="text-sm text-gray-600">{pkg.Duration}</p>
                                                <ul className="text-xs text-gray-500 list-disc ml-4 mt-1">
                                                    {pkg.Features.map((f, i) => <li key={i}>{f}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </label>
                                ))}

                                {errors.packageID && <p className="text-sm text-red-600 mt-2">{errors.packageID.message}</p>}

                                {/* <div className={`p-4 rounded-lg border-l-4 mt-6 ${canBeFeatured ? "bg-green-50 border-green-500" : "bg-gray-100 border-gray-400"}`}>
                                    <label className={`flex items-center gap-3 cursor-pointer ${!canBeFeatured ? "opacity-60 cursor-not-allowed" : ""}`}>
                                        <input type="checkbox" {...register("isFeatured")} disabled={!canBeFeatured} className="w-5 h-5 text-primary rounded" /> 
                                        <div className="flex flex-col">
                                            <span className="font-bold">Make Listing Featured (Optional)</span>
                                            <span className="text-sm text-gray-600">
                                                {canBeFeatured ? "Enable for premium visibility." : "Only available with the Premium Featured Partner package."}
                                            </span>
                                        </div>
                                    </label>
                                </div> */}
                            </div>
                        )}
                        
                        {/* STEP 6: Review & Submit */}
                        {step === 6 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-secondary">Step 6: Review & Submit</h2>
                                <p className="text-gray-700">Please review all your details and the selected package before submitting the application for review.</p>

                                {/* Simple Review Summary (Expandable in a full app) */}
                                <div className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
                                    <h3 className="font-bold text-md border-b pb-1">Summary</h3>
                                    <p><strong>Business:</strong> {watch("businessName") || "N/A"}</p>
                                    <p><strong>Category:</strong> {watch("category") || "N/A"} / {watch("subcategory") || "N/A"}</p>
                                    <p><strong>Short Description:</strong> {watch("shortDescription") || "N/A"}</p>
                                    <p>
                                        <strong>Package:</strong> {selectedPackage?.PackageName || "N/A"} 
                                        (KES {selectedPackage?.PackagePrice.toLocaleString() || "N/A"})
                                        {watch("isFeatured") && <span className="text-green-600 font-semibold ml-2">(Featured)</span>}
                                    </p>
                                    <p><strong>Photos:</strong> {media.photos.length} uploaded.</p>
                                </div>
                                
                                <p className="text-sm text-red-500 font-semibold mt-4">
                                    By clicking 'Submit Application', you confirm all provided information is accurate and agree to the VisitNakuru.com Rules, Regulations & Code of Conduct.
                                </p>
                            </div>
                        )}

                        {/* Navigation buttons (kept styles requested) */}
                        <div className="flex justify-between mt-6">
                            {step > 1 && (
                                <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"> Back </button>
                            )}

                            {step < totalSteps ? (
                                <button type="button" onClick={nextStep} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition ml-auto"> Next </button>
                            ) : (
                                <button type="submit" disabled={isSubmitting || mutation.isPending} className={`px-4 py-2 rounded-lg text-white transition ml-auto ${(isSubmitting || mutation.isPending) ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary/90"}`} >
                                    {(isSubmitting || mutation.isPending) ? "Submitting..." : "Submit Application"}
                                </button>
                            )}
                        </div>

                        {serverError && <div className="bg-red-100 text-red-700 p-4 rounded mt-4">❌ {serverError}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}