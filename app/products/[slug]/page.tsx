"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductDetailResponse, ProductDetailType } from "@/types/productDetail.type";
import { CartItemType, CartResponse, AddToCartResponse } from "@/types/cart.type";
import { axiosInstance } from "@/config/axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToWishlist, removeFromWishlist } from "@/redux/features/wishlist/wishlistSlice";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const wishlistItem = product ? wishlistItems.find((item) => item.productId === product.id) : null;
  const isWishlisted = !!wishlistItem;

  const handleWishlistToggle = async () => {
    if (!product) return;
    try {
      if (isWishlisted && wishlistItem) {
        await dispatch(removeFromWishlist(wishlistItem.wishlistItemId)).unwrap();
        showSuccess("Removed from Wishlist", `${product.name} removed successfully.`);
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
        showSuccess("Added to Wishlist", `${product.name} added successfully.`);
      }
    } catch (err: unknown) {
      const errorMessage = typeof err === 'string' ? err : (err instanceof Error ? err.message : "Failed to update wishlist.");
      showError(errorMessage);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const fetchCart = useCallback(async () => {
    try {
      const response = await axiosInstance.get<CartResponse>(ENDPOINTS.CART);
      setCartItems(response.data?.data || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  }, []);

  const fetchProductDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<ProductDetailResponse>(`/products/${slug}`);
      setProduct(response.data?.data || null);
    } catch (err: unknown) {
      console.error("Fetch product detail error:", err);
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : "Failed to load product details.");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCart();
      fetchProductDetail();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCart, fetchProductDetail]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      const response = await axiosInstance.post<AddToCartResponse>(ENDPOINTS.CART, {
        productId: product.id,
        quantity: quantity,
      });
      showSuccess(
        response.data.message || "Added to cart",
        `${quantity}x ${product.name} added to cart successfully.`
      );
      fetchCart();
    } catch (err: unknown) {
      console.error("Add to cart error:", err);
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : "Failed to add product to cart.");
      showError(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        cartCount={cartCount}
        onCartClick={() => router.push("/cart")}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Back Link */}
        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="rounded-xl gap-2 cursor-pointer text-muted-foreground hover:text-foreground pl-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Button>
        </div>

        {/* Dynamic Display Grid */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
            <p className="text-sm text-muted-foreground">Fetching product details...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3 border border-dashed border-destructive/20 rounded-2xl bg-destructive/5 p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <h3 className="font-semibold text-lg text-destructive">Failed to Load Product</h3>
            <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
            <Button variant="outline" className="mt-2 cursor-pointer" onClick={fetchProductDetail}>
              Retry
            </Button>
          </div>
        ) : !product ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3 border border-dashed border-border rounded-2xl bg-muted/20 p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-muted-foreground" />
            <h3 className="font-semibold text-lg text-foreground">Product Not Found</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              We couldn&apos;t locate the requested product details.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start mt-2">
            {/* Left Column: Media Gallery */}
            <div className="w-full">
              <ProductGallery media={product.media} name={product.name} />
            </div>

            {/* Right Column: Info & Details Panel */}
            <div className="w-full">
              <ProductInfo
                name={product.name}
                description={product.description}
                originalPrice={product.originalPrice}
                sellPrice={product.sellPrice}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                isAddingToCart={isAddingToCart}
                isWishlisted={isWishlisted}
                onWishlistToggle={handleWishlistToggle}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
