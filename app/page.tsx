"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { removeAuthTokenCookie } from "@/lib/authCookie";
import { Button } from "@/components/ui/button";
import { LogOut, ShoppingBag } from "lucide-react";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    removeAuthTokenCookie();
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand/15 rounded-full blur-[100px] animate-blob" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#818CF8]/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Brand icon */}
        <div className="mx-auto relative w-fit">
          <div className="absolute inset-0 rounded-2xl bg-brand/20 blur-xl animate-pulse" />
          <div className="relative bg-gradient-to-br from-brand to-[#818CF8] rounded-2xl p-4 shadow-lg shadow-brand/25">
            <ShoppingBag className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            LuxeRetail
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! The future of premium online shopping.
          </p>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="h-11 px-8 rounded-xl text-sm font-semibold gap-2 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </main>
  );
}

