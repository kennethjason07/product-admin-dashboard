"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  value: string;
  onChange: (searchQuery: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search products by title, brand, or SKU...",
  disabled = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(value);
  const debouncedQuery = useDebounce(query, 400);
  const isFirstRender = useRef(true);

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  // Emit debounced value changes to parent
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debouncedQuery !== value) {
      onChange(debouncedQuery);
    }
  }, [debouncedQuery, onChange, value]);

  const handleClear = () => {
    setQuery("");
    onChange("");
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={query}
        disabled={disabled}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-9 py-2.5 bg-white border border-border rounded-xl text-sm text-gray-900 placeholder-text-muted shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          title="Clear search"
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-gray-700 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
