"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Product } from "@/types";
import { getProducts } from "@/lib/api/products";
import { useProductStore } from "@/context/ProductContext";

interface UseProductsResult {
  products: Product[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts(limit: number = 20, skip: number = 0): UseProductsResult {
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

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    queueMicrotask(async () => {
      if (ignore) return;
      setIsLoading(true);
      setError(null);

      try {
        const response = await getProducts({
          limit,
          skip,
          signal: controller.signal,
        });

        if (!ignore) {
          setRawProducts(response.products);
          setTotal(response.total);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const errorObj = err as { name?: string; message?: string };
          if (errorObj?.name === "CanceledError" || errorObj?.name === "AbortError") {
            return;
          }
          setError(errorObj?.message || "Failed to load products. Please check your network connection.");
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
  }, [limit, skip, reloadTrigger]);

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
