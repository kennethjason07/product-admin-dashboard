import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import ProductActions from "./ProductActions";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onDeleteRequest?: (id: number, title: string) => void;
  isDeleting?: boolean;
}

export default function ProductCard({
  product,
  onDeleteRequest,
  isDeleting,
}: ProductCardProps) {
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
      {/* Thumbnail + Badges */}
      <div className="relative w-full h-48 bg-slate-100">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-text-muted">
            No image available
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/95 text-slate-800 shadow-xs capitalize backdrop-blur-xs">
            {product.category}
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs text-xs font-semibold text-gray-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {product.brand && (
            <p className="text-xs font-medium text-text-muted mb-0.5 uppercase tracking-wider">
              {product.brand}
            </p>
          )}
          <Link
            href={`/products/${product.id}`}
            className="font-bold text-gray-900 hover:text-primary transition-colors text-base line-clamp-1"
          >
            {product.title}
          </Link>
          <p className="text-xs text-text-secondary line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Price & Stock & Actions footer */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <div className="mt-0.5">
              {isOutOfStock ? (
                <span className="text-[11px] font-semibold text-danger">
                  Out of stock
                </span>
              ) : isLowStock ? (
                <span className="text-[11px] font-semibold text-amber-600">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="text-[11px] text-emerald-600 font-medium">
                  {product.stock} in stock
                </span>
              )}
            </div>
          </div>

          <ProductActions
            productId={product.id}
            productTitle={product.title}
            onDeleteRequest={onDeleteRequest}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </div>
  );
}
