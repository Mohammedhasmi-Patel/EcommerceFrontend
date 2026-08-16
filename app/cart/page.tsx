"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { CartSummary } from "@/components/cart/CartSummary";
import { CartItemType, CartResponse, AddToCartResponse } from "@/types/cart.type";
import { axiosInstance } from "@/config/axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError, showInfo } from "@/lib/toast";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const fetchCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<CartResponse>(ENDPOINTS.CART);
      const resData = response.data;
      setCartItems(resData?.data || []);
    } catch (err: unknown) {
      console.error("Fetch cart error:", err);
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : "Failed to load cart.");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCart();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleIncrement = async (item: CartItemType) => {
    try {
      const response = await axiosInstance.post<AddToCartResponse>(ENDPOINTS.CART, {
        productId: item.productId,
        quantity: 1,
      });
      showSuccess(response.data.message || "Quantity increased");

      // Re-fetch cart from database to synchronize
      const updatedResponse = await axiosInstance.get<CartResponse>(ENDPOINTS.CART);
      setCartItems(updatedResponse.data?.data || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : "Failed to update quantity.");
      showError(errorMessage);
    }
  };

  const handleDecrement = (item: CartItemType) => {
    if (item.quantity <= 1) {
      handleRemove(item);
      return;
    }
    showInfo("Backend decrement is coming soon!", "Please use the delete button to remove items.");
  };

  const handleRemove = async (item: CartItemType) => {
    try {
      const response = await axiosInstance.delete<{ message?: string }>(ENDPOINTS.CART, {
        params: { cartItemId: item.cartItemId },
      });
      showSuccess(response.data.message || "Cart item deleted successfully");

      // Refresh cart list from backend database
      const updatedResponse = await axiosInstance.get<CartResponse>(ENDPOINTS.CART);
      setCartItems(updatedResponse.data?.data || []);
    } catch (err: unknown) {
      console.error("Remove cart item error:", err);
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : "Failed to delete cart item.");
      showError(errorMessage);
    }
  };

  const handleCheckout = () => {
    showSuccess("Checkout Initiated", "Redirecting to payment gateway...");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        cartCount={cartCount}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="rounded-xl flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shopping
          </Button>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Your Cart</h1>
          <p className="text-sm text-muted-foreground">
            Review your items before proceeding to checkout.
          </p>
        </div>

        {/* Loader or Content */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
            <p className="text-sm text-muted-foreground">Loading cart items...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center border border-dashed border-destructive/20 rounded-2xl bg-destructive/5 p-6">
            <h3 className="font-semibold text-lg text-destructive">Failed to Load Cart</h3>
            <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
            <Button variant="outline" className="mt-2" onClick={fetchCart}>
              Retry
            </Button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[45vh] gap-4 text-center border border-dashed border-border rounded-2xl bg-muted/20 p-8">
            <div className="bg-muted p-5 rounded-full">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Your cart is currently empty</h2>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                Before you check out, you must add some products to your shopping cart.
              </p>
            </div>
            <Button className="rounded-xl mt-2 px-6 cursor-pointer bg-brand text-white hover:bg-brand-hover shadow-sm" onClick={() => router.push("/")}>
              Explore Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.cartItemId}
                  item={item}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary subtotal={subtotal} onCheckout={handleCheckout} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
