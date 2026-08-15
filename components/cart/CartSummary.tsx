"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
}

export const CartSummary = ({ subtotal, onCheckout }: CartSummaryProps) => {
  // Compute tax and total
  const estimatedTax = subtotal * 0.08; // 8% tax
  const total = subtotal + estimatedTax;

  return (
    <div className="bg-card/70 backdrop-blur-md border border-border/40 rounded-2xl p-6 flex flex-col gap-5 sticky top-24 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-semibold text-foreground">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Estimated Tax (8%)</span>
          <span className="font-semibold text-foreground">₹{estimatedTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span className="font-semibold text-success bg-success/10 px-2.5 py-0.5 rounded-full text-xs">
            Free
          </span>
        </div>

        <div className="h-[1px] bg-border/40 my-2" />

        <div className="flex justify-between text-base font-bold text-foreground">
          <span>Total</span>
          <span className="text-lg font-extrabold text-brand">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        className="w-full h-11 text-sm font-semibold rounded-xl bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/35 transition-all duration-300 active:scale-[0.98] cursor-pointer"
      >
        Proceed to Checkout
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/20">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Secure Checkout</span>
      </div>
    </div>
  );
};
