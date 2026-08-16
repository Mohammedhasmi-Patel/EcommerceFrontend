"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { WishlistItemCard } from "@/components/wishlist/WishlistItemCard";
import { WishlistItemType } from "@/types/wishlist.type";
import { CartItemType, CartResponse, AddToCartResponse } from "@/types/cart.type";
import { axiosInstance } from "@/config/axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeFromWishlist, fetchWishlist } from "@/redux/features/wishlist/wishlistSlice";
import { Loader2, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/lib/toast";

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isLoading = useAppSelector((state) => state.wishlist.isLoading);
  const error = useAppSelector((state) => state.wishlist.error);
  const user = useAppSelector((state) => state.auth.user);

  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isMovingMap, setIsMovingMap] = useState<Record<string, boolean>>({});

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get<CartResponse>(ENDPOINTS.CART);
      setCartItems(response.data?.data || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCart();
    }, 0);
    if (user) {
      dispatch(fetchWishlist());
    }
    return () => clearTimeout(timer);
  }, [user, dispatch]);

  const handleRemove = async (item: WishlistItemType) => {
    try {
      await dispatch(removeFromWishlist(item.wishlistItemId)).unwrap();
      showSuccess("Removed from Wishlist", `${item.productName} has been removed.`);
    } catch (err: unknown) {
      const errorMessage = typeof err === 'string' ? err : (err instanceof Error ? err.message : "Failed to remove item.");
      showError(errorMessage);
    }
  };

  const handleMoveToCart = async (item: WishlistItemType) => {
    setIsMovingMap((prev) => ({ ...prev, [item.wishlistItemId]: true }));
    try {
      // 1. Add to cart
      const response = await axiosInstance.post<AddToCartResponse>(ENDPOINTS.CART, {
        productId: item.productId,
        quantity: 1,
      });

      // 2. Remove from wishlist
      await dispatch(removeFromWishlist(item.wishlistItemId)).unwrap();

      showSuccess(
        response.data.message || "Moved to Cart",
        `${item.productName} has been added to your cart.`
      );

      // 3. Refresh cart items
      fetchCart();
    } catch (err: unknown) {
      console.error("Move to cart error:", err);
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : "Failed to move item to cart.");
      showError(errorMessage);
    } finally {
      setIsMovingMap((prev) => ({ ...prev, [item.wishlistItemId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header cartCount={cartCount} onCartClick={() => router.push("/cart")} />

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
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Your Wishlist</h1>
          <p className="text-sm text-muted-foreground">
            Manage your saved items or move them to the shopping cart.
          </p>
        </div>

        {/* Content */}
        {isLoading && wishlistItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
            <p className="text-sm text-muted-foreground">Loading wishlist items...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center border border-dashed border-destructive/20 rounded-2xl bg-destructive/5 p-6">
            <h3 className="font-semibold text-lg text-destructive">Failed to Load Wishlist</h3>
            <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
            <Button variant="outline" className="mt-2" onClick={() => dispatch(fetchWishlist())}>
              Retry
            </Button>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[45vh] gap-4 text-center border border-dashed border-border rounded-2xl bg-muted/20 p-8">
            <div className="bg-muted p-5 rounded-full">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Your wishlist is currently empty</h2>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                Save items you like to view them here later.
              </p>
            </div>
            <Button
              className="rounded-xl mt-2 px-6 cursor-pointer bg-brand text-white hover:bg-brand-hover shadow-sm"
              onClick={() => router.push("/")}
            >
              Explore Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            {wishlistItems.map((item) => (
              <WishlistItemCard
                key={item.wishlistItemId}
                item={item}
                onRemove={handleRemove}
                onMoveToCart={handleMoveToCart}
                isMoving={isMovingMap[item.wishlistItemId]}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
