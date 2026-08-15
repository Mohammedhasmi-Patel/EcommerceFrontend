"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductType } from "@/types/product.type";
import { CartItemType } from "@/types/cart.type";
import { axiosInstance } from "@/config/axios";
import { useAppSelector } from "@/redux/hooks";
import { Loader2, Inbox, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/lib/toast";
import { ENDPOINTS } from "@/constants/endpoints";

export default function Home() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch Cart Items from backend
  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get<any>(ENDPOINTS.CART);
      const resData = response.data;
      setCartItems(resData?.data || []);
    } catch (err: any) {
      console.error("Fetch cart error:", err);
    }
  };

  // Fetch cart on initial mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Debounce search query to prevent excessive API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Clear current items on search change to prevent flashing outdated results
  useEffect(() => {
    setProducts([]);
  }, [debouncedSearch]);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const response = await axiosInstance.get<any>("/products", {
          params: {
            SearchQuery: debouncedSearch,
            PageNumber: page,
            PageSize: 8,
          },
        });

        const resData = response.data;
        const data = resData?.data;
        const items = data?.items || [];
        setTotalPages(data?.totalPages || 1);

        if (page === 1) {
          setProducts(items);
        } else {
          setProducts((prev) => [...prev, ...items]);
        }
      } catch (err: any) {
        console.error("Fetch products error:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load products.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    loadProducts();
  }, [debouncedSearch, page]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const target = observerRef.current;
    if (!target || isLoading || isLoadingMore || page >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [isLoading, isLoadingMore, page, totalPages]);

  const handleAddToCart = async (product: ProductType) => {
    try {
      const response = await axiosInstance.post<any>(ENDPOINTS.CART, {
        productId: product.id,
        quantity: 1,
      });
      showSuccess(response.data.message || "Added to cart", `${product.name} has been added.`);
      // Refresh cart to sync totals
      fetchCart();
    } catch (err: any) {
      console.error("Add to cart error:", err);
      showError(err?.response?.data?.message || err?.message || "Failed to add item to cart.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        onCartClick={() => router.push("/cart")}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore our curated catalog of premium products.
          </p>
        </div>

        {/* Content Area */}
        {isLoading && page === 1 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
            <p className="text-sm text-muted-foreground">Fetching products...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh] gap-3 border border-dashed border-destructive/20 rounded-2xl bg-destructive/5 p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <h3 className="font-semibold text-lg text-destructive">Error Loading Products</h3>
            <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
            <Button variant="outline" className="mt-2" onClick={() => setPage(1)}>
              Retry
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh] gap-3 border border-dashed border-border rounded-2xl bg-muted/20 p-6 text-center">
            <Inbox className="w-8 h-8 text-muted-foreground" />
            <h3 className="font-semibold text-lg text-foreground">No Products Found</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              We couldn&apos;t find any products matching &quot;{searchQuery}&quot;.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 flex-1">
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Infinite Scroll Loader Target */}
            {(page < totalPages || isLoadingMore) && (
              <div ref={observerRef} className="flex justify-center py-6 mt-4">
                <Loader2 className="w-6 h-6 text-brand animate-spin" />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
