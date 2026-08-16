"use client";

import { useState, useEffect } from "react";
import { CategoryType } from "@/types/category.type";
import { cn } from "@/lib/utils";
import { LayoutGrid, Filter, ChevronDown, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategorySidebarProps {
  categories: CategoryType[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  onSearchCategories: (query: string) => void;
  onLoadMoreCategories: () => void;
  hasNextCategories: boolean;
}

export const CategorySidebar = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onSearchCategories,
  onLoadMoreCategories,
  hasNextCategories,
}: CategorySidebarProps) => {
  const [searchVal, setSearchVal] = useState("");
  const currentCategoryName =
    categories.find((c) => c.slug === selectedCategory)?.name || "All Products";

  // Debounce category search query
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchCategories(searchVal);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchVal, onSearchCategories]);

  return (
    <>
      {/* Mobile Category Dropdown Selector */}
      <div className="md:hidden w-full flex flex-col gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="outline"
              className="w-full justify-between h-10 rounded-xl border-border/60 bg-card/50 text-sm font-semibold text-foreground cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand" />
                Category: {currentCategoryName}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(100vw-2rem)] max-h-60 overflow-y-auto rounded-xl">
            <DropdownMenuRadioGroup
              value={selectedCategory || "all"}
              onValueChange={(val) => onSelectCategory(val === "all" ? null : val)}
            >
              <DropdownMenuRadioItem value="all" className="cursor-pointer">
                All Products
              </DropdownMenuRadioItem>
              {categories.map((category) => (
                <DropdownMenuRadioItem
                  key={category.id}
                  value={category.slug}
                  className="cursor-pointer"
                >
                  {category.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Sidebar Category List */}
      <aside className="hidden md:flex flex-col gap-5 w-60 shrink-0 sticky top-24">
        <div className="flex items-center gap-2 px-1 border-b border-border/30 pb-3">
          <LayoutGrid className="w-4 h-4 text-brand" />
          <h3 className="font-bold text-sm tracking-wide text-foreground uppercase">
            Categories
          </h3>
        </div>

        {/* Category Search Input */}
        <div className="relative group/cat-search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within/cat-search:text-brand transition-colors" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="pl-9 h-8.5 text-xs rounded-xl bg-background/50 border-border/80 focus-visible:border-brand focus-visible:ring-brand/30"
          />
        </div>

        <div className="flex flex-col gap-1.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent">
          {/* All Products Tab */}
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              "flex items-center justify-between px-3 py-1.5 text-sm font-medium rounded-xl text-left transition-all duration-200 cursor-pointer",
              selectedCategory === null
                ? "bg-brand/10 text-brand font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            All Products
          </button>

          {/* Categories Loop */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.slug)}
              className={cn(
                "flex items-center justify-between px-3 py-1.5 text-sm font-medium rounded-xl text-left transition-all duration-200 cursor-pointer",
                selectedCategory === category.slug
                  ? "bg-brand/10 text-brand font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {category.name}
            </button>
          ))}

          {/* Load More Categories Trigger */}
          {hasNextCategories && (
            <button
              onClick={onLoadMoreCategories}
              className="flex items-center justify-center gap-1 mt-2 py-1.5 px-3 rounded-xl border border-dashed border-border/60 hover:border-brand/40 text-xs font-semibold text-muted-foreground hover:text-brand transition-all cursor-pointer w-full text-center"
            >
              <Plus className="w-3 h-3" />
              Load More
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
