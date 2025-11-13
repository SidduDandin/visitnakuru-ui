import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const LANGUAGES = [
  { key: 'en', label: 'English (Default)', field: 'BannerTitle_en' },
  { key: 'es', label: 'Spanish', field: 'BannerTitle_es' },
  { key: 'fr', label: 'French', field: 'BannerTitle_fr' },
  { key: 'de', label: 'German', field: 'BannerTitle_de' },
  { key: 'zh', label: 'Chinese', field: 'BannerTitle_zh' },
];


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
      ...defaultTitles, 
      BannerImage: null,
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const imageFile = watch("BannerImage");

 
  useEffect(() => {
    if (editingBanner) {
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
        setImagePreview(null);
    }
  }, [imageFile, editingBanner]);


  const onSubmit = async (data) => {
   
    const formData = new FormData();

   
    LANGUAGES.forEach(lang => {
       
        //formData.append(lang.field, data[lang.field] || ''); 
        const trimmedTitle = (data[lang.field] || '').trim();
        formData.append(lang.field, trimmedTitle);
    });


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

   
      if (editingBanner) {
        onBannerUpdated(result.banner);
      } else {
        onBannerAdded(result.banner);
      }
      
      reset(); 
      setEditingBanner(null); 
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
                        
                    })}
                    className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {errors[lang.field] && (
                    <p className="mt-2 text-sm text-red-600">{errors[lang.field].message}</p>
                )}
            </div>
        ))}

       
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