"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductTable from "@/components/products/ProductTable";
import ProductCard from "@/components/products/ProductCard";
import { TableSkeletonRows, CardSkeletonList } from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

export default function ProductsPage() {
  const { products, total, isLoading, error, refetch } = useProducts(20, 0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeleteRequest = (id: number, title: string) => {
    // Delete dialog will be hooked up in Phase 12
    setDeletingId(id);
    alert(`Delete requested for product #${id}: "${title}". Confirmation modal will be hooked up in deletion phase.`);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            {!isLoading && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-primary border border-indigo-100">
                {total} items
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Browse, manage, and monitor all product inventory
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && !isLoading && (
        <ErrorState
          title="Could not load products"
          message={error}
          onRetry={refetch}
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <>
          {/* Desktop Skeleton */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border border-border shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  <th className="py-3.5 px-4 w-16">Image</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <TableSkeletonRows count={8} />
              </tbody>
            </table>
          </div>

          {/* Mobile Skeleton */}
          <div className="md:hidden">
            <CardSkeletonList count={6} />
          </div>
        </>
      )}

      {/* Empty state */}
      {!isLoading && !error && products.length === 0 && (
        <EmptyState
          title="No products available"
          description="There are currently no products in the catalog."
          actionLabel="Refresh list"
          onAction={refetch}
          icon={<Package className="w-8 h-8" />}
        />
      )}

      {/* Content: Desktop Table & Mobile Cards */}
      {!isLoading && !error && products.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <ProductTable
              products={products}
              onDeleteRequest={handleDeleteRequest}
              deletingId={deletingId}
            />
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDeleteRequest={handleDeleteRequest}
                isDeleting={deletingId === product.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
