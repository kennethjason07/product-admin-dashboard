"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Product } from "@/types";
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
} from "@/lib/api/products";
import { useProductStore } from "@/context/ProductContext";

export interface UseProductsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sort?: string;
  sortOrder?: "asc" | "desc";
}

interface UseProductsResult {
  products: Product[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts({
  page = 1,
  pageSize = 20,
  search = "",
  category = "",
  sort = "",
  sortOrder = "asc",
}: UseProductsOptions = {}): UseProductsResult {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { applyLocalOverrides } = useProductStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  const refetch = useCallback(async () => {
    setReloadTrigger((c) => c + 1);
  }, []);

  const skip = (Math.max(1, page) - 1) * pageSize;

  useEffect(() => {
    let ignore = false;

    // Abort previous pending request to guarantee race-condition safety
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    queueMicrotask(async () => {
      if (ignore) return;
      setIsLoading(true);
      setError(null);

      try {
        let response;

        if (search.trim()) {
          // DummyJSON search endpoint
          response = await searchProducts(search.trim(), {
            limit: pageSize,
            skip,
            sortBy: sort || undefined,
            order: sortOrder,
            signal: controller.signal,
          });
        } else if (category.trim()) {
          // DummyJSON category endpoint
          response = await getProductsByCategory(category.trim(), {
            limit: pageSize,
            skip,
            sortBy: sort || undefined,
            order: sortOrder,
            signal: controller.signal,
          });
        } else {
          // Standard product list endpoint
          response = await getProducts({
            limit: pageSize,
            skip,
            sortBy: sort || undefined,
            order: sortOrder,
            signal: controller.signal,
          });
        }

        if (!ignore) {
          setRawProducts(response.products);
          setTotal(response.total);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const errorObj = err as { name?: string; message?: string };
          // Ignore cancelled or aborted requests
          if (
            errorObj?.name === "CanceledError" ||
            errorObj?.name === "AbortError"
          ) {
            return;
          }
          setError(
            errorObj?.message ||
              "Failed to load products. Please check your network connection."
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [page, pageSize, skip, search, category, sort, sortOrder, reloadTrigger]);

  // Apply simulated local mutations (added, edited, deleted products)
  const products = applyLocalOverrides(rawProducts);

  return {
    products,
    total,
    isLoading,
    error,
    refetch,
  };
}
