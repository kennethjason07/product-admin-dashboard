"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Product } from "@/types";

interface ProductContextType {
  locallyCreated: Product[];
  locallyUpdated: Record<number, Partial<Product>>;
  locallyDeletedIds: number[];
  addLocalProduct: (product: Product) => void;
  updateLocalProduct: (id: number, data: Partial<Product>) => void;
  deleteLocalProduct: (id: number) => void;
  applyLocalOverrides: (products: Product[]) => Product[];
  getLocalProductById: (id: number) => Product | null;
}

const LOCAL_CREATED_KEY = "local_created_products";
const LOCAL_UPDATED_KEY = "local_updated_products";
const LOCAL_DELETED_KEY = "local_deleted_products";

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [locallyCreated, setLocallyCreated] = useState<Product[]>([]);
  const [locallyUpdated, setLocallyUpdated] = useState<
    Record<number, Partial<Product>>
  >({});
  const [locallyDeletedIds, setLocallyDeletedIds] = useState<number[]>([]);

  // Restore local mutations from storage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedCreated = localStorage.getItem(LOCAL_CREATED_KEY);
        const storedUpdated = localStorage.getItem(LOCAL_UPDATED_KEY);
        const storedDeleted = localStorage.getItem(LOCAL_DELETED_KEY);

        if (storedCreated) setLocallyCreated(JSON.parse(storedCreated));
        if (storedUpdated) setLocallyUpdated(JSON.parse(storedUpdated));
        if (storedDeleted) setLocallyDeletedIds(JSON.parse(storedDeleted));
      } catch {
        // Storage parse error
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const addLocalProduct = useCallback((product: Product) => {
    setLocallyCreated((prev) => {
      const next = [product, ...prev.filter((p) => p.id !== product.id)];
      try {
        localStorage.setItem(LOCAL_CREATED_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const updateLocalProduct = useCallback(
    (id: number, data: Partial<Product>) => {
      setLocallyUpdated((prev) => {
        const next = { ...prev, [id]: { ...(prev[id] || {}), ...data } };
        try {
          localStorage.setItem(LOCAL_UPDATED_KEY, JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });

      // Also update in locallyCreated if it was created during this session
      setLocallyCreated((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...data } : p));
        try {
          localStorage.setItem(LOCAL_CREATED_KEY, JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    },
    []
  );

  const deleteLocalProduct = useCallback((id: number) => {
    setLocallyDeletedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(LOCAL_DELETED_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });

    // Remove from locallyCreated if present
    setLocallyCreated((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(LOCAL_CREATED_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  /**
   * Transforms raw API products by applying locally created, updated, and deleted state.
   */
  const applyLocalOverrides = useCallback(
    (products: Product[]): Product[] => {
      const deletedSet = new Set(locallyDeletedIds);

      // 1. Filter out deleted products
      let list = products.filter((p) => !deletedSet.has(p.id));

      // 2. Apply updates
      list = list.map((p) => {
        const updates = locallyUpdated[p.id];
        return updates ? ({ ...p, ...updates } as Product) : p;
      });

      // 3. Prepend newly created products if not already included and not deleted
      for (const created of locallyCreated) {
        if (!deletedSet.has(created.id) && !list.some((p) => p.id === created.id)) {
          const updates = locallyUpdated[created.id];
          list.unshift(updates ? ({ ...created, ...updates } as Product) : created);
        }
      }

      return list;
    },
    [locallyCreated, locallyUpdated, locallyDeletedIds]
  );

  const getLocalProductById = useCallback(
    (id: number): Product | null => {
      if (locallyDeletedIds.includes(id)) return null;

      const created = locallyCreated.find((p) => p.id === id);
      if (created) {
        const updates = locallyUpdated[id];
        return updates ? ({ ...created, ...updates } as Product) : created;
      }

      return null;
    },
    [locallyCreated, locallyUpdated, locallyDeletedIds]
  );

  return (
    <ProductContext.Provider
      value={{
        locallyCreated,
        locallyUpdated,
        locallyDeletedIds,
        addLocalProduct,
        updateLocalProduct,
        deleteLocalProduct,
        applyLocalOverrides,
        getLocalProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductStore() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductStore must be used within a ProductProvider");
  }
  return context;
}
