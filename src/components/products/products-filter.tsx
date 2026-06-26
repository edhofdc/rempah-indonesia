"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── Types ───────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
}

interface ProductsFilterProps {
  categories: Category[];
  currentSearch: string;
  currentCategory: string;
  currentSort: string;
}

// ─── Sort options ────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
] as const;

// ─── Component ───────────────────────────────────────────────────

export default function ProductsFilter({
  categories,
  currentSearch,
  currentCategory,
  currentSort,
}: ProductsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Helpers ──────────────────────────────────────────────────

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          sp.set(key, value);
        } else {
          sp.delete(key);
        }
      }
      return sp.toString();
    },
    [searchParams],
  );

  // ── Debounced search ─────────────────────────────────────────

  const [searchValue, setSearchValue] = useState(currentSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchValue !== currentSearch) {
        const qs = createQueryString({ search: searchValue, page: "1" });
        router.push(`/products?${qs}`);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue, currentSearch, createQueryString, router]);

  // Sync search input when URL changes externally (browser nav)
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  // ── Sort handler ─────────────────────────────────────────────

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const qs = createQueryString({ sort: e.target.value, page: "1" });
    router.push(`/products?${qs}`);
  };

  // ── Category handlers ────────────────────────────────────────

  const handleCategoryClick = (categoryId: string) => {
    const qs = createQueryString({ category: categoryId, page: "1" });
    router.push(`/products?${qs}`);
  };

  const handleAllClick = () => {
    const qs = createQueryString({ category: "", page: "1" });
    router.push(`/products?${qs}`);
  };

  // ── Render ───────────────────────────────────────────────────

  return (
    <>
      {/* Search & Sort Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-green-500" />
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm text-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 dark:border-green-700 dark:bg-green-950 dark:text-green-100"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-green-500" />
        <button
          type="button"
          onClick={handleAllClick}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !currentCategory
              ? "bg-green-700 text-white"
              : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryClick(cat.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              currentCategory === cat.id
                ? "bg-green-700 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </>
  );
}
