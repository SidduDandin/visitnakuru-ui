// 'use client';

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";

// export default function AddBannerForm({
//   backendUrl,
//   authToken,
//   editingBanner,
//   setEditingBanner,
//   onBannerAdded,
//   onBannerUpdated,
//   onError,
//   handleAuthError,
//   onCancel,
// }) {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     reset,
//     setValue,
//     formState: { isSubmitting, errors },
//   } = useForm({
//     defaultValues: {
//       BannerTitle: "",
//       BannerImage: null,
//     },
//   });

//   const [imagePreview, setImagePreview] = useState(null);
//   const imageFile = watch("BannerImage");

 
//   useEffect(() => {
//     if (editingBanner) {
//       reset({  BannerTitle: editingBanner.BannerTitle || "", BannerImage: null });
//       setImagePreview(
//         editingBanner.BannerImage
//           ? `${backendUrl}/images/banners/${editingBanner.BannerImage}`
//           : null
//       );
//     } else {
//       reset();
//       setImagePreview(null);
//     }
//   }, [editingBanner, reset, backendUrl, setValue]);


//   useEffect(() => {
//     if (imageFile && imageFile[0]) {
//       const url = URL.createObjectURL(imageFile[0]);
//       setImagePreview(url);
//       return () => URL.revokeObjectURL(url);
//     }
//   }, [imageFile]);

//   const handleFormSubmit = async (data) => {
//     const formData = new FormData();

//     if (data.BannerTitle) {
//       formData.append("BannerTitle", data.BannerTitle);
//     }

   
//     if (data.BannerImage && data.BannerImage[0]) {
//       formData.append("BannerImage", data.BannerImage[0]);
//     }

//     try {
//       const url = editingBanner
//         ? `${backendUrl}/api/admin/banners/${editingBanner.BannerID}`
//         : `${backendUrl}/api/admin/banners`;
//       const method = editingBanner ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "x-auth-token": authToken || "" },
//         body: formData,
//       });

//       if (res.status === 401) {
//         handleAuthError();
//         return;
//       }

//       const resData = await res.json();
//       if (!res.ok) {
//         throw new Error(
//           resData.msg ||
//             `Error during ${editingBanner ? "update" : "creation"}.`
//         );
//       }

//       editingBanner ? onBannerUpdated() : onBannerAdded();
//       reset();
//       setEditingBanner(null);
//       setImagePreview(null);
//     } catch (err) {
//       onError(err.message);
//     }
//   };

//   return (
//     <div className="mb-6">
//       <h2 className="text-2xl font-bold">
//         {editingBanner ? "Update Banner" : "Add New Banner"}
//       </h2>
//       <form
//         onSubmit={handleSubmit(handleFormSubmit)}
//         className="space-y-4 mt-4"
//         encType="multipart/form-data"
//       >

//         <div>
//           <label htmlFor="bannerTitle" className="block mb-2 text-sm font-medium">
//             Banner Title (Optional)
//           </label>
//           <input
//             type="text"
//             id="bannerTitle"
//             {...register("BannerTitle")}
//             placeholder="Enter banner title"
//             className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm"
//           />
//         </div>
       
//         <div>
//           <label htmlFor="bannerImage" className="block mb-2 text-sm font-medium">
//             Banner Image
//           </label>
//           <input
//             type="file"
//             id="bannerImage"
//             {...register("BannerImage", {
//               required: !editingBanner && "Please upload a banner image.",
//               validate: (fileList) => {
//                 if (fileList?.length > 0) {
//                   const file = fileList[0];
//                   const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//                   if (!allowedTypes.includes(file.type)) {
//                     return "Invalid file type. Only JPG, PNG, JPEG, and WEBP allowed.";
//                   }
//                 }
//                 return true;
//               },
//             })}
//             accept=".jpeg, .png, .jpg, .webp"
//             className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm"
//           />
//           {errors.BannerImage && (
//             <p className="mt-2 text-sm text-red-600">{errors.BannerImage.message}</p>
//           )}

//           {imagePreview && (
//             <div className="mt-4">
//               <h3 className="text-lg font-medium">Image Preview</h3>
//               <img
//                 src={imagePreview}
//                 alt="Banner Preview"
//                 className="mt-2 max-w-full h-auto rounded-lg shadow-md"
//               />
//             </div>
//           )}
//         </div>

     
//         <div className="flex space-x-2">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             {isSubmitting ? "Processing..." : editingBanner ? "Update Banner" : "Add Banner"}
//           </button>
//           <button
//             type="button"
//             onClick={onCancel}
//             className="mt-2 px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


// 'use client';

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const LANGUAGES = [
  { key: 'en', label: 'English (Default)', field: 'BannerTitle_en' },
  { key: 'es', label: 'Spanish', field: 'BannerTitle_es' },
  { key: 'fr', label: 'French', field: 'BannerTitle_fr' },
  { key: 'de', label: 'German', field: 'BannerTitle_de' },
  { key: 'zh', label: 'Chinese', field: 'BannerTitle_zh' },
];

// Generate default values for the form
const defaultTitles = LANGUAGES.reduce((acc, lang) => {
    acc[lang.field] = "";
    return acc;
}, {});

export default function AddBannerForm({
  backendUrl,
  authToken,
  editingBanner,
  setEditingBanner,
  onBannerAdded,
  onBannerUpdated,
  onError,
  handleAuthError,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      ...defaultTitles, // Initialize all language fields
      BannerImage: null,
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const imageFile = watch("BannerImage");

 
  useEffect(() => {
    if (editingBanner) {
      // Set all language titles from the existing banner data
      const titles = LANGUAGES.reduce((acc, lang) => {
          acc[lang.field] = editingBanner[lang.field] || "";
          return acc;
      }, {});

      reset({ ...titles, BannerImage: null });
      setImagePreview(
        editingBanner.BannerImage
          ? `${backendUrl}/images/banners/${editingBanner.BannerImage}`
          : null
      );
    } else {
      reset();
      setImagePreview(null);
    }
  }, [editingBanner, reset, backendUrl, setValue]);


  useEffect(() => {
    if (imageFile && imageFile[0]) {
      const url = URL.createObjectURL(imageFile[0]);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (imageFile === null && !editingBanner) {
        // Only clear preview if not in editing mode and no new file selected
        setImagePreview(null);
    }
  }, [imageFile, editingBanner]);


  const onSubmit = async (data) => {
    // FormData is required for file uploads (multipart/form-data)
    const formData = new FormData();

    // 1. Append all language titles
    LANGUAGES.forEach(lang => {
        // Send all fields, even if empty, as the backend expects them
        formData.append(lang.field, data[lang.field] || ''); 
    });

    // 2. Append image data
    if (data.BannerImage && data.BannerImage[0]) {
      formData.append("BannerImage", data.BannerImage[0]);
    }

    const method = editingBanner ? "PUT" : "POST";
    const url = editingBanner
      ? `${backendUrl}/api/admin/banners/${editingBanner.BannerID}`
      : `${backendUrl}/api/admin/banners`;

    try {
      const res = await fetch(url, {
        method,
        // NOTE: Do NOT set Content-Type header when using FormData
        headers: {
          "x-auth-token": authToken || "",
        },
        body: formData,
      });

      if (res.status === 401) {
        handleAuthError();
        return;
      }

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.msg || `Failed to ${editingBanner ? 'update' : 'add'} banner: ${res.status}`);
      }

      // Assuming the backend sends the created/updated banner object back
      if (editingBanner) {
        onBannerUpdated(result.banner);
      } else {
        onBannerAdded(result.banner);
      }
      
      reset(); // Clear form state after successful submission
      setEditingBanner(null); // Clear editing state
    } catch (err) {
      onError(err.message);
    }
  };


  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl dark:bg-gray-800">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {editingBanner ? "Edit Banner" : "Add New Banner"}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* LANGUAGE TITLE INPUTS (All optional) */}
        {LANGUAGES.map(lang => (
            <div className="mb-4" key={lang.key}>
                <label
                    htmlFor={lang.field}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                    Banner Title ({lang.label}) (Optional)
                </label>
                <input
                    type="text"
                    id={lang.field}
                    {...register(lang.field, {
                        // All titles are optional as per the Prisma model
                    })}
                    className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {errors[lang.field] && (
                    <p className="mt-2 text-sm text-red-600">{errors[lang.field].message}</p>
                )}
            </div>
        ))}

        {/* BANNER IMAGE INPUT */}
        <div className="mb-4">
          <label
            htmlFor="BannerImage"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            Banner Image {editingBanner ? "(Leave blank to keep current)" : <span className="text-red-500">*</span>}
          </label>
          <input
            type="file"
            id="BannerImage"
            {...register("BannerImage", {
              validate: (value) => {
                if (!editingBanner && (!value || value.length === 0)) {
                  // Image is mandatory for new banners
                  return "Banner Image is required for new banners.";
                }
                if (value && value[0]) {
                  const file = value[0];
                  if (file.size > 5 * 1024 * 1024) {
                    return "File size must be less than 5MB.";
                  }
                  const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                    "image/webp",
                  ];
                  if (!allowedTypes.includes(file.type)) {
                    return "Invalid file type. Only JPG, PNG, JPEG, and WEBP allowed.";
                  }
                }
                return true;
              },
            })}
            accept=".jpeg, .png, .jpg, .webp"
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm"
          />
          {errors.BannerImage && (
            <p className="mt-2 text-sm text-red-600">{errors.BannerImage.message}</p>
          )}

          {imagePreview && (
            <div className="mt-4">
              <h3 className="text-lg font-medium">Image Preview</h3>
              <img
                src={imagePreview}
                alt="Banner Preview"
                className="mt-2 max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

     
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isSubmitting ? "Processing..." : editingBanner ? "Update Banner" : "Add Banner"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="mt-2 px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}