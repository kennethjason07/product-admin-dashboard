import React from "react";
import { Product, SortField, SortOrder } from "@/types";
import ProductRow from "./ProductRow";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  currentSort?: SortField | "";
  currentOrder?: SortOrder;
  onSortChange?: (field: SortField, order: SortOrder) => void;
  onDeleteRequest?: (id: number, title: string) => void;
  deletingId?: number | null;
}

export default function ProductTable({
  products,
  currentSort,
  currentOrder,
  onSortChange,
  onDeleteRequest,
  deletingId,
}: ProductTableProps) {
  const handleHeaderSort = (field: SortField) => {
    if (!onSortChange) return;

    if (currentSort === field) {
      // Toggle order
      onSortChange(field, currentOrder === "asc" ? "desc" : "asc");
    } else {
      // Default to ascending (or descending for rating)
      onSortChange(field, field === "rating" ? "desc" : "asc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (currentSort !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-text-muted opacity-50 group-hover:opacity-100" />;
    }
    return currentOrder === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary" />
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-border shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-text-secondary select-none">
            <th scope="col" className="py-3.5 px-4 w-16">
              Image
            </th>

            {/* Sortable: Title */}
            <th scope="col" className="py-3.5 px-4">
              <button
                type="button"
                onClick={() => handleHeaderSort("title")}
                className="group inline-flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer"
                title="Sort by Title"
              >
                <span>Product</span>
                {renderSortIcon("title")}
              </button>
            </th>

            <th scope="col" className="py-3.5 px-4">
              Category
            </th>

            {/* Sortable: Price */}
            <th scope="col" className="py-3.5 px-4">
              <button
                type="button"
                onClick={() => handleHeaderSort("price")}
                className="group inline-flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer"
                title="Sort by Price"
              >
                <span>Price</span>
                {renderSortIcon("price")}
              </button>
            </th>

            {/* Sortable: Rating */}
            <th scope="col" className="py-3.5 px-4">
              <button
                type="button"
                onClick={() => handleHeaderSort("rating")}
                className="group inline-flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer"
                title="Sort by Rating"
              >
                <span>Rating</span>
                {renderSortIcon("rating")}
              </button>
            </th>

            <th scope="col" className="py-3.5 px-4">
              Stock
            </th>

            <th scope="col" className="py-3.5 px-4 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onDeleteRequest={onDeleteRequest}
              isDeleting={deletingId === product.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
