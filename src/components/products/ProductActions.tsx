import React from "react";
import Link from "next/link";
import { Eye, Edit, Trash2 } from "lucide-react";

interface ProductActionsProps {
  productId: number;
  productTitle: string;
  onDeleteRequest?: (id: number, title: string) => void;
  isDeleting?: boolean;
}

export default function ProductActions({
  productId,
  productTitle,
  onDeleteRequest,
  isDeleting = false,
}: ProductActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* View details */}
      <Link
        href={`/products/${productId}`}
        title={`View details for ${productTitle}`}
        className="p-1.5 text-text-secondary hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
        aria-label={`View ${productTitle}`}
      >
        <Eye className="w-4 h-4" />
      </Link>

      {/* Edit product */}
      <Link
        href={`/products/edit/${productId}`}
        title={`Edit ${productTitle}`}
        className="p-1.5 text-text-secondary hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
        aria-label={`Edit ${productTitle}`}
      >
        <Edit className="w-4 h-4" />
      </Link>

      {/* Delete product */}
      {onDeleteRequest && (
        <button
          type="button"
          onClick={() => onDeleteRequest(productId, productTitle)}
          disabled={isDeleting}
          title={`Delete ${productTitle}`}
          className="p-1.5 text-text-secondary hover:text-danger hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          aria-label={`Delete ${productTitle}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
