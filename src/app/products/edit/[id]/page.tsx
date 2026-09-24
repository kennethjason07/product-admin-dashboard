"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product, ProductFormData } from "@/types";
import { getProductById, updateProduct } from "@/lib/api/products";
import { useProductStore } from "@/context/ProductContext";
import ProductForm from "@/components/products/ProductForm";
import { ArrowLeft, Edit3, AlertCircle, Loader2 } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = use(params);
  const idStr = resolvedParams.id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    getLocalProductById,
    locallyDeletedIds,
    updateLocalProduct,
    locallyUpdated,
  } = useProductStore();

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    queueMicrotask(async () => {
      if (ignore) return;
      const numericId = parseInt(idStr, 10);
      if (isNaN(numericId) || numericId <= 0) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      if (locallyDeletedIds.includes(numericId)) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      // Check if created locally
      const local = getLocalProductById(numericId);
      if (local) {
        setProduct(local);
        setIsLoading(false);
        return;
      }

      // Otherwise fetch from API and apply local updates if any
      setIsLoading(true);
      setLoadError(null);

      try {
        const data = await getProductById(numericId, controller.signal);
        if (!ignore) {
          const updates = locallyUpdated[numericId];
          const merged = updates ? { ...data, ...updates } : data;
          setProduct(merged as Product);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const errObj = err as { status?: number; message?: string };
          if (errObj.status === 404) {
            setNotFound(true);
          } else {
            setLoadError(
              errObj.message || "Failed to load product details for editing."
            );
          }
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
  }, [idStr, getLocalProductById, locallyDeletedIds, locallyUpdated]);

  const handleUpdate = async (formData: ProductFormData) => {
    if (!product) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const numericId = product.id;

    try {
      const payload: Partial<Product> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        brand: formData.brand.trim() || undefined,
        thumbnail: formData.thumbnail.trim() || product.thumbnail,
      };

      // 1. Send update request: PUT /products/{id}
      await updateProduct(numericId, payload);

      // 2. Persist update in local store
      updateLocalProduct(numericId, payload);

      setSubmitSuccess(
        `Changes saved successfully! Redirecting back to product...`
      );

      // Redirect after brief feedback
      setTimeout(() => {
        router.push(`/products/${numericId}`);
      }, 1000);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setSubmitError(
        errObj.message || "Failed to save product updates. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
        <p className="text-sm font-medium text-text-secondary">
          Loading product details...
        </p>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Cannot edit product #{idStr} because it does not exist or has been
          deleted.
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  // Load error state
  if (loadError || !product) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-danger rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Failed to Load</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {loadError || "Could not retrieve product for editing."}
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary bg-white border border-border hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Edit3 className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit &ldquo;{product.title}&rdquo;
          </h1>
        </div>
        <p className="text-sm text-text-secondary mt-1">
          Modify product details below. Changes are saved and persisted locally.
        </p>
      </div>

      <ProductForm
        mode="edit"
        initialData={product}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
      />
    </div>
  );
}
