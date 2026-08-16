"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AddressManagement } from "@/components/profile/AddressManagement";
import { logout } from "@/redux/features/auth/authSlice";
import { axiosInstance } from "@/config/axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { CartResponse } from "@/types/cart.type";
import { Loader2 } from "lucide-react";
import { RootState } from "@/redux/store";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<"info" | "address">("info");
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Sync cart count
  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get<CartResponse>(ENDPOINTS.CART);
      const items = response.data?.data || [];
      setCartCount(items.reduce((total, item) => total + item.quantity, 0));
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCart();
      // Load active tab from URL query params
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "info" || tab === "address") {
        setActiveTab(tab);
      }
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: "info" | "address") => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header cartCount={cartCount} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Profile</h1>
            <p className="text-muted-foreground text-sm mt-1">
              View and manage your personal account settings, credentials, and shipping addresses.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start mt-2">
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onLogout={handleLogout}
            />

            {activeTab === "info" ? (
              <ProfileForm user={user} />
            ) : (
              <AddressManagement />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
