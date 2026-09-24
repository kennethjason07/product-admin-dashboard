"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Product, ProductFormData, Category } from "@/types";
import { useCategories } from "@/hooks/useCategories";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Save,
} from "lucide-react";

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (formData: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
  mode: "create" | "edit";
  submitError?: string | null;
  submitSuccess?: string | null;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
}

export default function ProductForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  mode,
  submitError,
  submitSuccess,
}: ProductFormProps) {
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price !== undefined ? initialData.price : "",
    category: initialData?.category || "",
    stock: initialData?.stock !== undefined ? initialData.stock : "",
    brand: initialData?.brand || "",
    thumbnail: initialData?.thumbnail || "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const isLocked = useRef(false);

  const validate = (): boolean => {
    const errs: ValidationErrors = {};

    if (!formData.title.trim()) {
      errs.title = "Product title is required.";
    } else if (formData.title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters long.";
    }

    if (!formData.description.trim()) {
      errs.description = "Product description is required.";
    } else if (formData.description.trim().length < 10) {
      errs.description = "Description must be at least 10 characters long.";
    }

    const numPrice = Number(formData.price);
    if (formData.price === "" || isNaN(numPrice)) {
      errs.price = "Valid price is required.";
    } else if (numPrice <= 0) {
      errs.price = "Price must be greater than $0.00.";
    }

    if (!formData.category.trim()) {
      errs.category = "Please select a category.";
    }

    const numStock = Number(formData.stock);
    if (formData.stock === "" || isNaN(numStock)) {
      errs.stock = "Valid stock number is required.";
    } else if (numStock < 0 || !Number.isInteger(numStock)) {
      errs.stock = "Stock must be a non-negative whole number.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Double submission prevention
    if (isSubmitting || isLocked.current) return;

    if (!validate()) return;

    isLocked.current = true;
    try {
      await onSubmit(formData);
    } finally {
      isLocked.current = false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Success notification */}
      {submitSuccess && (
        <div
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-sm"
          role="status"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Success!</p>
            <p className="text-xs mt-0.5">{submitSuccess}</p>
          </div>
        </div>
      )}

      {/* Error notification */}
      {submitError && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-sm"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Submission failed</p>
            <p className="text-xs mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white rounded-3xl border border-border p-6 lg:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-border pb-3">
          {mode === "create" ? "Product Information" : "Edit Product Details"}
        </h2>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Product Title <span className="text-danger">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            disabled={isSubmitting}
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Wireless Noise-Cancelling Headphones"
            className={`block w-full px-3.5 py-2.5 bg-gray-50/50 border rounded-xl text-sm text-gray-900 placeholder-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60 ${
              errors.title ? "border-danger ring-1 ring-danger/30" : "border-border"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-danger font-medium">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            disabled={isSubmitting}
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a comprehensive description of the product, key features, and specifications..."
            className={`block w-full px-3.5 py-2.5 bg-gray-50/50 border rounded-xl text-sm text-gray-900 placeholder-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60 ${
              errors.description
                ? "border-danger ring-1 ring-danger/30"
                : "border-border"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-danger font-medium">
              {errors.description}
            </p>
          )}
        </div>

        {/* Two columns: Price & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Price (USD) <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted font-medium text-sm">
                $
              </span>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                required
                disabled={isSubmitting}
                value={formData.price}
                onChange={handleChange}
                placeholder="29.99"
                className={`block w-full pl-8 pr-3.5 py-2.5 bg-gray-50/50 border rounded-xl text-sm text-gray-900 placeholder-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60 ${
                  errors.price
                    ? "border-danger ring-1 ring-danger/30"
                    : "border-border"
                }`}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-xs text-danger font-medium">
                {errors.price}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Category <span className="text-danger">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              disabled={isSubmitting || isCategoriesLoading}
              value={formData.category}
              onChange={handleChange}
              className={`block w-full px-3.5 py-2.5 bg-gray-50/50 border rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer disabled:opacity-60 ${
                errors.category
                  ? "border-danger ring-1 ring-danger/30"
                  : "border-border"
              }`}
            >
              <option value="">Select a category...</option>
              {categories.map((c: Category) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-danger font-medium">
                {errors.category}
              </p>
            )}
          </div>
        </div>

        {/* Two columns: Stock & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Stock */}
          <div>
            <label
              htmlFor="stock"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Stock Quantity <span className="text-danger">*</span>
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              required
              disabled={isSubmitting}
              value={formData.stock}
              onChange={handleChange}
              placeholder="e.g. 50"
              className={`block w-full px-3.5 py-2.5 bg-gray-50/50 border rounded-xl text-sm text-gray-900 placeholder-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60 ${
                errors.stock
                  ? "border-danger ring-1 ring-danger/30"
                  : "border-border"
              }`}
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-danger font-medium">
                {errors.stock}
              </p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label
              htmlFor="brand"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Brand (Optional)
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              disabled={isSubmitting}
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Sony, Apple, Nike"
              className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-border rounded-xl text-sm text-gray-900 placeholder-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60"
            />
          </div>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label
            htmlFor="thumbnail"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Image URL (Optional)
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="url"
            disabled={isSubmitting}
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="https://example.com/product-image.jpg"
            className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-border rounded-xl text-sm text-gray-900 placeholder-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60"
          />
          <p className="mt-1 text-[11px] text-text-muted">
            Leave blank to use a default placeholder image.
          </p>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary bg-white border border-border hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </Link>

        <button
          type="submit"
          id="product-form-submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving product...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{mode === "create" ? "Create Product" : "Save Changes"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
