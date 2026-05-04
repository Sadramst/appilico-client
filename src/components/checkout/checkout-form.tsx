"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, MapPin, Check, Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useMyAddresses, useCreateAddress } from "@/hooks/use-customers";
import { useValidateVoucher } from "@/hooks/use-vouchers";
import { useValidateDiscount } from "@/hooks/use-discounts";
import { PaymentMethodLabels } from "@/types/order.types";
import { AddressTypeLabels, type ICustomerAddress } from "@/types/customer.types";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const steps = [
  { id: 1, title: "Shipping", icon: MapPin },
  { id: 2, title: "Payment", icon: CreditCard },
  { id: 3, title: "Review", icon: Check },
];

type AddressFormData = Omit<ICustomerAddress, "id">;

const emptyAddressForm: AddressFormData = {
  title: "",
  addressLine1: "",
  addressLine2: null,
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
  addressType: 2,
};

function CheckoutFormInner() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [voucherInput, setVoucherInput] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormData>(emptyAddressForm);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { items, total, subtotal, clearCart, setVoucher } = useCart();
  const createOrder = useCreateOrder();
  const { data: addressData, isLoading: loadingAddresses } = useMyAddresses();
  const createAddress = useCreateAddress();
  const validateVoucher = useValidateVoucher();
  const validateDiscount = useValidateDiscount();
  const addresses = addressData?.data ?? [];

  // Auto-select default address
  if (!selectedAddressId && addresses.length > 0) {
    const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
    setSelectedAddressId(defaultAddr.id);
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderResponse = await new Promise<{ id: string; clientSecret?: string }>(
        (resolve, reject) => {
          createOrder.mutate(
            {
              shippingAddressId: selectedAddressId,
              billingAddressId: selectedAddressId,
              paymentMethod,
              notes: "",
            },
            {
              onSuccess: (data) => {
                const orderData = data.data as typeof data.data & { clientSecret?: string };
                resolve({ id: orderData?.id ?? "", clientSecret: orderData?.clientSecret });
              },
              onError: reject,
            }
          );
        }
      );

      // If card payment and Stripe client secret returned, confirm payment
      if (paymentMethod === 0 && orderResponse.clientSecret && stripe && elements) {
        const cardElement = elements.getElement(CardElement);
        if (cardElement) {
          const { error, paymentIntent } = await stripe.confirmCardPayment(
            orderResponse.clientSecret,
            { payment_method: { card: cardElement } }
          );

          if (error) {
            toast.error(error.message ?? "Payment failed. Please try again.");
            setIsPlacingOrder(false);
            return;
          }

          if (paymentIntent?.status === "succeeded") {
            clearCart();
            fireConfetti();
            toast.success("Payment successful! Order placed.");
            router.push(`/orders/${orderResponse.id}?success=1`);
            return;
          }
        }
      }

      // Non-card or no client secret: just navigate
      clearCart();
      fireConfetti();
      toast.success("Order placed successfully!");
      router.push(`/orders/${orderResponse.id}?success=1`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    createAddress.mutate(addressForm, {
      onSuccess: (data) => {
        setAddAddressOpen(false);
        setAddressForm(emptyAddressForm);
        if (data.data) {
          setSelectedAddressId(data.data.id);
        }
      },
    });
  };

  const handleApplyVoucher = () => {
    if (!voucherInput.trim()) return;
    validateVoucher.mutate(
      { code: voucherInput, orderAmount: subtotal },
      {
        onSuccess: (data) => {
          if (data.data?.isValid) {
            setVoucher(voucherInput, data.data.discountAmount ?? 0);
            toast.success("Voucher applied!");
          } else {
            toast.error(data.data?.message ?? "Invalid or expired voucher");
          }
        },
      }
    );
  };

  const handleApplyDiscount = () => {
    if (!discountInput.trim()) return;
    validateDiscount.mutate(
      { code: discountInput, orderAmount: subtotal },
      {
        onSuccess: (data) => {
          if (data.data?.isValid) {
            setVoucher(discountInput, data.data.discountAmount ?? 0);
            toast.success("Discount applied!");
          } else {
            toast.error(data.data?.message ?? "Invalid discount code");
          }
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
    <>
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
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => setAddAddressOpen(true)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add New
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingAddresses ? (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        No addresses found. Add one to continue.
                      </p>
                      <Button size="sm" onClick={() => setAddAddressOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Address
                      </Button>
                    </div>
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
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={String(paymentMethod)}
                    onValueChange={(v) => setPaymentMethod(Number(v))}
                    className="space-y-3"
                  >
                    {[
                      { value: "0", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex" },
                      { value: "2", label: "PayPal", desc: "Pay with your PayPal account" },
                      { value: "3", label: "Bank Transfer", desc: "Direct bank transfer" },
                      { value: "4", label: "Cash on Delivery", desc: "Pay when you receive your order" },
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

                  {/* Stripe Card Element — shown only for card payment */}
                  {paymentMethod === 0 && (
                    <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                      <Label className="text-sm font-medium mb-3 block">Card Details</Label>
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "14px",
                              color: "var(--foreground)",
                              "::placeholder": { color: "var(--muted-foreground)" },
                            },
                            invalid: { color: "var(--destructive)" },
                          },
                        }}
                        className="py-3"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Your payment is secured with 256-bit SSL encryption.
                      </p>
                    </div>
                  )}
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
              disabled={isPlacingOrder || createOrder.isPending}
              className="gap-2"
            >
              {(isPlacingOrder || createOrder.isPending) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Place Order
            </Button>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartSummary />
          {/* Voucher Code */}
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="voucher" className="text-sm font-medium">Voucher Code</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="voucher"
                  placeholder="Enter code"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleApplyVoucher}
                  disabled={validateVoucher.isPending}
                >
                  {validateVoucher.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Discount Code */}
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="discount" className="text-sm font-medium">Discount Code</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="discount"
                  placeholder="Enter discount code"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleApplyDiscount}
                  disabled={validateDiscount.isPending}
                >
                  {validateDiscount.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    {/* Add Address Dialog */}
    <Dialog open={addAddressOpen} onOpenChange={setAddAddressOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="addr-title">Title</Label>
              <Input
                id="addr-title"
                placeholder="e.g. Home, Office"
                value={addressForm.title}
                onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="addr-line1">Address Line 1</Label>
              <Input
                id="addr-line1"
                placeholder="Street address"
                value={addressForm.addressLine1}
                onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="addr-line2">Address Line 2 (Optional)</Label>
              <Input
                id="addr-line2"
                placeholder="Apartment, suite, etc."
                value={addressForm.addressLine2 ?? ""}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, addressLine2: e.target.value || null })
                }
              />
            </div>
            <div>
              <Label htmlFor="addr-city">City</Label>
              <Input
                id="addr-city"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="addr-state">State</Label>
              <Input
                id="addr-state"
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="addr-postal">Postal Code</Label>
              <Input
                id="addr-postal"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="addr-country">Country</Label>
              <Input
                id="addr-country"
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="addr-type">Type</Label>
              <Select
                value={String(addressForm.addressType)}
                onValueChange={(v) => setAddressForm({ ...addressForm, addressType: Number(v) })}
              >
                <SelectTrigger id="addr-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Shipping</SelectItem>
                  <SelectItem value="1">Billing</SelectItem>
                  <SelectItem value="2">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                id="addr-default"
                checked={addressForm.isDefault}
                onCheckedChange={(checked) =>
                  setAddressForm({ ...addressForm, isDefault: checked })
                }
              />
              <Label htmlFor="addr-default">Default</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddAddressOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createAddress.isPending} className="gap-2">
              {createAddress.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Address
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}

export function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormInner />
    </Elements>
  );
}
