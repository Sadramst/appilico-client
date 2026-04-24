"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, MapPin, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCartStore } from "@/stores/cart-store";
import { useCreateOrder } from "@/hooks/use-orders";
import { useMyCustomerProfile } from "@/hooks/use-customers";
import { PaymentMethodLabels } from "@/types/order.types";
import { AddressTypeLabels } from "@/types/customer.types";

const steps = [
  { id: 1, title: "Shipping", icon: MapPin },
  { id: 2, title: "Payment", icon: CreditCard },
  { id: 3, title: "Review", icon: Check },
];

export function CheckoutForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const { items, total, clearCart } = useCartStore();
  const createOrder = useCreateOrder();
  const { data: customerData, isLoading: loadingCustomer } = useMyCustomerProfile();
  const addresses = customerData?.data?.addresses ?? [];

  // Auto-select default address
  if (!selectedAddressId && addresses.length > 0) {
    const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
    setSelectedAddressId(defaultAddr.id);
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }
    createOrder.mutate(
      {
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
        paymentMethod,
        notes: "",
      },
      {
        onSuccess: (data) => {
          clearCart();
          toast.success("Order placed successfully!");
          router.push(`/orders/${data.data?.id}`);
        },
      }
    );
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }
    setCurrentStep((s) => Math.min(3, s + 1));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Stepper */}
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Shipping */}
          {currentStep === 1 && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingCustomer ? (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No addresses found. Please add an address to your account first.
                    </p>
                  ) : (
                    <RadioGroup
                      value={selectedAddressId}
                      onValueChange={setSelectedAddressId}
                      className="space-y-3"
                    >
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedAddressId === addr.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                          }`}
                        >
                          <RadioGroupItem value={addr.id} className="mt-1" />
                          <div className="flex-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{addr.title}</span>
                              {addr.isDefault && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                ({AddressTypeLabels[addr.addressType] ?? "Address"})
                              </span>
                            </div>
                            <p className="text-muted-foreground mt-1">
                              {addr.addressLine1}
                              {addr.addressLine2 && `, ${addr.addressLine2}`}
                              <br />
                              {addr.city}, {addr.state} {addr.postalCode}
                              <br />
                              {addr.country}
                            </p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={String(paymentMethod)} onValueChange={(v) => setPaymentMethod(Number(v))} className="space-y-3">
                    {[
                      { value: "0", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex" },
                      { value: "2", label: "PayPal", desc: "Pay with your PayPal account" },
                      { value: "3", label: "Bank Transfer", desc: "Direct bank transfer" },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                          String(paymentMethod) === method.value ? "border-primary bg-primary/5" : "hover:bg-muted"
                        }`}
                      >
                        <RadioGroupItem value={method.value} />
                        <div>
                          <p className="font-medium text-sm">{method.label}</p>
                          <p className="text-xs text-muted-foreground">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Shipping To</h4>
                    {selectedAddress ? (
                      <p className="text-sm">
                        {selectedAddress.title}<br />
                        {selectedAddress.addressLine1}<br />
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}<br />
                        {selectedAddress.country}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No address selected</p>
                    )}
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Payment</h4>
                    <p className="text-sm">{PaymentMethodLabels[paymentMethod] ?? "Unknown"}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Items ({items.length})
                    </h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep < 3 ? (
            <Button onClick={nextStep}>Continue</Button>
          ) : (
            <Button
              onClick={handlePlaceOrder}
              disabled={createOrder.isPending}
              className="gap-2"
            >
              {createOrder.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Place Order
            </Button>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
