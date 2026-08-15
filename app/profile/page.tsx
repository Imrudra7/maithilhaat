'use client';

import Image from "next/image";
import { userService } from "@/lib/services/user-service";
import { UserProfileResponse, UserProfileRequest } from "@/types/user";
import { useEffect, useState, useRef } from "react";
import { CheckCircle2, Heart, Home, Mail, MapPin, Palette, Phone, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { notify } from "@/lib/notify";

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
                //     headers: { 'Content-Type': 'multipart/form-data', "Idempotency-Key": idempotencyKey }
                // });
            }

            // डेटा को रिफ्रेश करें और एडिट मोड बंद करें
            fetchProfileData();
            setIsEditing(false);
            notify.success("Profile updated", {
                description: "Your MaithilHaat account details have been saved.",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            notify.error("Profile update failed", {
                description: "Please review your details and try again.",
            });
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

    const profileHighlights = [
        { label: "Saved Addresses", value: addresses.length, Icon: MapPin },
        { label: "Profile Ready", value: fullName && phoneNumber ? "Good" : "Setup", Icon: CheckCircle2 },
        { label: "Craft Taste", value: "Maithil", Icon: Palette },
    ];

    const preferenceCards = [
        { Icon: Heart, title: "Wishlist taste", copy: "Saved products will help build a personal Maithil mood board." },
        { Icon: ShoppingBag, title: "Faster checkout", copy: "Saved phone and address details reduce friction during purchase." },
        { Icon: Home, title: "Home curation", copy: "Profile preferences can later suggest art, kapra and decor by room." },
    ];

    return (
        <main className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(90,52,36,0.16),rgba(239,225,197,0.8)_28%,rgba(231,247,240,0.58)_76%,rgba(90,52,36,0.12)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center opacity-95" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(67,37,23,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />

        <div className="mh-fade-up max-w-5xl mx-auto p-4 md:p-8 space-y-6">

            {/* Hidden File Input for Avatar */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
            />

            <section className="mh-card-hover relative overflow-hidden rounded-[1.5rem] border border-white/55 bg-[#2b1710]/88 p-5 text-white shadow-[0_32px_100px_-55px_rgba(43,23,16,0.9)] backdrop-blur-xl sm:rounded-[2rem] md:p-8">
                <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,232,194,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,232,194,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-amber-100 backdrop-blur-xl">
                            <Sparkles className="h-3.5 w-3.5" />
                            Collector profile
                        </p>
                        <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">Aapka MaithilHaat account</h1>
                        <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-stone-300">
                            Delivery details, craft taste aur saved identity ek jagah, taaki shopping personal aur smooth lage.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3">
                        {profileHighlights.map((item) => (
                            <div key={item.label} className="mh-card-hover rounded-2xl border border-white/15 bg-white/14 p-3 backdrop-blur-xl">
                                <item.Icon className="h-4 w-4 text-amber-200" />
                                <p className="mt-2 text-lg font-black">{item.value}</p>
                                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-300">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- HEADER BANNER CARD --- */}
            <div className="mh-card-hover relative overflow-hidden rounded-2xl border border-[#fff2d2]/70 bg-[#fff8e7]/66 shadow-sm backdrop-blur-xl">
                <div className="mh-rang-strip h-1.5 w-full" />
                <div className="h-32 bg-[linear-gradient(135deg,rgba(185,28,28,0.72),rgba(245,158,11,0.58),rgba(15,118,110,0.5)),url('/images/maithil-art-gallery-hero.png')] bg-cover bg-center w-full" />

                <div className="-mt-14 flex flex-col items-center gap-5 px-4 pb-6 text-center sm:flex-row sm:items-end sm:px-6 sm:text-left">

                    {/* Avatar Group with Click-to-Upload Indicator */}
                    <div
                        onClick={() => isEditing && fileInputRef.current?.click()}
                        className={`mh-icon-glow relative w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-white group ${isEditing ? 'cursor-pointer ring-2 ring-orange-500 ring-offset-2' : ''}`}
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

                    <div className="mb-1 min-w-0 flex-1">
                        {isEditing ? (
                            <div className="max-w-xs mt-4 sm:mt-0">
                                <label htmlFor="fullName" className="text-xs font-semibold text-gray-400 block mb-1 text-left">FULL NAME</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-sm focus:outline-orange-500"
                                />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-gray-800">{userProfile.fullName ?? "Unnamed User"}</h1>
                                <p className="mt-0.5 break-all text-sm text-gray-500">{userProfile.email}</p>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => { setIsEditing(false); fetchProfileData(); }}
                                    className="mh-press px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={submitLoading}
                                    className="mh-press mh-shine px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-xl transition shadow-sm w-full sm:w-auto disabled:opacity-50"
                                >
                                    {submitLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mh-press mh-shine px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition shadow-sm w-full sm:w-auto"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- STATS GRID (Always View-Only) --- */}
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3 sm:gap-4">
                {profileHighlights.map((stat) => (
                    <div key={stat.label} className="mh-card-hover relative overflow-hidden rounded-2xl border border-[#fff2d2]/70 bg-[#fff8e7]/58 p-4 text-center shadow-sm backdrop-blur-xl">
                        <stat.Icon className="mh-icon-glow mx-auto h-5 w-5 text-primary" />
                        <div className="mt-2 text-2xl font-black text-[#25140d]">{stat.value}</div>
                        <div className="mt-0.5 text-xs font-black uppercase tracking-wider text-stone-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            <section className="mh-scroll-reveal grid gap-4 md:grid-cols-3">
                {preferenceCards.map((card) => (
                    <div key={card.title} className="mh-card-hover relative overflow-hidden rounded-2xl border border-[#fff2d2]/70 bg-[#fff8e7]/58 p-5 shadow-sm backdrop-blur-xl">
                        <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-75" />
                        <card.Icon className="mh-icon-glow h-5 w-5 text-primary" />
                        <h2 className="mt-3 text-base font-black text-[#25140d]">{card.title}</h2>
                        <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{card.copy}</p>
                    </div>
                ))}
            </section>

            {/* --- CORE DETAILS SECTION --- */}
            <div className="grid md:grid-cols-3 gap-6">

                {/* Left Side: Bio & Addresses */}
                <div className="md:col-span-2 space-y-6">
                    {/* Bio Card */}
                    <div className="mh-card-hover p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
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
                    <div className="mh-card-hover p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-base font-semibold text-gray-800">Saved Addresses</h2>
                            {isEditing && (
                                <button onClick={addAddressField} className="mh-press text-xs font-bold text-orange-600 hover:underline">+ Add Address</button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {addresses.map((address, index) => (
                                <div key={index} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => handleAddressChange(index, e.target.value)}
                                                className="w-full flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-orange-500"
                                            />
                                            <button onClick={() => removeAddressField(index)} className="text-left text-sm text-red-500 hover:font-bold sm:text-center">❌</button>
                                        </>
                                    ) : (
                                        <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 items-start w-full">
                                            <span className="text-base">📍</span>
                                            <p className="break-words text-sm text-gray-600">{address}</p>
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
                    <div className="mh-card-hover p-6 bg-white/74 rounded-2xl shadow-sm border border-[#fff2d2]/70 backdrop-blur-xl space-y-4">
                        <h2 className="text-base font-semibold text-gray-800 border-b pb-2">Information</h2>

                        <div>
                            <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase mb-1"><Phone className="h-3.5 w-3.5" /> Phone Number</span>
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
                            <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase"><Mail className="h-3.5 w-3.5" /> Email (Read Only)</span>
                            <span className="break-all text-sm font-medium text-gray-500">{userProfile.email}</span>
                        </div>
                    </div>

                    <div className="mh-card-hover relative overflow-hidden rounded-2xl border border-[#fff2d2]/70 bg-[#2b1710]/86 p-6 text-white shadow-[0_24px_80px_-52px_rgba(43,23,16,0.9)] backdrop-blur-xl">
                        <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-75" />
                        <ShieldCheck className="mh-icon-glow h-6 w-6 text-amber-100" />
                        <h2 className="mt-4 text-lg font-black">Account trust</h2>
                        <p className="mt-2 text-sm font-semibold leading-6 text-stone-300">
                            Verified details and saved addresses help future orders move faster with fewer checkout steps.
                        </p>
                    </div>
                </div>

            </div>
        </div>
        </main>
    );
}
