"use client";

import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemType } from "@/types/cart.type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CartItemCardProps {
  item: CartItemType;
  onIncrement: (item: CartItemType) => void;
  onDecrement: (item: CartItemType) => void;
  onRemove: (item: CartItemType) => void;
}

export const CartItemCard = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemCardProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl hover:shadow-md transition-all duration-300">
      {/* Product Image */}
      <div className="w-24 h-24 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
        <img
          src={item.productImage || "https://picsum.photos/600/400/?image=1"}
          alt={item.productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Item Details */}
      <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
        <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-2 pr-4 leading-snug">
          {item.productName}
        </h3>
        <p className="text-xs text-muted-foreground">Unit Price: ₹{item.price.toFixed(2)}</p>
        <span className="font-bold text-brand text-sm sm:text-base mt-1">
          ₹{item.totalPrice.toFixed(2)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Quantity Selector */}
        <div className="flex items-center border border-border/80 rounded-xl bg-background/50 p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDecrement(item)}
            className="w-8 h-8 rounded-lg hover:bg-muted cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </Button>
          <span className="w-8 text-center text-sm font-semibold text-foreground">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onIncrement(item)}
            className="w-8 h-8 rounded-lg hover:bg-muted cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Delete Button with Confirmation Dialog */}
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl w-9 h-9 cursor-pointer"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Item?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove &quot;{item.productName}&quot; from your cart?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => onRemove(item)}
                className="cursor-pointer"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
