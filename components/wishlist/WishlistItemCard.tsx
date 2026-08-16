"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { WishlistItemType } from "@/types/wishlist.type";

interface WishlistItemCardProps {
  item: WishlistItemType;
  onRemove: (item: WishlistItemType) => void;
  onMoveToCart: (item: WishlistItemType) => void;
  isMoving?: boolean;
}

export const WishlistItemCard = ({
  item,
  onRemove,
  onMoveToCart,
  isMoving = false,
}: WishlistItemCardProps) => {
  const thumbnail = item.productImage || "https://picsum.photos/600/400/?image=1";

  return (
    <Card className="group flex flex-col h-full overflow-hidden border border-border/40 bg-card/65 hover:bg-card/90 transition-all duration-300 hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1 rounded-2xl">
      {/* Product Image Wrapper */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted block">
        <img
          src={thumbnail}
          alt={item.productName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Remove button at top-right (standard e-commerce practice) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item)}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 hover:bg-destructive hover:text-white border border-border/40 shadow-sm backdrop-blur-sm transition-all duration-300 z-10 cursor-pointer text-muted-foreground"
          title="Remove from Wishlist"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Product Info */}
      <CardContent className="flex flex-col flex-1 p-4 gap-4">
        <div className="flex flex-col gap-1 min-h-[3rem]">
          <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">
            {item.productName}
          </h3>
        </div>

        {/* Price & Actions */}
        <div className="flex flex-col gap-3 mt-auto pt-2 border-t border-border/30">
          <div className="flex flex-col">
            <span className="font-bold text-base text-foreground">
              ₹{item.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full">
            <Button
              size="sm"
              onClick={() => onMoveToCart(item)}
              disabled={isMoving}
              className="flex-1 h-9 rounded-xl bg-brand text-white hover:bg-brand-hover shadow-md shadow-brand/10 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 text-xs font-semibold"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Move to Cart
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemove(item)}
              className="h-9 px-3 rounded-xl border-border/80 text-muted-foreground hover:text-destructive hover:bg-destructive/5 hover:border-destructive/30 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1 active:scale-95 text-xs font-medium"
            >
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
