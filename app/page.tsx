"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { CategorySidebar } from "@/components/plp/CategorySidebar";
import { ProductType, ProductsResponse } from "@/types/product.type";
import { CartItemType, CartResponse, AddToCartResponse } from "@/types/cart.type";
import { CategoryType, CategoriesResponse } from "@/types/category.type";
import { axiosInstance } from "@/config/axios";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Loader2, Inbox, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/lib/toast";
import { ENDPOINTS } from "@/constants/endpoints";
import { fetchWishlist } from "@/redux/features/wishlist/wishlistSlice";

export default function Home() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
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
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryPage, setCategoryPage] = useState(1);
  const [totalCategoryPages, setTotalCategoryPages] = useState(1);
  const [categorySearch, setCategorySearch] = useState("");
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get<CartResponse>(ENDPOINTS.CART);
      setCartItems(response.data?.data || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  const fetchCategories = async (pageNum: number, search: string, append = false) => {
    try {
      const response = await axiosInstance.get<CategoriesResponse>("/categories", {
        params: { Page: pageNum, PageSize: 10, Search: search || undefined },
      });
      const items = response.data?.data?.items || [];
      setTotalCategoryPages(response.data?.data?.totalPages || 1);
      if (append) {
        setCategories((prev) => [...prev, ...items]);
      } else {
        setCategories(items);
      }
    } catch (err: unknown) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCart();
      setMounted(true);
    }, 0);
    if (user) {
      dispatch(fetchWishlist());
    }
    return () => clearTimeout(timer);
  }, [user, dispatch]);

  // Fetch categories on search query change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCategoryPage(1);
      fetchCategories(1, categorySearch, false);
    }, 0);
    return () => clearTimeout(timer);
  }, [categorySearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts([]);
    }, 0);
    return () => clearTimeout(timer);
  }, [debouncedSearch, selectedCategory]);

  useEffect(() => {
    const loadProducts = async () => {
      if (page === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);
      try {
        const response = await axiosInstance.get<ProductsResponse>("/products", {
          params: {
            SearchQuery: debouncedSearch,
            PageNumber: page,
            PageSize: 8,
            Category: selectedCategory || undefined,
          },
        });
        const items = response.data?.data?.items || [];
        setTotalPages(response.data?.data?.totalPages || 1);
        if (page === 1) setProducts(items);
        else setProducts((prev) => [...prev, ...items]);
      } catch (err: unknown) {
        console.error("Fetch products error:", err);
        const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : "Failed to load products.");
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };
    loadProducts();
  }, [debouncedSearch, page, selectedCategory]);

  useEffect(() => {
    const target = observerRef.current;
    if (!target || isLoading || isLoadingMore || page >= totalPages) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      },
      { threshold: 0.1 }
    );
    observer.observe(target);
    return () => observer.unobserve(target);
  }, [isLoading, isLoadingMore, page, totalPages]);

  const handleAddToCart = async (product: ProductType) => {
    try {
      const response = await axiosInstance.post<AddToCartResponse>(ENDPOINTS.CART, {
        productId: product.id,
        quantity: 1,
      });
      showSuccess(response.data.message || "Added to cart", `${product.name} has been added.`);
      fetchCart();
    } catch (err: unknown) {
      console.error("Add to cart error:", err);
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : "Failed to add item to cart.");
      showError(errorMessage);
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

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 items-start">
        {/* Category Filter Sidebar / Mobile Dropdown */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => {
            setSelectedCategory(slug);
            setPage(1);
          }}
          onSearchCategories={setCategorySearch}
          onLoadMoreCategories={() => {
            const nextPage = categoryPage + 1;
            setCategoryPage(nextPage);
            fetchCategories(nextPage, categorySearch, true);
          }}
          hasNextCategories={categoryPage < totalCategoryPages}
        />

        {/* Product Catalog Content Area */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-b border-border/20 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back{mounted && user?.firstName ? `, ${user.firstName}` : ""}!
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore our curated catalog of premium products.
            </p>
          </div>

          {isLoading && page === 1 ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh] gap-3">
              <Loader2 className="w-8 h-8 text-brand animate-spin" />
              <p className="text-sm text-muted-foreground">Fetching products...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 border border-dashed border-destructive/20 rounded-2xl bg-destructive/5 p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <h3 className="font-semibold text-lg text-destructive">Error Loading Products</h3>
              <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
              <Button variant="outline" className="mt-2" onClick={() => setPage(1)}>
                Retry
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 border border-dashed border-border rounded-2xl bg-muted/20 p-6 text-center animate-in fade-in duration-300">
              <Inbox className="w-8 h-8 text-muted-foreground" />
              <h3 className="font-semibold text-lg text-foreground">No Products Found</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                We couldn&apos;t find any products in this category.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {(page < totalPages || isLoadingMore) && (
                <div ref={observerRef} className="flex justify-center py-6 mt-4">
                  <Loader2 className="w-6 h-6 text-brand animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
