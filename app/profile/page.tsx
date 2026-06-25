'use client';

import Image from "next/image";
import { userService } from "@/lib/services/user-service";
import { UserProfileResponse, UserProfileRequest } from "@/types/user";
import { useEffect, useState, useRef } from "react";

export default function ProfilePage() {
    const [userProfile, setProfile] = useState<UserProfileResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [bio, setBio] = useState("");
    const [addresses, setAddresses] = useState<string[]>([]);
    
    // Image Upload Ref & State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = () => {
        userService.getUserProfile()
            .then((data) => {
                setProfile(data);
                setFullName(data.fullName ?? "");
                setPhoneNumber(data.phoneNumber ?? "");
                setBio(data.bio ?? "");
                setAddresses(data.addresses ?? []);
                setPreviewUrl(data.avatarUrl ?? null);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching profile:", err);
                setLoading(false);
            });
    };

    // Handle Image Change (Frontend Preview)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // लोकल प्रीव्यू के लिए
        }
    };

    // Form Submit Handler
    const handleSave = async () => {
        setSubmitLoading(true);
        try {
            // 1. पहले Text Data अपडेट करो (तुम्हारे userService.updateUserProfile का उपयोग करके)
            const updatePayload: UserProfileRequest = {
                fullName,
                email: userProfile?.email ?? "", // Email आमतौर पर रीड-ओनली होता है
                phoneNumber,
                addresses
            };
            
            // यहाँ तुम bio भी भेज सकते हो अगर UserProfileRequest में backend पर मौजूद है
            // (अगर Request DTO में bio नहीं है, तो उसे DTO में भी जोड़ लेना)
            await userService.updateUserProfile(updatePayload);

            // 2. अगर इमेज भी सेलेक्ट की है, तो Multipart फ़ाइल बैकेंड पर भेजो
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                // TODO: यहाँ अपनी इमेज अपलोड की API कॉल डालना, जैसे:
                // await apiClient.post(`/user/api/profile/avatar`, formData, {
                //     headers: { 'Content-Type': 'multipart/form-data' }
                // });
            }

            // डेटा को रिफ्रेश करें और एडिट मोड बंद करें
            fetchProfileData();
            setIsEditing(false);
            alert("Profile updated successfully! 🎉");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Address Array Helper Functions
    const handleAddressChange = (index: number, value: string) => {
        const newAddresses = [...addresses];
        newAddresses[index] = value;
        setAddresses(newAddresses);
    };

    const addAddressField = () => setAddresses([...addresses, ""]);
    const removeAddressField = (index: number) => setAddresses(addresses.filter((_, i) => i !== index));

    if (loading) {
        return (
            <main className="max-w-4xl mx-auto p-4 md:p-8 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-2xl w-full mb-6"></div>
                <div className="flex flex-col sm:flex-row items-center gap-6 -mt-16 px-6">
                    <div className="w-28 h-28 bg-gray-300 rounded-full border-4 border-white shadow-lg"></div>
                </div>
            </main>
        );
    }

    if (!userProfile) return null;

    return (
        <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
            
            {/* Hidden File Input for Avatar */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
            />

            {/* --- HEADER BANNER CARD --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-orange-500 to-amber-500 w-full" />
                
                <div className="px-6 pb-6 flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-14 text-center sm:text-left">
                    
                    {/* Avatar Group with Click-to-Upload Indicator */}
                    <div 
                        onClick={() => isEditing && fileInputRef.current?.click()}
                        className={`relative w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-white group ${isEditing ? 'cursor-pointer ring-2 ring-orange-500 ring-offset-2' : ''}`}
                    >
                        {previewUrl ? (
                            <Image src={previewUrl} alt="avatar" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-amber-100 text-amber-700 flex items-center justify-center text-3xl font-bold uppercase">
                                {fullName.charAt(0) || "U"}
                            </div>
                        )}
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium">Change 📸</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 mb-1">
                        {isEditing ? (
                            <div className="max-w-xs mt-4 sm:mt-0">
                                <label className="text-xs font-semibold text-gray-400 block mb-1 text-left">FULL NAME</label>
                                <input 
                                    type="text" 
                                    value={fullName} 
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-sm focus:outline-orange-500"
                                />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-gray-800">{userProfile.fullName ?? "Unnamed User"}</h1>
                                <p className="text-sm text-gray-500 mt-0.5">{userProfile.email}</p>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        {isEditing ? (
                            <>
                                <button 
                                    onClick={() => { setIsEditing(false); fetchProfileData(); }}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={submitLoading}
                                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-xl transition shadow-sm w-full sm:w-auto disabled:opacity-50"
                                >
                                    {submitLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition shadow-sm w-full sm:w-auto"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- STATS GRID (Always View-Only) --- */}
            <div className="grid grid-cols-3 gap-4">
                {[{ label: "Posts", value: userProfile.stats?.posts }, { label: "Followers", value: userProfile.stats?.followers }, { label: "Following", value: userProfile.stats?.following }].map((stat, i) => (
                    <div key={i} className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-gray-800">{stat.value ?? 0}</div>
                        <div className="text-xs font-medium text-gray-400 mt-0.5 uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* --- CORE DETAILS SECTION --- */}
            <div className="grid md:grid-cols-3 gap-6">
                
                {/* Left Side: Bio & Addresses */}
                <div className="md:col-span-2 space-y-6">
                    {/* Bio Card */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-base font-semibold text-gray-800 mb-3">About Me</h2>
                        {isEditing ? (
                            <textarea 
                                value={bio} 
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-orange-500"
                                placeholder="Write something about yourself..."
                            />
                        ) : (
                            <p className="text-sm text-gray-600 leading-relaxed">{userProfile.bio || "No bio yet."}</p>
                        )}
                    </div>

                    {/* Address Card */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base font-semibold text-gray-800">Saved Addresses</h2>
                            {isEditing && (
                                <button onClick={addAddressField} className="text-xs font-bold text-orange-600 hover:underline">+ Add Address</button>
                            )}
                        </div>
                        
                        <div className="space-y-3">
                            {addresses.map((address, index) => (
                                <div key={index} className="flex gap-3 items-center">
                                    {isEditing ? (
                                        <>
                                            <input 
                                                type="text" 
                                                value={address} 
                                                onChange={(e) => handleAddressChange(index, e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-orange-500"
                                            />
                                            <button onClick={() => removeAddressField(index)} className="text-red-500 text-sm hover:font-bold">❌</button>
                                        </>
                                    ) : (
                                        <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 items-start w-full">
                                            <span className="text-base">📍</span>
                                            <p className="text-sm text-gray-600">{address}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {!isEditing && addresses.length === 0 && (
                                <p className="text-sm text-gray-400 italic">No addresses saved yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Meta Info */}
                <div className="space-y-6">
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-base font-semibold text-gray-800 border-b pb-2">Information</h2>
                        
                        <div>
                            <span className="text-xs text-gray-400 block font-medium uppercase mb-1">Phone Number</span>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-sm focus:outline-orange-500"
                                />
                            ) : (
                                <span className="text-sm text-gray-700 font-medium">{userProfile.phoneNumber || "Not Provided"}</span>
                            )}
                        </div>
                        
                        <div>
                            <span className="text-xs text-gray-400 block font-medium uppercase">Email (Read Only)</span>
                            <span className="text-sm text-gray-500 font-medium">{userProfile.email}</span>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}