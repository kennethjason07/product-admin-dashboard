import { Package } from "lucide-react";

export default function ProductsPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your product catalog
          </p>
        </div>
      </div>

      {/* Placeholder for product listing */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-12 text-center">
        <Package className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Product listing coming soon
        </h2>
        <p className="text-sm text-text-secondary">
          Product table, cards, search, filtering, and pagination will be
          implemented in upcoming phases.
        </p>
      </div>
    </div>
  );
}
