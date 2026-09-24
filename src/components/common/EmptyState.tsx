import React from "react";
import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "No products found",
  description = "No products matched your criteria. Try adjusting your search or filters.",
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-12 text-center my-6 shadow-xs">
      <div className="w-14 h-14 bg-indigo-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-primary bg-primary-light hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
