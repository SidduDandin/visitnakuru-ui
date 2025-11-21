'use client';

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/button/Button"; 

export default function AddPackageForm({
    backendUrl,
    authToken,
    editingPackage,
    setEditingPackage,
    onPackageAdded,
    onPackageUpdated,
    onError,
    handleAuthError,
    onCancel,
}) {
    
    const defaultValues = {
        PackageName: "",
        DurationInDays: "",
        PackagePrice: "",
        Description: "",
    };
    

    const { register, handleSubmit, reset, formState: { isSubmitting, errors },
    } = useForm({ defaultValues });

    
    useEffect(() => {
        if (editingPackage) {
            reset({
                PackageName: editingPackage.PackageName,
                DurationInDays: editingPackage.DurationInDays.toString(), 
                PackagePrice: editingPackage.PackagePrice.toString(), 
                Description: editingPackage.Description,
            });
        } else {
            reset(defaultValues);
        }
    }, [editingPackage, reset]);
    

    const handleFormSubmit = async (data) => {

        const trimmedPackageName = data.PackageName.trim();
        
        const packageData = {
            ...data,
            PackageName: trimmedPackageName,
            DurationInDays: parseInt(data.DurationInDays), 
            PackagePrice: parseFloat(data.PackagePrice), 
        };

        try {
            const url = editingPackage
                ? `${backendUrl}/api/admin/packages/${editingPackage.PackageID}`
                : `${backendUrl}/api/admin/packages`;
            const method = editingPackage ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { 
                    "Content-Type": "application/json", 
                    "x-auth-token": authToken || "" 
                },
                body: JSON.stringify(packageData),
            });

            if (res.status === 401) {
                handleAuthError();
                return;
            }

            const resData = await res.json();
            if (!res.ok) {
                
                if (res.status === 400 && resData.msg && resData.msg.includes('already exists')) {
                    throw new Error(resData.msg);
                }
                throw new Error(resData.msg || `Error during package ${editingPackage ? "update" : "creation"}.`);
            }

            editingPackage ? onPackageUpdated() : onPackageAdded();
            
            reset(defaultValues); 
            setEditingPackage(null);
            
        } catch (err) {
            onError(err.message);
        }
    };

   
    
    const rules = {
        PackageName: { required: "Please enter Package Name." },
        DurationInDays: { 
            required: "Please enter Duration.",
            min: { value: 1, message: "Duration must be at least 1 day." },
            valueAsNumber: true,
            pattern: { value: /^\d+$/, message: "Duration must be a whole number." }
        },
        PackagePrice: { 
            required: "Please enter Price.",
            min: { value: 0.01, message: "Price must be greater than 0." },
            valueAsNumber: true,
        },
        Description: { 
            required: "Please enter Description.",
            minLength: { value: 20, message: "Description must be at least 20 characters long." }
        },
    };

    return (
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingPackage ? `Update Package: ${editingPackage.PackageName}` : "Add New Package"}
            </h2>

            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6 mt-4"
            >
               
                <div>
                    <label htmlFor="PackageName" className="block mb-2 text-sm font-medium">
                        Package Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="PackageName"
                        {...register("PackageName", rules.PackageName)}
                        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.PackageName && <p className="mt-2 text-sm text-red-600">{errors.PackageName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   
                    <div>
                        <label htmlFor="DurationInDays" className="block mb-2 text-sm font-medium">
                            Duration In Days <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="DurationInDays"
                            step="1"
                            {...register("DurationInDays", rules.DurationInDays)}
                            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {errors.DurationInDays && <p className="mt-2 text-sm text-red-600">{errors.DurationInDays.message}</p>}
                    </div>

                    
                    <div>
                        <label htmlFor="PackagePrice" className="block mb-2 text-sm font-medium">
                            Package Price (Ksh) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="PackagePrice"
                            step="0.01"
                            {...register("PackagePrice", rules.PackagePrice)}
                            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {errors.PackagePrice && <p className="mt-2 text-sm text-red-600">{errors.PackagePrice.message}</p>}
                    </div>
                </div>

               
                <div>
                    <label htmlFor="Description" className="block mb-2 text-sm font-medium">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="Description"
                        rows="4"
                        {...register("Description", rules.Description)}
                        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    ></textarea>
                    {errors.Description && <p className="mt-2 text-sm text-red-600">{errors.Description.message}</p>}
                </div>
                
                
                
                <div className="flex space-x-2 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="mt-2">
                        {isSubmitting ? "Processing..." : editingPackage ? "Update Package" : "Add Package"}
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