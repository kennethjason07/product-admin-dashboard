import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import ProductActions from "./ProductActions";
import { Star } from "lucide-react";

interface ProductRowProps {
  product: Product;
  onDeleteRequest?: (id: number, title: string) => void;
  isDeleting?: boolean;
}

export default function ProductRow({
  product,
  onDeleteRequest,
  isDeleting,
}: ProductRowProps) {
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-border text-sm">
      {/* Product Image */}
      <td className="py-3 px-4 w-16">
        <Link href={`/products/${product.id}`} className="block relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-border group">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="48px"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">
              No img
            </div>
          )}
        </Link>
      </td>

      {/* Title & Brand */}
      <td className="py-3 px-4 min-w-[220px]">
        <Link
          href={`/products/${product.id}`}
          className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-1"
          title={product.title}
        >
          {product.title}
        </Link>
        <div className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
          {product.brand && <span className="font-medium text-text-secondary">{product.brand}</span>}
          {product.brand && <span>•</span>}
          <span>SKU: {product.sku || `#${product.id}`}</span>
        </div>
      </td>

      {/* Category */}
      <td className="py-3 px-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
          {product.category}
        </span>
      </td>

      {/* Price */}
      <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">
        ${product.price.toFixed(2)}
      </td>

      {/* Rating */}
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
          <span className="font-medium text-gray-800 text-xs">
            {product.rating.toFixed(1)}
          </span>
        </div>
      </td>

      {/* Stock */}
      <td className="py-3 px-4 whitespace-nowrap">
        {isOutOfStock ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-red-100 text-red-700">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-700">
            Low ({product.stock})
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
            {product.stock} in stock
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <ProductActions
          productId={product.id}
          productTitle={product.title}
          onDeleteRequest={onDeleteRequest}
          isDeleting={isDeleting}
        />
      </td>
    </tr>
  );
}
