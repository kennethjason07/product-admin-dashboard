"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { SortField, SortOrder } from "@/types";

interface SortControlProps {
  currentSort: SortField | "";
  currentOrder: SortOrder;
  onChange: (sort: SortField | "", order: SortOrder) => void;
  disabled?: boolean;
}

export const SORT_OPTIONS: {
  label: string;
  value: string;
  sort: SortField | "";
  order: SortOrder;
}[] = [
  { label: "Default Order", value: "", sort: "", order: "asc" },
  { label: "Price: Low → High", value: "price-asc", sort: "price", order: "asc" },
  { label: "Price: High → Low", value: "price-desc", sort: "price", order: "desc" },
  { label: "Rating: High → Low", value: "rating-desc", sort: "rating", order: "desc" },
  { label: "Rating: Low → High", value: "rating-asc", sort: "rating", order: "asc" },
  { label: "Title: A → Z", value: "title-asc", sort: "title", order: "asc" },
  { label: "Title: Z → A", value: "title-desc", sort: "title", order: "desc" },
];

export default function SortControl({
  currentSort,
  currentOrder,
  onChange,
  disabled = false,
}: SortControlProps) {
  const currentValue = currentSort ? `${currentSort}-${currentOrder}` : "";

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = SORT_OPTIONS.find((opt) => opt.value === e.target.value);
    if (selected) {
      onChange(selected.sort, selected.order);
    } else {
      onChange("", "asc");
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
        <ArrowUpDown className="w-4 h-4" />
      </div>

      <select
        id="sort-control-select"
        aria-label="Sort products by"
        value={currentValue}
        disabled={disabled}
        onChange={handleSelectChange}
        className="appearance-none pl-9 pr-9 py-2.5 bg-white border border-border rounded-xl text-sm font-medium text-gray-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-w-[190px]"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
