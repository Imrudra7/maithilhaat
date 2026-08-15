"use client";

import {
    CheckCircle2,
    MapPin,
    CreditCard,
    Truck,
    ChevronRight,
    Plus,
    Loader2,
    PackageCheck,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // App router के लिए सही इम्पोर्ट
import { CartResponse } from "@/types/cart";
import { cartService } from "@/lib/services/cart-service";
import { userService } from "@/lib/services/user-service";
import { paymentService } from "@/lib/services/payment-service";
import { orderService } from "@/lib/services/order-service";
import { openRazorpay } from "@/lib/payment/razorpay";
import { notify } from "@/lib/notify";

export default function CheckoutPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Address, 2: Payment
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // --- प्रोफाइल और एड्रेस स्टेट्स ---
    const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    
    // केवल दो पेमेंट मोड: RAZORPAY या COD
    const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");

    // नया एड्रेस इनपुट स्टेट्स (बैकेंड स्ट्रक्चर के अनुसार)
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");

    useEffect(() => {
        const loadCheckoutData = async () => {
            setLoading(true);
            try {
                const [cartResponse, userProfile] = await Promise.all([
                    cartService.getCart(),
                    userService.getUserProfile()
                ]);

                setCart(cartResponse);
                
                if (userProfile) {
                    setFullName(userProfile.fullName || "");
                    setPhoneNumber(userProfile.phoneNumber || "");
                    
                    if (userProfile.addresses && userProfile.addresses.length > 0) {
                        setSavedAddresses(userProfile.addresses);
                        setSelectedAddress(userProfile.addresses[0]);
                    } else {
                        setShowNewAddressForm(true);
                    }
                }
            } catch (error) {
                console.error("Error loading checkout data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCheckoutData();
    }, []);

    // --- प्रोफाइल में नया पता जोड़ने का हैंडलर ---
    const handleAddNewAddress = async () => {
        if (!streetAddress || !city || !pincode) {
            notify.warning("Address incomplete", {
                description: "Please fill street address, city and pincode before saving.",
            });
            return;
        }

        setSubmitLoading(true);
        // बैकेंड पर `List<String>` में स्टोर करने के लिए स्ट्रिंग कॉम्बिनेशन बनाएँ
        const formattedAddress = `${streetAddress}, ${city} - ${pincode}`;
        const updatedAddressesList = [...savedAddresses, formattedAddress];

        try {
            await userService.updateUserProfile({
                fullName,
                email: "",
                phoneNumber,
                addresses: updatedAddressesList
            });

            setSavedAddresses(updatedAddressesList);
            setSelectedAddress(formattedAddress);
            setShowNewAddressForm(false);
            notify.success("Address saved", {
                description: "Your delivery address is ready for this order.",
            });
        } catch (error) {
            console.error("Failed to save address to profile:", error);
            notify.error("Address could not be saved", {
                description: "Please check your details and try again.",
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    // --- आर्डर सबमिट और पेमेंट प्रोसेस करने का मुख्य फंक्शन ---
    const handlePlaceOrder = async () => {
        setSubmitLoading(true);
        try {
            let orderAddressPayload;

            if (showNewAddressForm || savedAddresses.length === 0) {
                // अगर नया एड्रेस फॉर्म खुला है तो डायरेक्ट इनपुट्स उठाओ
                orderAddressPayload = {
                    fullName,
                    phoneNumber,
                    addressLine1: streetAddress,
                    city,
                    state: "Bihar", // डिफ़ॉल्ट या इनपुट से
                    country: "India",
                    postalCode: pincode
                };
            } else {
                // अगर सेव किया हुआ एड्रेस स्ट्रिंग चुना है, तो उसे तोड़कर (Parse) ऑब्जेक्ट में बदलें
                const parts = selectedAddress.split(", ");
                const cityWithPincode = parts[parts.length - 1] || "";
                const parsedCity = cityWithPincode.split(" - ")[0] || city || "Unknown";
                const parsedPincode = cityWithPincode.split(" - ")[1] || pincode || "000000";

                orderAddressPayload = {
                    fullName: fullName || "User",
                    phoneNumber: phoneNumber || "0000000000",
                    addressLine1: selectedAddress,
                    city: parsedCity,
                    state: "Bihar",
                    country: "India",
                    postalCode: parsedPincode
                };
            }
            const orderKey = crypto.randomUUID();
            // 1. आर्डर क्रिएट करें (Status: PENDING_PAYMENT)
            const order = await orderService.placeOrder(orderAddressPayload, orderKey);

            const paymentKey = crypto.randomUUID();
            // 2. पेमेंट मेथड के हिसाब से एक्शन लें
            if (paymentMethod === "RAZORPAY") {
                // ऑनलाइन गेटवे ट्रांजेक्शन बनाएँ
                const payment = await paymentService.createPayment({
                    orderId: order.orderId
                }, paymentKey);

                // रेज़रपे पॉपअप खोलें
                await openRazorpay(payment, () => {
                    router.push(`/orders/${order.orderId}`);
                });
            } else {
                // Cash on Delivery (COD) फ्लो
                // अगर बैकेंड केवल ऑर्डर आईडी चाहता है तो उसी रूप में कॉल करें
                await paymentService.createPayment({
                    orderId: order.orderId
                }, paymentKey);
                
                notify.success("Order placed", {
                    description: "Cash on Delivery order has been created successfully.",
                });
                router.push(`/orders/${order.orderId}`);
            }

        } catch (error) {
            console.error("Error processing order:", error);
            notify.error("Order could not be placed", {
                description: "Please try again. If payment was deducted, check your orders in a moment.",
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    // गणना (Calculation Constants)
    const itemsCount = cart?.items?.length ?? 0;
    const subtotal = Number(cart?.itemTotalAmount ?? 0);
    const discountedSubtotal = Number(cart?.discountedItemTotalAmount ?? 0);
    const handlingFee = Number(cart?.handlingFee ?? 0);
    const deliveryFee = Number(cart?.deliveryPartnerFee ?? 0);
    const platformFee = Number(cart?.platformFee ?? 0);
    const totalPayable = Number(cart?.toPay ?? 0);
    const savings = subtotal - discountedSubtotal;

    if (loading) {
        return (
            <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
                <div className="mh-fade-up flex items-center gap-3 rounded-3xl border border-amber-100 bg-white p-5 text-sm font-black text-amber-800 shadow-sm">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Preparing checkout...
                </div>
            </div>
        );
    }

    return (
        <main className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(90,52,36,0.16),rgba(239,225,197,0.82)_28%,rgba(231,247,240,0.6)_76%,rgba(90,52,36,0.12)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center opacity-95" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(67,37,23,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <div className="absolute -left-20 top-24 -z-10 h-56 w-56 rounded-full border border-primary/10" />
            <div className="absolute -right-24 top-[460px] -z-10 h-72 w-72 rounded-full border border-emerald-700/10" />

        <div className="mh-fade-up container mx-auto max-w-6xl px-3 py-6 sm:px-4 md:py-10">
            <section className="relative mb-6 overflow-hidden rounded-[1.5rem] border border-white/55 bg-[#2b1710]/88 p-5 text-white shadow-[0_32px_100px_-55px_rgba(43,23,16,0.9)] backdrop-blur-xl sm:rounded-[2rem] md:p-7">
                <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,232,194,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,232,194,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-amber-100 backdrop-blur-xl">
                            <Sparkles className="h-3.5 w-3.5" />
                            Secure Maithil checkout
                        </p>
                        <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">Order ko final rang dijiye</h1>
                        <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-stone-300">
                            Address, payment aur order summary ek clean flow me, taaki handmade pieces safely ghar tak pahunch sakein.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {[
                            { label: "Address", Icon: MapPin, done: step >= 1 },
                            { label: "Payment", Icon: CreditCard, done: step >= 2 },
                            { label: "Review", Icon: PackageCheck, done: true },
                        ].map((item) => (
                            <div key={item.label} className="mh-card-hover rounded-2xl border border-white/15 bg-white/14 p-3 text-center backdrop-blur-xl">
                                <item.Icon className={`mx-auto h-4 w-4 ${item.done ? "text-amber-200" : "text-stone-300"}`} />
                                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-stone-200">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                {/* LEFT: Checkout Steps */}
                <div className="flex-1 space-y-8">

                    {/* STEP 1: Shipping Address */}
                    <section className={`mh-card-hover mh-tab-option relative overflow-hidden rounded-[1.5rem] border p-4 shadow-[0_24px_80px_-52px_rgba(69,32,15,0.72)] backdrop-blur-2xl transition-all sm:p-6 ${step === 1 ? "border-primary/35 bg-[#fff8e7]/76" : "border-white/55 bg-[#fff8e7]/42 opacity-75"}`} data-active={step === 1}>
                        <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-80" />
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-black shadow-sm ${step >= 1 ? "bg-primary text-white" : "bg-stone-200 text-stone-500"}`}>
                                    1
                                </div>
                                <h2 className="flex min-w-0 items-center gap-2 text-lg font-black tracking-tight text-[#25140d] sm:text-xl">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span className="truncate">Shipping Address</span>
                                </h2>
                            </div>
                            {step > 1 && (
                                <Button variant="ghost" onClick={() => setStep(1)} className="mh-press text-amber-700 font-bold">
                                    Edit
                                </Button>
                            )}
                        </div>

                        {step === 1 && (
                            <div className="space-y-6">
                                {/* सेव्ड एड्रेस लिस्ट */}
                                {!showNewAddressForm && savedAddresses.length > 0 && (
                                    <div className="space-y-3">
                                        <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="grid gap-3">
                                            {savedAddresses.map((addr, idx) => (
                                                <Label key={idx} className={`mh-card-hover mh-tab-option flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all hover:border-primary/40 ${selectedAddress === addr ? "border-primary/40 bg-[linear-gradient(135deg,rgba(255,248,231,0.9),rgba(236,253,245,0.62))] shadow-sm" : "border-white/60 bg-white/48"}`} data-active={selectedAddress === addr}>
                                                    <RadioGroupItem value={addr} className="mt-0.5" />
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-sm text-slate-800">Address #{idx + 1}</span>
                                                        <span className="text-sm font-medium text-slate-600 leading-relaxed">{addr}</span>
                                                    </div>
                                                </Label>
                                            ))}
                                        </RadioGroup>

                                        <Button variant="outline" onClick={() => setShowNewAddressForm(true)} className="mh-press w-full h-12 border-dashed border-2 border-primary/20 bg-white/52 hover:border-primary rounded-xl text-slate-600 font-bold flex items-center justify-center gap-2">
                                            <Plus className="h-4 w-4" /> Add New Address
                                        </Button>

                                        <Button onClick={() => setStep(2)} className="mh-press mh-shine w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg mt-4" disabled={!selectedAddress}>
                                            Deliver to Selected Address
                                        </Button>
                                    </div>
                                )}

                                {/* नया एड्रेस फॉर्म */}
                                {(showNewAddressForm || savedAddresses.length === 0) && (
                                    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-white/60 bg-white/48 p-4 shadow-sm backdrop-blur-xl sm:p-5 md:grid-cols-2">
                                        <h3 className="md:col-span-2 font-bold text-sm text-slate-700 uppercase tracking-wider mb-2">Create New Address</h3>
                                        
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase text-slate-500">Contact Name</Label>
                                            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter full name" className="rounded-xl h-12 bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase text-slate-500">Mobile Number</Label>
                                            <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="10-digit number" className="rounded-xl h-12 bg-white" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label className="font-bold text-xs uppercase text-slate-500">Street Address / Landmark</Label>
                                            <Input value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="House No, Flat, Area" className="rounded-xl h-12 bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase text-slate-500">City</Label>
                                            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City name" className="rounded-xl h-12 bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase text-slate-500">Pincode</Label>
                                            <Input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit code" className="rounded-xl h-12 bg-white" />
                                        </div>

                                        <div className="mt-4 flex flex-col gap-3 md:col-span-2 sm:flex-row">
                                            {savedAddresses.length > 0 && (
                                                <Button variant="outline" onClick={() => setShowNewAddressForm(false)} className="mh-press h-12 rounded-xl font-bold flex-1">Cancel</Button>
                                            )}
                                            <Button onClick={handleAddNewAddress} disabled={submitLoading} className="mh-press mh-shine h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex-[2]">
                                                {submitLoading ? "Saving Address..." : "Save and Select Address"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* STEP 2: Payment Method */}
                    <section className={`mh-card-hover mh-tab-option relative overflow-hidden rounded-[1.5rem] border p-4 shadow-[0_24px_80px_-52px_rgba(69,32,15,0.72)] backdrop-blur-2xl transition-all sm:p-6 ${step === 2 ? "border-primary/35 bg-[#fff8e7]/76" : "border-white/55 bg-[#fff8e7]/42 opacity-75"}`} data-active={step === 2}>
                        <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-80" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-black shadow-sm ${step === 2 ? "bg-primary text-white" : "bg-stone-200 text-stone-500"}`}>2</div>
                            <h2 className="text-xl font-black tracking-tight text-[#25140d]">Payment Method</h2>
                        </div>

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="p-4 bg-white/52 border border-white/60 rounded-2xl mb-2 shadow-sm backdrop-blur-xl">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Delivering to:</span>
                                    <span className="text-sm font-medium text-slate-700 mt-1 block">{selectedAddress || `${streetAddress}, ${city}`}</span>
                                </div>

                                <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as "RAZORPAY" | "COD")} className="grid gap-4">
                                    {/* ऑनलाइन पेमेंट ऑप्शन */}
                                    <Label className={`mh-card-hover mh-tab-option flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition-all hover:border-primary/40 ${paymentMethod === "RAZORPAY" ? "border-primary/40 bg-[linear-gradient(135deg,rgba(255,248,231,0.92),rgba(236,253,245,0.55))]" : "border-white/60 bg-white/48"}`} data-active={paymentMethod === "RAZORPAY"}>
                                        <div className="flex min-w-0 items-center gap-3">
                                            <RadioGroupItem value="RAZORPAY" id="razorpay" />
                                            <div>
                                                <span className="font-bold block text-sm">Online Payment</span>
                                                <span className="text-xs text-gray-400 block mt-0.5">Cards, UPI, Netbanking, Wallets</span>
                                            </div>
                                        </div>
                                        <CreditCard className="h-5 w-5 text-primary" />
                                    </Label>

                                    {/* COD ऑप्शन */}
                                    <Label className={`mh-card-hover mh-tab-option flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition-all hover:border-primary/40 ${paymentMethod === "COD" ? "border-primary/40 bg-[linear-gradient(135deg,rgba(255,248,231,0.92),rgba(255,251,235,0.62))]" : "border-white/60 bg-white/48"}`} data-active={paymentMethod === "COD"}>
                                        <div className="flex min-w-0 items-center gap-3">
                                            <RadioGroupItem value="COD" id="cod" />
                                            <div>
                                                <span className="font-bold block text-sm">Cash on Delivery (COD)</span>
                                                <span className="text-xs text-gray-400 block mt-0.5">Pay with cash upon delivery</span>
                                            </div>
                                        </div>
                                        <Truck className="h-5 w-5 text-slate-600" />
                                    </Label>
                                </RadioGroup>

                                <Button 
                                    onClick={handlePlaceOrder}
                                    disabled={submitLoading}
                                    className="mh-press mh-shine w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
                                >
                                    <ChevronRight className="h-5 w-5 mr-2" />
                                    {submitLoading ? "Processing Order..." : paymentMethod === "RAZORPAY" ? "Pay & Place Order" : "Confirm COD Order"}
                                </Button>
                            </div>
                        )}
                    </section>
                </div>

                {/* RIGHT: Order Summary */}
                <aside className="h-fit w-full lg:sticky lg:top-28 lg:w-[22rem]">
                    <div className="mh-fade-up-delay-1 relative overflow-hidden rounded-[1.5rem] border border-white/60 bg-[#fff8e7]/70 p-5 shadow-[0_24px_80px_-52px_rgba(69,32,15,0.78)] backdrop-blur-2xl sm:p-6">
                        <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
                        <h3 className="font-black text-lg tracking-tight flex items-center gap-2 text-[#25140d]">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>Order Details</span>
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Items ({itemsCount})</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-green-600">
                                <span>Savings</span>
                                <span>- ₹{savings.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Handling Fee</span>
                                <span>₹{handlingFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Delivery Fee</span>
                                <span>₹{deliveryFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Platform Fee</span>
                                <span>₹{platformFee.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-xl font-black pt-2 text-[#25140d]">
                                <span>Payable</span>
                                <span>₹{totalPayable.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="mt-5 rounded-2xl border border-primary/10 bg-white/52 p-4">
                            <p className="flex items-center gap-2 text-sm font-black text-[#25140d]">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Safe checkout
                            </p>
                            <p className="mt-2 text-xs font-semibold leading-5 text-stone-600">
                                Payment, address and order details are checked before placing your MaithilHaat order.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
        </main>
    );
}
