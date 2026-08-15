"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import { ProductType } from "@/types/product.type";

interface ProductCardProps {
  product: ProductType;
  onAddToCart?: (product: ProductType) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // Get thumbnail or first image
  const thumbnail = product.thumbnailUrl || "https://picsum.photos/600/400/?image=1";

  // Calculate discount percentage
  const showDiscount = product.originalPrice > product.sellPrice;

  return (
    <Card className="group flex flex-col h-full overflow-hidden border border-border/40 bg-card/65 hover:bg-card/90 transition-all duration-300 hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1 rounded-2xl">
      {/* Product Image Wrapper */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <img
          src={thumbnail}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <CardContent className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-yellow-500">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>4.5</span>
        </div>

        <div className="flex flex-col gap-1 min-h-[3.5rem]">
          <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 group-hover:text-brand transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/30">
          <div className="flex flex-col">
            {showDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-bold text-base text-foreground">
              ₹{product.sellPrice.toFixed(2)}
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => onAddToCart?.(product)}
            className="h-9 px-3 rounded-xl bg-brand text-white hover:bg-brand-hover shadow-md shadow-brand/10 transition-all duration-300 cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
