"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { cartService } from "@/services/cart-service";
import { useAuthStore } from "@/stores/auth-store";
import type { ICartItem } from "@/types/cart.types";

export function useCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const store = useCartStore();

  const addToCartMutation = useMutation({
    mutationFn: (item: ICartItem) => {
      if (isAuthenticated) {
        return cartService.addItem({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        });
      }
      store.addItem(item);
      return Promise.resolve(null);
    },
    onSuccess: (_data, item) => {
      toast.success(`${item.productName} added to cart`);
      store.openCart();
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
    onError: () => {
      toast.error("Failed to add item to cart");
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (isAuthenticated) {
        return cartService.updateItem(itemId, { quantity });
      }
      store.updateQuantity(itemId, quantity);
      return Promise.resolve(null);
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => {
      if (isAuthenticated) {
        return cartService.removeItem(itemId);
      }
      store.removeItem(itemId);
      return Promise.resolve(null);
    },
    onSuccess: () => {
      toast.success("Item removed from cart");
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => {
      if (isAuthenticated) {
        return cartService.clear();
      }
      store.clearCart();
      return Promise.resolve(null);
    },
    onSuccess: () => {
      toast.success("Cart cleared");
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });

  return {
    items: store.items,
    itemCount: store.itemCount,
    subtotal: store.subtotal,
    discountAmount: store.discountAmount,
    taxAmount: store.taxAmount,
    shippingAmount: store.shippingAmount,
    total: store.total,
    voucherCode: store.voucherCode,
    isOpen: store.isOpen,
    addItem: addToCartMutation.mutate,
    isAdding: addToCartMutation.isPending,
    updateQuantity: updateQuantityMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    toggleCart: store.toggleCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    setVoucher: store.setVoucher,
    removeVoucher: store.removeVoucher,
  };
}
