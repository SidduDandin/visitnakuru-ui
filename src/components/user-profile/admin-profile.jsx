"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/button/Button';

// 1. Helper function to get a cookie by name from document.cookie
const getCookie = (name) => {
    if (typeof document === 'undefined') {
        return null;
    }
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};


export default function AdminProfileCard() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    // Function to fetch the admin's profile data
    const fetchProfile = async () => {
        try {
            // 2. Read the auth token from cookies using our helper function
            const token = getCookie('authToken');

            if (!token) {
                setErrorMessage("Authentication token not found. Please log in again.");
                setLoading(false);
                return;
            }

            const response = await fetch(`${backendUrl}/api/auth/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            });

            if (!response.ok) {
                // If the response is not OK, try to parse the error message from the backend.
                let errorMsg = 'Failed to fetch profile data.';
                try {
                    const errorData = await response.json();
                    // Use the backend's specific message if it exists.
                    if (errorData && errorData.msg) {
                        errorMsg = errorData.msg;
                    }
                } catch (jsonError) {
                    // If the response body isn't valid JSON, we'll stick with a generic error.
                    console.error("Could not parse error response JSON:", jsonError);
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();

            setValue("fullName", data.fullname);
            setValue("phoneNumber", data.phoneNumber);
            setValue("emailAddress", data.email);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Set the more specific error message we constructed in the try block.
            setErrorMessage(error.message);
            setLoading(false);
        }
    };

    // Call fetchProfile on component mount
    useEffect(() => {
        fetchProfile();
    }, []);

    // Function to handle form submission
    const onSubmit = async (formData) => {
        setSuccessMessage(""); // Clear previous messages
        setErrorMessage("");

        try {
            // 3. Read the auth token from cookies here as well
            const token = getCookie('authToken');
             if (!token) {
                setErrorMessage("Authentication token not found. Please log in again.");
                return;
            }

            const response = await fetch(`${backendUrl}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({
                    fullname: formData.fullName,
                    phoneNumber: formData.phoneNumber
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to update profile');
            }

            const result = await response.json();
            setSuccessMessage(result.msg);
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage(error.message);
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading profile...</div>;
    }

    return (
        <div className="lg:col-span-1">
            <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Profile Information
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Update your personal information
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-grow flex-col justify-between">
                    <div>
                        {successMessage && (
                            <div className="p-3 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <div className="flex flex-col gap-5">
                            <div>
                                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                                    placeholder="Your full name"
                                    {...register("fullName", { required: "Please enter full name." })}
                                />
                                {errors.fullName && <span className="text-red-500 text-sm mt-1">{errors.fullName.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                                    placeholder="+254 700 000 000"
                                    {...register("phoneNumber", {
                                        required: "Please enter phone number.",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Invalid phone number format"
                                        }
                                    })}
                                />
                                {errors.phoneNumber && <span className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="emailAddress" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="emailAddress"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-sm text-gray-500 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                    placeholder="admin@breakfaim.com"
                                    readOnly
                                    {...register("emailAddress")}
                                />
                            </div>
                        </div>
                    </div>

                    <Button className="mt-5 w-full" size="sm"
                        type="submit"
                        //className="mt-5 w-full rounded-lg bg-orange-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                    >
                        Update Profile
                    </Button>
                </form>
            </div>
        </div>
    );
}
