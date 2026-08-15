"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { removeAuthTokenCookie } from "@/lib/authCookie";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, LogOut, User, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount?: number;
  onCartClick?: () => void;
}

export const Header = ({ searchQuery, onSearchChange, cartCount = 0, onCartClick }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    removeAuthTokenCookie();
    router.push("/login");
  };

  const getInitials = () => {
    if (!user) return "UR";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "UR";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="bg-gradient-to-br from-brand to-[#818CF8] rounded-xl p-2 shadow-md shadow-brand/10">
            <ShoppingBag className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-[#475569] bg-clip-text text-transparent">
            LuxeRetail
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md group/search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-brand transition-colors duration-200" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 w-full rounded-xl bg-background/50 border-border/80 focus-visible:border-brand focus-visible:ring-brand/30 transition-all duration-200"
          />
        </div>

        {/* Actions (Cart & Profile) */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCartClick}
            className="relative rounded-xl hover:bg-muted transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white ring-2 ring-background animate-pulse">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger >
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full border border-border/60 hover:bg-muted transition-all overflow-hidden flex items-center justify-center p-0 cursor-pointer"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-brand">
                    {getInitials()}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-lg" align="end">
              <DropdownMenuLabel className="font-normal px-4 py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {user ? `${user.firstName} ${user.lastName}` : "User Profile"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40" />
              <DropdownMenuItem className="py-2.5 px-4 cursor-pointer focus:bg-muted focus:text-foreground transition-colors rounded-lg flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/40" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="py-2.5 px-4 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
