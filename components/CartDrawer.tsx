"use client";

import { X, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemType } from "@/types/cart.type";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItemType[];
}

export const CartDrawer = ({ isOpen, onClose, cartItems }: CartDrawerProps) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border/40 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-brand" />
              <h2 className="text-lg font-bold text-foreground">Shopping Cart</h2>
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-brand/10 text-xs font-semibold text-brand">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-muted"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border/30">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-12">
                <div className="bg-muted p-4 rounded-full">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Your cart is empty</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">
                    Looks like you haven&apos;t added any items to your cart yet.
                  </p>
                </div>
                <Button className="rounded-xl mt-2" onClick={onClose}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.cartItemId} className="py-4 flex gap-4">
                  {/* Product Image */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                    <img
                      src={item.productImage || "https://picsum.photos/600/400/?image=1"}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between text-sm font-semibold text-foreground leading-tight">
                      <h4 className="line-clamp-2 pr-2">{item.productName}</h4>
                      <p className="text-foreground">₹{item.totalPrice.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Price: ₹{item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-muted-foreground font-medium">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="border-t border-border/40 px-6 py-6 bg-muted/20 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-medium text-success text-xs bg-success/10 px-2 py-0.5 rounded-full">
                    Free
                  </span>
                </div>
                <DropdownMenuSeparator className="bg-border/30 my-2" />
                <div className="flex justify-between text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full h-11 font-semibold rounded-xl bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all duration-300">
                Checkout
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Mock dropdown separator helper to avoid importing whole dropdown-menu
const DropdownMenuSeparator = ({ className }: { className?: string }) => (
  <div className={`h-[1px] ${className}`} />
);
