"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormData, Product } from "@/types";
import { createProduct } from "@/lib/api/products";
import { useProductStore } from "@/context/ProductContext";
import ProductForm from "@/components/products/ProductForm";
import { PackagePlus } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const { addLocalProduct } = useProductStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleCreate = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const payload: Partial<Product> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        brand: formData.brand.trim() || undefined,
        thumbnail:
          formData.thumbnail.trim() ||
          "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
        rating: 4.5,
        discountPercentage: 0,
        images: formData.thumbnail.trim() ? [formData.thumbnail.trim()] : [],
        reviews: [],
        availabilityStatus: Number(formData.stock) > 0 ? "In Stock" : "Out of Stock",
      };

      // 1. Send request to DummyJSON endpoint: POST /products/add
      const createdFromApi = await createProduct(payload);

      // 2. Fallback ID if API response doesn't provide one
      const finalProduct: Product = {
        ...payload,
        id: createdFromApi.id || Date.now(),
        title: payload.title || "Untitled Product",
        description: payload.description || "",
        category: payload.category || "general",
        price: payload.price || 0,
        stock: payload.stock || 0,
        rating: 4.5,
        discountPercentage: 0,
        tags: [],
        sku: `SKU-${Date.now().toString().slice(-6)}`,
        weight: 1,
        dimensions: { width: 10, height: 10, depth: 10 },
        warrantyInformation: "1 year standard warranty",
        shippingInformation: "Ships in 2-3 business days",
        availabilityStatus: Number(formData.stock) > 0 ? "In Stock" : "Out of Stock",
        reviews: [],
        returnPolicy: "30 days return policy",
        minimumOrderQuantity: 1,
        meta: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          barcode: `${Date.now()}`,
          qrCode: "",
        },
        images: payload.images || [],
        thumbnail: payload.thumbnail || "",
      };

      // 3. Persist in local store so it is immediately visible in the UI
      addLocalProduct(finalProduct);

      setSubmitSuccess(
        `Product "${finalProduct.title}" created successfully! Redirecting to catalog...`
      );

      // Redirect after brief feedback
      setTimeout(() => {
        router.push("/products");
      }, 1000);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setSubmitError(
        errObj.message || "Failed to create product. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <PackagePlus className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        </div>
        <p className="text-sm text-text-secondary mt-1">
          Create a new product listing in your catalog. (Simulated persistence)
        </p>
      </div>

      <ProductForm
        mode="create"
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
      />
    </div>
  );
}
