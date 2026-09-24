import React from "react";
import { Product } from "@/types";
import ProductRow from "./ProductRow";

interface ProductTableProps {
  products: Product[];
  onDeleteRequest?: (id: number, title: string) => void;
  deletingId?: number | null;
}

export default function ProductTable({
  products,
  onDeleteRequest,
  deletingId,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-border shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <th scope="col" className="py-3.5 px-4 w-16">
              Image
            </th>
            <th scope="col" className="py-3.5 px-4">
              Product
            </th>
            <th scope="col" className="py-3.5 px-4">
              Category
            </th>
            <th scope="col" className="py-3.5 px-4">
              Price
            </th>
            <th scope="col" className="py-3.5 px-4">
              Rating
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
