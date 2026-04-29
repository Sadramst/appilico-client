"use client";

import { useState } from "react";
import { Ticket, X, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useValidateVoucher } from "@/hooks/use-vouchers";
import { formatPrice } from "@/lib/utils";

export function CartSummary() {
  const {
    subtotal,
    discountAmount,
    taxAmount,
    shippingAmount,
    total,
    voucherCode,
    setVoucher,
    removeVoucher,
  } = useCart();

  const [code, setCode] = useState("");
  const validateVoucher = useValidateVoucher();

  const handleApplyVoucher = () => {
    if (!code.trim()) return;
    validateVoucher.mutate(
      { code: code.trim(), orderAmount: subtotal },
      {
        onSuccess: (data) => {
          if (data.data) {
            setVoucher(code.trim(), data.data.discountAmount);
            setCode("");
          }
        },
      }
    );
  };

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <h3 className="font-semibold text-lg">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span className="flex items-center gap-1">
              Discount
              {voucherCode && (
                <Badge variant="secondary" className="text-xs gap-1">
                  {voucherCode}
                  <button onClick={removeVoucher} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shippingAmount === 0 ? "Free" : formatPrice(shippingAmount)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatPrice(taxAmount)}</span>
        </div>

        <div className="border-t pt-3 flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Voucher Code */}
      {!voucherCode && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Voucher code"
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleApplyVoucher}
              disabled={!code.trim() || validateVoucher.isPending}
            >
              {validateVoucher.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        </div>
      )}

      {shippingAmount > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Add {formatPrice(50 - subtotal)} more for free shipping!
        </p>
      )}
    </div>
  );
}
