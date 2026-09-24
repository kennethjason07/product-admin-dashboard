"use client";

import React from "react";
import { Filter, X, Info } from "lucide-react";
import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onChange: (categorySlug: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  isSearchActive?: boolean;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
  isLoading = false,
  disabled = false,
  isSearchActive = false,
}: CategoryFilterProps) {
  const isFilterDisabled = disabled || isSearchActive;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="relative inline-flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
          <Filter className="w-4 h-4" />
        </div>

        <select
          id="category-filter-select"
          aria-label="Filter by category"
          value={selectedCategory}
          disabled={isFilterDisabled || isLoading}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-9 pr-9 py-2.5 bg-white border border-border rounded-xl text-sm font-medium text-gray-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-w-[170px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {selectedCategory && !isSearchActive && (
          <button
            type="button"
            onClick={() => onChange("")}
            title="Clear category filter"
            aria-label="Clear category filter"
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-text-muted hover:text-gray-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Explanatory note when search is active */}
      {isSearchActive && (
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs"
          title="DummyJSON does not support simultaneous search and category query. Search results take precedence."
        >
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Category filter paused while searching</span>
        </div>
      )}
    </div>
  );
}
