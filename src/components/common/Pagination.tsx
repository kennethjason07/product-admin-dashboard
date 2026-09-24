import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ALLOWED_PAGE_SIZES } from "@/utils/url";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  disabled?: boolean;
}

export default function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Compute "Showing X–Y of Z"
  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safeCurrentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      {/* Showing X–Y of Z text */}
      <div className="text-xs sm:text-sm text-text-secondary order-2 sm:order-1 text-center sm:text-left">
        {totalItems > 0 ? (
          <>
            Showing <span className="font-semibold text-gray-900">{startItem}</span>
            {"–"}
            <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
            <span className="font-semibold text-gray-900">{totalItems}</span> products
          </>
        ) : (
          "No products to display"
        )}
      </div>

      {/* Controls: Page numbers + Page size */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 order-1 sm:order-2">
        {/* Page-size selector */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <label htmlFor="page-size-select" className="font-medium whitespace-nowrap">
            Per page:
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            disabled={disabled}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer disabled:opacity-50"
          >
            {ALLOWED_PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation buttons */}
        <nav
          className="inline-flex items-center gap-1 bg-white p-1 rounded-xl border border-border shadow-2xs"
          aria-label="Pagination Navigation"
        >
          {/* Previous Page */}
          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage <= 1 || disabled}
            aria-label="Previous page"
            className="p-1.5 rounded-lg text-text-secondary hover:text-gray-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-secondary transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pages.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 py-1 text-xs text-text-muted select-none"
                  >
                    …
                  </span>
                );
              }

              const isCurrent = page === safeCurrentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  disabled={disabled}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`min-w-[32px] h-8 px-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isCurrent
                      ? "bg-primary text-white shadow-2xs"
                      : "text-text-secondary hover:text-gray-900 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage >= totalPages || disabled}
            aria-label="Next page"
            className="p-1.5 rounded-lg text-text-secondary hover:text-gray-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-secondary transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </div>
  );
}
