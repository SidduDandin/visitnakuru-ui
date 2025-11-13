'use client';

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Editor } from "primereact/editor";
import Button from "../ui/button/Button"; 

const generateUrlSlug = (title = "") => {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

const editorHeader = (
    <span className="ql-formats">
        <select className="ql-header" defaultValue="0">
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="0">Normal</option>
        </select>
        <select className="ql-font" defaultValue="sans-serif">
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
        </select>

        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <select className="ql-color"></select>
        <select className="ql-background"></select>
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <select className="ql-align"></select>
        <button className="ql-link"></button>
        <button className="ql-image"></button>
        <button className="ql-clean"></button>
    </span>
);


export default function AddBlogForm({
    backendUrl,
    authToken,
    editingBlog,
    setEditingBlog,
    onBlogAdded,
    onBlogUpdated,
    onError,
    handleAuthError,
    onCancel,
}) {
    
    const defaultValues = {
        blogTitle_en: "", blogTitle_es: "", blogTitle_fr: "", blogTitle_de: "", blogTitle_zh: "",
        blogDescription_en: "", blogDescription_es: "", blogDescription_fr: "", blogDescription_de: "", blogDescription_zh: "",
        Image: null,
    };
    
    const languageFields = [
        { lang: 'en', label: 'English (EN)', titleField: 'blogTitle_en', descriptionField: 'blogDescription_en', required: true },
        { lang: 'es', label: 'Spanish (ES)', titleField: 'blogTitle_es', descriptionField: 'blogDescription_es', required: false },
        { lang: 'fr', label: 'French (FR)', titleField: 'blogTitle_fr', descriptionField: 'blogDescription_fr', required: false },
        { lang: 'de', label: 'German (DE)', titleField: 'blogTitle_de', descriptionField: 'blogDescription_de', required: false },
        { lang: 'zh', label: 'Chinese (ZH)', titleField: 'blogTitle_zh', descriptionField: 'blogDescription_zh', required: false },
    ];
    

    const { register, handleSubmit, watch, reset, setValue, formState: { isSubmitting, errors },
    } = useForm({ defaultValues });

    const [imagePreview, setImagePreview] = useState(null);
    const [activeTab, setActiveTab] = useState('en'); 
    const [tabSwitchError, setTabSwitchError] = useState(null); 

    const watchedValues = watch(); 
    const imageFile = watchedValues.Image;

    
    useEffect(() => {
        if (imageFile && imageFile[0]) {
            const url = URL.createObjectURL(imageFile[0]);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);



    useEffect(() => {
        if (editingBlog) {
            reset({
                ...editingBlog, 
                Image: null, 
            });
            setTabSwitchError(null); 
            setImagePreview(editingBlog.Image ? `${backendUrl}/images/blogs/${editingBlog.Image}` : null);
        } else {
            reset(defaultValues);
            setTabSwitchError(null); 
            setImagePreview(null);
        }
    }, [editingBlog, reset, backendUrl]);
    
    

    const getDescriptionValidationRules = (tab) => ({
        required: tab.required && `Please enter the ${tab.label} description.`,
        validate: (value) => {
            if (tab.required) {
                const plainText = (value || "").replace(/<[^>]*>/g, "").trim();
                return (plainText.length >= 20 || "Description must be at least 20 characters long.");
            }
            return true;
        },
    });


    const handleTabClick = (lang) => {
        if (lang === 'en') {
            setTabSwitchError(null);
            setActiveTab('en');
            return;
        }

        const enTitle = watchedValues.blogTitle_en;
        if (!enTitle || enTitle.trim() === "") {
            setTabSwitchError("Please enter a Title in the English (EN) tab first.");
            return;
        }

        const enDescription = watchedValues.blogDescription_en;
        const enDescriptionPlainText = (enDescription || "").replace(/<[^>]*>/g, "").trim();

        if (enDescriptionPlainText.length < 20) {
            setTabSwitchError("Please enter a Description (min 20 characters) in the English (EN) tab first.");
            return;
        }

        setTabSwitchError(null);
        setActiveTab(lang);
    };


    const handleFormSubmit = async (data) => {

        const trimmedEnTitle = data.blogTitle_en ? data.blogTitle_en.trim() : '';
        
        const enDescriptionPlainText = (data.blogDescription_en || "").replace(/<[^>]*>/g, "").trim();
        if (!trimmedEnTitle || enDescriptionPlainText.length < 20) {
            onError("Please ensure the English Title and Description are fully completed before submitting.");
            handleTabClick(activeTab); 
            return; 
        }
        
        
        const formData = new FormData();

        //const slug = generateUrlSlug(data.blogTitle_en); 
        const slug = generateUrlSlug(trimmedEnTitle);
        formData.append("blogURL", slug);

        for (const key in data) {
            if (key === "Image") {
                if (data[key] && data[key][0]) {
                    
                    formData.append(key, data[key][0]);
                } 
              
             } 
             else if (key !== 'published' && key !== 'isFeatured') {
               // formData.append(key, data[key] || ""); 

               if (key.startsWith('blogTitle_')) {
                    const trimmedValue = (data[key] || '').trim();
                    formData.append(key, trimmedValue); 
                } else {
                    // For description and other non-title fields, append as is
                    formData.append(key, data[key] || ""); 
                }
            }
        }
        
        if (
            (editingBlog && editingBlog.Image) && 
            (!data.Image || data.Image.length === 0)
        ) {
           
        }


        try {
            const url = editingBlog
                ? `${backendUrl}/api/blogs/admin/${editingBlog.blogId}`
                : `${backendUrl}/api/blogs/admin`;
            const method = editingBlog ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "x-auth-token": authToken || "" },
                body: formData,
            });

            if (res.status === 401) {
                handleAuthError();
                return;
            }

            const resData = await res.json();
            if (!res.ok) {
                throw new Error(resData.msg || `Error during blog ${editingBlog ? "update" : "creation"}.`);
            }

            editingBlog ? onBlogUpdated() : onBlogAdded();
            
            reset(defaultValues); 
            setEditingBlog(null);
            setImagePreview(null);
            
        } catch (err) {
            onError(err.message);
        }
    };

   
    

    return (
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingBlog ? "Update Blog" : "Add New Blog"}
            </h2>

            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6 mt-4"
                encType="multipart/form-data"
            >
               
                <div className="border p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Multi-Language Content</h3>

                    
                    {tabSwitchError && (
                        <div className="p-3 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800" role="alert">
                            <span className="font-medium">Attention!</span> {tabSwitchError}
                        </div>
                    )}
                    
                    <div className="flex border-b mb-4">
                        {languageFields.map((tab) => (
                            <button
                                key={tab.lang}
                                type="button"
                                onClick={() => handleTabClick(tab.lang)}
                                className={`py-2 px-4 text-sm font-medium ${
                                    activeTab === tab.lang
                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label} {tab.required && <span className="text-red-500">*</span>}
                            </button>
                        ))}
                    </div>

                    {languageFields.map((tab) => (
                        <div key={tab.lang} style={{ display: activeTab === tab.lang ? 'block' : 'none' }}>
                            
                            
                            <label htmlFor={tab.titleField} className="block mb-2 text-sm font-medium">
                                Title ({tab.label}) {tab.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="text"
                                id={tab.titleField}
                                {...register(tab.titleField, {
                                    required: tab.required && `Please enter the ${tab.label} title.`,
                                })}
                                className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm mb-4"
                            />
                            {errors[tab.titleField] && <p className="mt-2 text-sm text-red-600">{errors[tab.titleField].message}</p>}

                           
                            <label className="block mb-2 text-sm font-medium">
                                Description ({tab.label}) {tab.required && <span className="text-red-500">*</span>}
                            </label>
                            <Editor
                                headerTemplate={editorHeader}
                                value={watchedValues[tab.descriptionField]} 
                                onTextChange={(e) => {
                                    setValue(tab.descriptionField, e.htmlValue, { shouldValidate: true });
                                }}
                                style={{ height: "320px" }}
                            />
                            <input
                                type="hidden"
                                {...register(tab.descriptionField, getDescriptionValidationRules(tab))}
                            />
                            {errors[tab.descriptionField] && <p className="mt-2 text-sm text-red-600">{errors[tab.descriptionField].message}</p>}
                        </div>
                    ))}

                <div className="mt-4">
                    <label htmlFor="image" className="block mb-2 text-sm font-medium">Image <span className="text-red-500">*</span></label>
                    <input
                        type="file"
                        id="image"
                        {...register("Image", {
                            required: !editingBlog && !imagePreview && "Please upload an Image.", 
                            validate: (fileList) => {
                                if (fileList?.length > 0) {
                                    const file = fileList[0];
                                    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
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
                    {errors.Image && <p className="mt-2 text-sm text-red-600">{errors.Image.message}</p>}
                    
                    {imagePreview && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium">Image Preview</h3>
                            <div className="relative inline-block mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Image Preview"
                                    className="max-w-full h-auto rounded-lg shadow-md max-h-60"
                                />
                               
                            </div>
                        </div>
                    )}
                </div>
                </div>
                
                
                


                <div className="flex space-x-2 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="mt-2">
                        {isSubmitting ? "Processing..." : editingBlog ? "Update Blog" : "Add Blog"}
                    </Button>
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}