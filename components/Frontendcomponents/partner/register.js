
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

/**
 * PartnerOnboarding (JSX)
 * - Uses exact DocType enum keys when prefixing filenames.
 */

export default function PartnerOnboarding({ apiUrl }) {
  const totalSteps = 4;
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState({}); // { DOC_ENUM_KEY: File }
  const [media, setMedia] = useState({ photos: [], video: undefined });
  const [isSuccessPage, setIsSuccessPage] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setError,
    clearErrors,
  } = useForm({ mode: "onBlur" });

  // ---- doc keys matching your Prisma enum DocType ----
  const docList = [
    { key: "BUSINESS_REGISTRATION", label: "Business Registration Certificate" },
    { key: "TOURISM_LICENSE", label: "Tourism / Hospitality License" },
    { key: "KRA_PIN", label: "KRA PIN Certificate" },
    { key: "ID_PASSPORT", label: "ID / Passport" },
    { key: "HEALTH_SAFETY", label: "Health & Safety Certificate" },
    { key: "INSURANCE", label: "Insurance Cover (if applicable)" },
  ];

  // ---- Mutation ----
  const mutation = useMutation({
    mutationFn: async (data) => {
      setServerError(null);
      const formData = new FormData();

      // Append text fields (with socialLinks normalization)
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "socialLinks") {
            try {
              const parsed = JSON.parse(value);
              formData.append(key, JSON.stringify(parsed));
            } catch {
              // try to turn comma-separated into array then string
              const arr = String(value).split(",").map((s) => s.trim()).filter(Boolean);
              formData.append(key, JSON.stringify(arr));
            }
          } else {
            formData.append(key, value);
          }
        }
      });

      // documents_meta: describe docKey => uploaded filename
      const documentsMeta = [];

      // Append documents — prefix file name with exact enum key
      Object.entries(documents).forEach(([docKey, file]) => {
        if (file) {
          const prefixedName = `${docKey}_${file.name}`;
          formData.append("documents", file, prefixedName);
          documentsMeta.push({ key: docKey, originalName: file.name, uploadedName: prefixedName });
        }
      });

      if (documentsMeta.length) {
        formData.append("documents_meta", JSON.stringify(documentsMeta));
      }

      // Append media
      media.photos.forEach((file) => formData.append("media", file));
      if (media.video) formData.append("media", media.video);

      // send
      const res = await fetch(apiUrl, { method: "POST", body: formData });

      if (!res.ok) {
        let errMsg = `HTTP ${res.status}`;
        const ct = res.headers.get("content-type") || "";
        try {
          if (ct.includes("application/json")) {
            const body = await res.json();
            errMsg = body?.error || body?.message || JSON.stringify(body);
          } else {
            const text = await res.text();
            errMsg = text || errMsg;
          }
        } catch (e) {
          // swallow parsing error
        }
        throw new Error(errMsg);
      }

      return res.json();
    },
    onSuccess: () => setIsSuccessPage(true),
    onError: (err) => {
      setServerError(err?.message || "Registration failed");
      console.error("Registration failed:", err);
    },
  });

  // ---- validation helpers ----
  const isValidFile = (file, allowVideo = false) => {
    if (!file) return false;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (allowVideo) allowed.push("video/mp4");
    return allowed.includes(file.type);
  };

  const handleFileChange = (docKey, file) => {
    if (file && !isValidFile(file)) {
      alert("Only PDF or image files are allowed for documents.");
      setDocuments((prev) => ({ ...prev, [docKey]: null }));
      return;
    }
    setDocuments((prev) => ({ ...prev, [docKey]: file }));
  };

  const handlePhotoChange = (files) => {
    const arr = Array.from(files || []);
    const validFiles = arr.filter((f) => isValidFile(f));
    if (validFiles.length !== arr.length) {
      alert("Only image files are allowed for photos.");
    }
    setMedia((prev) => ({ ...prev, photos: validFiles }));
  };

  const handleVideoChange = (file) => {
    if (file && !isValidFile(file, true)) {
      alert("Only MP4 video (or allowed image/pdf) is allowed for the intro video.");
      setMedia((prev) => ({ ...prev, video: undefined }));
      return;
    }
    setMedia((prev) => ({ ...prev, video: file || undefined }));
  };

  // ---- navigation ----
  const nextStep = async () => {
    let valid = await trigger();

    if (step === 2) {
      for (const { key } of docList) {
        if (!documents[key]) {
          valid = false;
          setError(`documents.${key}`, { type: "required", message: `${key} is required` });
        } else {
          clearErrors(`documents.${key}`);
        }
      }
    }

    if (step === 3) {
      if (media.photos.length < 3 || media.photos.length > 5) {
        valid = false;
        setError("media.photos", { type: "manual", message: "Please upload between 3 and 5 photos" });
      } else {
        clearErrors("media.photos");
      }
      if (!media.video) {
        valid = false;
        setError("media.video", { type: "manual", message: "An intro video is required" });
      } else {
        clearErrors("media.video");
      }
    }

    if (valid) setStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (data) => {
    setServerError(null);
    // normalize socialLinks if user entered csv
    if (data.socialLinks && typeof data.socialLinks === "string") {
      try {
        JSON.parse(data.socialLinks);
      } catch {
        const arr = String(data.socialLinks).split(",").map((s) => s.trim()).filter(Boolean);
        data.socialLinks = JSON.stringify(arr);
      }
    }
    mutation.mutate(data);
  };

  // Success page
  if (isSuccessPage) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-green-600">🎉 Registration Successful!</h1>
          <p className="mt-4 text-gray-700">
            Your partner application has been submitted. We will review it shortly.
          </p>
        </div>
      </div>
    );
  }

  // ---- JSX form ----
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary text-white text-center py-6">
            <h1 className="h3 font-bold">Partner Onboarding</h1>
            <p className="text-white text-sm mt-1">Step {step} of {totalSteps}</p>
            <div className="w-3/4 h-2 bg-border rounded-full mx-auto mt-2">
              <div style={{ width: `${(step / totalSteps) * 100}%` }} className="h-full bg-white transition-all duration-300" />
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && <Step1 register={register} errors={errors} />}
              {step === 2 && <Step2 documents={documents} errors={errors} docList={docList} handleFileChange={handleFileChange} />}
              {step === 3 && <Step3 media={media} errors={errors} handlePhotoChange={handlePhotoChange} handleVideoChange={handleVideoChange} />}
              {step === 4 && <Step4 />}

              <div className="flex justify-between mt-6">
                {step > 1 && <button type="button" onClick={prevStep} className="btn btn-secondary">Back</button>}
                {step < totalSteps ? (
                  <button type="button" onClick={nextStep} className="btn btn-primary ml-auto">Next</button>
                ) : (
                  <button type="submit" className="btn btn-primary ml-auto" disabled={mutation.isLoading}>
                    {mutation.isLoading ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>

              {serverError && <div className="bg-red-100 text-primary p-4 rounded mt-4">❌ {serverError}</div>}
              {mutation.isLoading && <p className="text-blue-600 mt-4">Submitting your data...</p>}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ------------------ Helper components ------------------ */

const InputField = ({ label, name, type = "text", register, errors, placeholder }) => (
  <div>
    <label className="font-bold block mb-1">{label}</label>
    <input type={type} placeholder={placeholder || ""} {...register(name, { required: `${label} is required` })} className={`w-full border px-4 py-2 rounded ${errors[name] ? "border-red-500" : "border-gray-300"}`} />
    {errors[name] && <p className="text-sm text-red-600">{errors[name].message}</p>}
  </div>
);

const Step1 = ({ register, errors }) => (
  <div className="space-y-4">
    <h2 className="sub-heading text-secondary">Step 1: Business Registration</h2>
    <InputField label="Business Name" name="businessName" register={register} errors={errors} />
    <InputField label="Contact Person" name="contactPerson" register={register} errors={errors} />
    <InputField label="Email" name="email" type="email" register={register} errors={errors} />
    <InputField label="Phone" name="phone" register={register} errors={errors} />
    <InputField label="Website" name="website" register={register} errors={errors} />
    <div>
      <label className="font-bold block mb-1">Business Category</label>
      <select {...register("category", { required: "Business Category is required" })} className={`w-full border px-4 py-2 rounded ${errors.category ? "border-red-500" : "border-gray-300"}`}>
        <option value="">Select Category</option>
        <option value="Hotel">Hotel</option>
        <option value="Lodge">Lodge</option>
        <option value="Tour Operator">Tour Operator</option>
        <option value="Other">Other</option>
      </select>
      {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
    </div>
    <InputField label="Social Links" name="socialLinks" register={register} errors={errors} placeholder='["https://fb.com/yourpage","https://insta.com/yourpage"]' />
  </div>
);

const Step2 = ({ documents, errors, docList, handleFileChange }) => (
  <div className="space-y-4">
    <h2 className="sub-heading text-secondary">Step 2: Upload Required Documents</h2>
    {docList.map(({ key, label }) => (
      <div key={key}>
        <label className="font-bold block mb-1">{label}</label>
        <input accept=".pdf,image/*" type="file" className="w-full py-2 px-4 border rounded" onChange={(e) => handleFileChange(key, e.target.files?.[0] || null)} />
        {errors?.documents?.[key] && <p className="text-sm text-red-600">{errors.documents[key].message}</p>}
      </div>
    ))}
  </div>
);

const Step3 = ({ media, errors, handlePhotoChange, handleVideoChange }) => (
  <div className="space-y-4">
    <h2 className="sub-heading text-secondary">Step 3: Upload Multimedia</h2>
    <label className="font-bold block mb-1">Upload 3–5 high-quality photos</label>
    <input type="file" multiple accept="image/*" className="w-full py-2 px-4 border rounded" onChange={(e) => handlePhotoChange(e.target.files)} />
    {errors?.media?.photos && <p className="text-sm text-red-600">{errors.media.photos.message}</p>}

    <label className="font-bold block mb-1 mt-4">Upload intro video (30–60s)</label>
    <input type="file" accept="video/mp4,video/*" className="w-full py-2 px-4 border rounded" onChange={(e) => handleVideoChange(e.target.files?.[0] || null)} />
    {errors?.media?.video && <p className="text-sm text-red-600">{errors.media.video.message}</p>}
  </div>
);

const Step4 = () => (
  <div className="space-y-4">
    <h2 className="sub-heading text-secondary">Step 4: Automated Verification</h2>
    <p className="text-dark-gray">
      ✅ Document Check: System validates file formats & completeness.<br />
      ✅ KRA PIN Cross-check via iTax API (if available).<br />
      ✅ AI Duplicate Check: Flags duplicate or fake entries.
    </p>
  </div>
);
