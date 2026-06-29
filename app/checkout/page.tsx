"use client";

import {
    CheckCircle2,
    MapPin,
    CreditCard,
    Truck,
    ChevronRight,
    Plus,
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
            alert("कृपया पूरा पता भरें!");
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
            alert("नया एड्रेस प्रोफाइल में सेव हो गया है! 🎉");
        } catch (error) {
            console.error("Failed to save address to profile:", error);
            alert("एड्रेस सेव करने में समस्या आई।");
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

            // 1. आर्डर क्रिएट करें (Status: PENDING_PAYMENT)
            const order = await orderService.placeOrder(orderAddressPayload);

            // 2. पेमेंट मेथड के हिसाब से एक्शन लें
            if (paymentMethod === "RAZORPAY") {
                // ऑनलाइन गेटवे ट्रांजेक्शन बनाएँ
                const payment = await paymentService.createPayment({
                    orderId: order.orderId
                });

                // रेज़रपे पॉपअप खोलें
                await openRazorpay(payment, () => {
                    router.push(`/orders/${order.orderId}`);
                });
            } else {
                // Cash on Delivery (COD) फ्लो
                // अगर बैकेंड केवल ऑर्डर आईडी चाहता है तो उसी रूप में कॉल करें
                await paymentService.createPayment({
                    orderId: order.orderId
                });
                
                alert("Order Placed Successfully via Cash on Delivery! 📦");
                router.push(`/orders/${order.orderId}`);
            }

        } catch (error) {
            console.error("Error processing order:", error);
            alert("आर्डर प्लेस करने में विफलता आई। कृपया पुनः प्रयास करें।");
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

    return (
        <div className="container mx-auto px-4 py-10 max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* LEFT: Checkout Steps */}
                <div className="flex-1 space-y-8">

                    {/* STEP 1: Shipping Address */}
                    <section className={`p-6 rounded-3xl border-2 transition-all ${step === 1 ? "border-amber-700 bg-white shadow-xl" : "border-slate-100 opacity-60"}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-amber-700 text-white" : "bg-slate-200"}`}>
                                    1
                                </div>
                                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-amber-700" />
                                    <span>Shipping Address</span>
                                </h2>
                            </div>
                            {step > 1 && (
                                <Button variant="ghost" onClick={() => setStep(1)} className="text-amber-700 font-bold">
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
                                                <Label key={idx} className={`flex items-start gap-3 p-4 border-2 rounded-2xl cursor-pointer hover:border-amber-700/50 transition-all ${selectedAddress === addr ? "border-amber-700 bg-amber-50/20" : "border-slate-100"}`}>
                                                    <RadioGroupItem value={addr} className="mt-0.5" />
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-sm text-slate-800">Address #{idx + 1}</span>
                                                        <span className="text-sm font-medium text-slate-600 leading-relaxed">{addr}</span>
                                                    </div>
                                                </Label>
                                            ))}
                                        </RadioGroup>

                                        <Button variant="outline" onClick={() => setShowNewAddressForm(true)} className="w-full h-12 border-dashed border-2 hover:border-amber-700 rounded-xl text-slate-600 font-bold flex items-center justify-center gap-2">
                                            <Plus className="h-4 w-4" /> Add New Address
                                        </Button>

                                        <Button onClick={() => setStep(2)} className="w-full h-14 bg-amber-700 hover:bg-amber-800 text-white rounded-2xl font-black text-lg mt-4" disabled={!selectedAddress}>
                                            Deliver to Selected Address
                                        </Button>
                                    </div>
                                )}

                                {/* नया एड्रेस फॉर्म */}
                                {(showNewAddressForm || savedAddresses.length === 0) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-5 rounded-2xl bg-slate-50/50">
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

                                        <div className="md:col-span-2 flex gap-3 mt-4">
                                            {savedAddresses.length > 0 && (
                                                <Button variant="outline" onClick={() => setShowNewAddressForm(false)} className="h-12 rounded-xl font-bold flex-1">Cancel</Button>
                                            )}
                                            <Button onClick={handleAddNewAddress} disabled={submitLoading} className="h-12 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold flex-[2]">
                                                {submitLoading ? "Saving Address..." : "Save and Select Address"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* STEP 2: Payment Method */}
                    <section className={`p-6 rounded-3xl border-2 transition-all ${step === 2 ? "border-amber-700 bg-white shadow-xl" : "border-slate-100 opacity-60"}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 2 ? "bg-amber-700 text-white" : "bg-slate-200"}`}>2</div>
                            <h2 className="text-xl font-black tracking-tight">Payment Method</h2>
                        </div>

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="p-4 bg-slate-50 border rounded-2xl mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Delivering to:</span>
                                    <span className="text-sm font-medium text-slate-700 mt-1 block">{selectedAddress || `${streetAddress}, ${city}`}</span>
                                </div>

                                <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as "RAZORPAY" | "COD")} className="grid gap-4">
                                    {/* ऑनलाइन पेमेंट ऑप्शन */}
                                    <Label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer hover:border-amber-700 transition-all ${paymentMethod === "RAZORPAY" ? "border-amber-700 bg-amber-50/10" : "border-slate-100"}`}>
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="RAZORPAY" id="razorpay" />
                                            <div>
                                                <span className="font-bold block text-sm">Online Payment</span>
                                                <span className="text-xs text-gray-400 block mt-0.5">Cards, UPI, Netbanking, Wallets</span>
                                            </div>
                                        </div>
                                        <CreditCard className="h-5 w-5 text-amber-700" />
                                    </Label>

                                    {/* COD ऑप्शन */}
                                    <Label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer hover:border-amber-700 transition-all ${paymentMethod === "COD" ? "border-amber-700 bg-amber-50/10" : "border-slate-100"}`}>
                                        <div className="flex items-center gap-3">
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
                                    className="w-full h-14 bg-amber-700 hover:bg-amber-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-amber-700/20"
                                >
                                    <ChevronRight className="h-5 w-5 mr-2" />
                                    {submitLoading ? "Processing Order..." : paymentMethod === "RAZORPAY" ? "Pay & Place Order" : "Confirm COD Order"}
                                </Button>
                            </div>
                        )}
                    </section>
                </div>

                {/* RIGHT: Order Summary */}
                <aside className="w-full lg:w-80 h-fit sticky top-28">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                        <h3 className="font-black text-lg tracking-tight flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
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
                            <div className="flex justify-between text-xl font-black pt-2">
                                <span>Payable</span>
                                <span>₹{totalPayable.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}