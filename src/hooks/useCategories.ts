"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";
import { getCategories } from "@/lib/api/products";

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    queueMicrotask(async () => {
      if (ignore) return;
      setIsLoading(true);
      setError(null);

      try {
        const rawData = await getCategories(controller.signal);

        if (!ignore) {
          // Normalise in case format is string[] or Category[]
          const normalized: Category[] = rawData.map((item: unknown) => {
            if (typeof item === "string") {
              return {
                slug: item,
                name: item
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" "),
                url: `/products/category/${item}`,
              };
            }
            return item as Category;
          });

          setCategories(normalized);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const errorObj = err as { name?: string; message?: string };
          if (
            errorObj?.name === "CanceledError" ||
            errorObj?.name === "AbortError"
          ) {
            return;
          }
          setError(
            errorObj?.message || "Failed to load categories. Please try again."
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
  }, []);

  return {
    categories,
    isLoading,
    error,
  };
}
