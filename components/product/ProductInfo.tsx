"use client";

import { Heart, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductInfoProps {
  name: string;
  description: string;
  originalPrice: number;
  sellPrice: number;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  isAddingToCart: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: () => void;
}

export const ProductInfo = ({
  name,
  description,
  originalPrice,
  sellPrice,
  quantity,
  onQuantityChange,
  onAddToCart,
  isAddingToCart,
  isWishlisted = false,
  onWishlistToggle,
}: ProductInfoProps) => {
  const showOriginalPrice = originalPrice > sellPrice;
  const discountPercent = showOriginalPrice
    ? Math.round(((originalPrice - sellPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {name}
        </h1>
      </div>

      {/* Pricing Block */}
      <div className="flex flex-col gap-1 border-t border-b border-border/20 py-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-foreground">₹{sellPrice.toLocaleString("en-IN")}</span>
          {showOriginalPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through font-medium">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                Save {discountPercent}%
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Inclusive of all local taxes</p>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-xs tracking-wider text-muted-foreground uppercase">Description</h3>
        <p className="text-sm text-foreground/80 leading-relaxed text-pretty font-light">
          {description}
        </p>
      </div>

      {/* Quantity & Cart Actions */}
      <div className="flex flex-col gap-5 border-t border-border/20 pt-5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">Quantity:</span>
          <div className="flex items-center gap-1 bg-muted/40 border rounded-xl p-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              disabled={quantity <= 1}
              onClick={() => onQuantityChange(quantity - 1)}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>
            <span className="w-8 text-center text-sm font-bold text-foreground">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onQuantityChange(quantity + 1)}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onAddToCart}
            disabled={isAddingToCart}
            className="flex-1 rounded-xl h-11 cursor-pointer font-bold gap-2 text-sm bg-brand text-white hover:bg-brand-hover shadow-sm hover:shadow transition-all border border-transparent"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onWishlistToggle}
            className={`h-11 w-11 rounded-xl cursor-pointer hover:bg-muted/80 transition-colors shrink-0 ${
              isWishlisted ? "text-destructive hover:text-destructive bg-destructive/5" : "text-muted-foreground hover:text-destructive"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-destructive" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};
