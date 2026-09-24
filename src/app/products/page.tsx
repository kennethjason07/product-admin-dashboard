"use client";

import React, { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Package } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductTable from "@/components/products/ProductTable";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/common/Pagination";
import SearchBar from "@/components/products/SearchBar";
import CategoryFilter from "@/components/products/CategoryFilter";
import SortControl from "@/components/products/SortControl";
import { TableSkeletonRows, CardSkeletonList } from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useCategories } from "@/hooks/useCategories";
import { parseProductQueryParams, buildQueryString } from "@/utils/url";
import { SortField, SortOrder } from "@/types";
import { deleteProduct } from "@/lib/api/products";
import { useProductStore } from "@/context/ProductContext";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Parse URL state safely
  const { page, pageSize, search, category, sort, sortOrder } =
    parseProductQueryParams(searchParams);

  const { products, total, isLoading, error, refetch } = useProducts({
    page,
    pageSize,
    search,
    category,
    sort,
    sortOrder,
  });

  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const { deleteLocalProduct } = useProductStore();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const updateUrlParams = (
    updates: Partial<{
      page: number;
      pageSize: number;
      search: string;
      category: string;
      sort: string;
      sortOrder: string;
    }>
  ) => {
    const qs = buildQueryString(searchParams, updates);
    startTransition(() => {
      router.push(`/products${qs}`);
    });
  };

  const handleSearchChange = (newSearch: string) => {
    updateUrlParams({ page: 1, search: newSearch });
  };

  const handleCategoryChange = (newCategory: string) => {
    updateUrlParams({ page: 1, category: newCategory });
  };

  const handleSortChange = (newSort: SortField | "", newOrder: SortOrder) => {
    updateUrlParams({ page: 1, sort: newSort, sortOrder: newOrder });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    updateUrlParams({ page: 1, pageSize: newPageSize });
  };

  const handleDeleteRequest = (id: number, title: string) => {
    setDeleteTarget({ id, title });
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      // Call DummyJSON API (for local dummy created IDs like >194, endpoint may 404, handle gracefully)
      try {
        await deleteProduct(deleteTarget.id);
      } catch (err: unknown) {
        // If it's a locally created item not on server, ignore 404
        console.warn("Server delete call returned error, proceeding with local deletion:", err);
      }

      // Remove from local context & storage
      deleteLocalProduct(deleteTarget.id);

      // Show temporary toast
      const deletedTitle = deleteTarget.title;
      setDeleteTarget(null);
      setToastMessage(`Product "${deletedTitle}" was deleted successfully.`);
      setTimeout(() => setToastMessage(null), 4000);

      // Trigger refetch to update UI list
      refetch();
    } catch {
      setDeleteError("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Delete error notification */}
      {deleteError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-danger text-sm font-medium flex items-center justify-between shadow-xs animate-in fade-in">
          <span>{deleteError}</span>
          <button
            type="button"
            onClick={() => setDeleteError(null)}
            className="text-red-600 hover:text-red-900 font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}

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

      {/* Search and Filters toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-border shadow-2xs">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          disabled={isLoading}
        />

        <div className="flex flex-wrap items-center gap-3">
          <CategoryFilter
            categories={categories}
            selectedCategory={category}
            onChange={handleCategoryChange}
            isLoading={isCategoriesLoading}
            disabled={isLoading}
            isSearchActive={!!search.trim()}
          />

          <SortControl
            currentSort={sort}
            currentOrder={sortOrder}
            onChange={handleSortChange}
            disabled={isLoading}
          />
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
                <TableSkeletonRows count={pageSize > 10 ? 10 : pageSize} />
              </tbody>
            </table>
          </div>

          {/* Mobile Skeleton */}
          <div className="md:hidden">
            <CardSkeletonList count={4} />
          </div>
        </>
      )}

      {/* Empty state */}
      {!isLoading && !error && products.length === 0 && (
        <EmptyState
          title={
            search
              ? `No products found for "${search}"`
              : category
              ? `No products in category "${category}"`
              : "No products available"
          }
          description={
            search
              ? "We couldn't find any products matching your search query. Try checking for typos or searching with different keywords."
              : category
              ? "There are currently no products available in this category. Try picking another category."
              : "There are currently no products matching this view."
          }
          actionLabel={
            search
              ? "Clear search"
              : category
              ? "Clear category"
              : "Refresh list"
          }
          onAction={
            search
              ? () => handleSearchChange("")
              : category
              ? () => handleCategoryChange("")
              : refetch
          }
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
              currentSort={sort}
              currentOrder={sortOrder}
              onSortChange={handleSortChange}
              onDeleteRequest={handleDeleteRequest}
              deletingId={deleteTarget?.id ?? null}
            />
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDeleteRequest={handleDeleteRequest}
                isDeleting={deleteTarget?.id === product.id}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="pt-2">
            <Pagination
              currentPage={page}
              pageSize={pageSize}
              totalItems={total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              disabled={isLoading}
            />
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        productTitle={deleteTarget?.title || ""}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="bg-white rounded-2xl border border-border p-8 animate-pulse h-96" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
