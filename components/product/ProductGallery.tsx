"use client";

import { useState } from "react";
import { ProductMediaDTO } from "@/types/productDetail.type";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface ProductGalleryProps {
  media: ProductMediaDTO[];
  name: string;
}

export const ProductGallery = ({ media, name }: ProductGalleryProps) => {
  // Sort media by sortOrder
  const sortedMedia = [...media].sort((a, b) => a.sortOrder - b.sortOrder);
  const [selectedMedia, setSelectedMedia] = useState<ProductMediaDTO | null>(
    sortedMedia.find((m) => m.isThumbnail) || sortedMedia[0] || null
  );

  if (sortedMedia.length === 0) {
    return (
      <div className="w-full aspect-square rounded-2xl bg-muted flex flex-col items-center justify-center border border-border/60">
        <ImageOff className="w-12 h-12 text-muted-foreground" />
        <span className="text-xs text-muted-foreground mt-2">No images available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Primary Display Image */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted border border-border/40 shadow-sm transition-all duration-300">
        <img
          src={selectedMedia?.url}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Thumbnail Navigation Row */}
      {sortedMedia.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {sortedMedia.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMedia(m)}
              className={cn(
                "relative aspect-square w-16 sm:w-20 rounded-xl overflow-hidden bg-muted border-2 transition-all duration-200 cursor-pointer shrink-0 snap-start",
                selectedMedia?.id === m.id
                  ? "border-brand ring-2 ring-brand/20 shadow-sm"
                  : "border-transparent hover:border-border"
              )}
            >
              <img
                src={m.url}
                alt={`${name} thumbnail`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
