"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { getProductById } from "@/lib/api/products";
import { useProductStore } from "@/context/ProductContext";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  Calendar,
  User as UserIcon,
} from "lucide-react";

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const resolvedParams = use(params);
  const idStr = resolvedParams.id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  const { getLocalProductById, locallyDeletedIds, deleteLocalProduct } =
    useProductStore();

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

      // Check if locally deleted
      if (locallyDeletedIds.includes(numericId)) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      // Check if created locally
      const local = getLocalProductById(numericId);
      if (local) {
        setProduct(local);
        setSelectedImage(local.images?.[0] || local.thumbnail || "");
        setIsLoading(false);
        return;
      }

      // Otherwise fetch from API
      setIsLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const data = await getProductById(numericId, controller.signal);
        if (!ignore) {
          setProduct(data);
          setSelectedImage(data.images?.[0] || data.thumbnail || "");
        }
      } catch (err: unknown) {
        if (!ignore) {
          const errObj = err as { status?: number; message?: string };
          if (errObj.status === 404) {
            setNotFound(true);
          } else {
            setError(
              errObj.message || "Failed to load product details from server."
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
  }, [idStr, getLocalProductById, locallyDeletedIds]);

  const handleDelete = () => {
    if (!product) return;
    if (
      window.confirm(
        `Are you sure you want to delete "${product.title}"? This action cannot be undone.`
      )
    ) {
      deleteLocalProduct(product.id);
      router.push("/products");
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
          The product with ID #{idStr} does not exist or has been removed from the
          catalog.
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

  // Error state
  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-danger rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Unable to Load Product
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {error || "An unexpected error occurred."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary bg-white border border-border hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to List</span>
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.thumbnail
      ? [product.thumbnail]
      : [];

  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Navigation / Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/products/edit/${product.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-800 bg-white border border-border hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Edit className="w-4 h-4 text-amber-600" />
            <span>Edit</span>
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-danger bg-red-50 hover:bg-red-100 transition-colors border border-red-200 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main product card */}
      <div className="bg-white rounded-3xl border border-border p-6 lg:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery section */}
          <div className="space-y-4">
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-50 border border-border">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  No image available
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-18 h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === imgUrl
                        ? "border-primary ring-2 ring-primary/20 shadow-xs"
                        : "border-border hover:border-gray-400 bg-slate-50"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="72px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details column */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-primary capitalize border border-indigo-100">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {product.brand}
                  </span>
                )}
                <span className="text-xs text-text-muted">
                  SKU: {product.sku || `#${product.id}`}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {product.rating.toFixed(1)} / 5.0
                </span>
                {product.reviews && (
                  <span className="text-xs text-text-muted">
                    ({product.reviews.length} reviews)
                  </span>
                )}
              </div>

              {/* Price & Discount */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="pt-1">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Out of stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Low stock — Only {product.stock} units left!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    In stock ({product.stock} available)
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="pt-3">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Description
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Badges / Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-border">
              {product.warrantyInformation && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-border/60">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-gray-900">Warranty</p>
                    <p className="text-text-muted truncate">
                      {product.warrantyInformation}
                    </p>
                  </div>
                </div>
              )}

              {product.shippingInformation && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-border/60">
                  <Truck className="w-5 h-5 text-primary shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-gray-900">Shipping</p>
                    <p className="text-text-muted truncate">
                      {product.shippingInformation}
                    </p>
                  </div>
                </div>
              )}

              {product.returnPolicy && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-border/60">
                  <RotateCcw className="w-5 h-5 text-primary shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-gray-900">Returns</p>
                    <p className="text-text-muted truncate">
                      {product.returnPolicy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="bg-white rounded-3xl border border-border p-6 lg:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Verified buyer feedback and product ratings
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)} / 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 border border-border rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-text-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(rev.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-bold">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {rev.reviewerName}
                    </p>
                    <p className="text-[10px] text-text-muted truncate">
                      {rev.reviewerEmail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
