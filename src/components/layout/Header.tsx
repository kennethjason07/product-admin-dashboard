"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Package, Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/products"
            className="flex items-center gap-2 text-primary font-bold text-xl hover:opacity-80 transition-opacity"
          >
            <Package className="w-7 h-7" />
            <span className="hidden sm:inline">ProductHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/products")
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:text-primary hover:bg-gray-50"
              }`}
            >
              Products
            </Link>
            <Link
              href="/products/new"
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              + Add Product
            </Link>
          </nav>

          {/* User area — placeholder for logout (Phase 2) */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-semibold">
              U
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/products")
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:bg-gray-50"
              }`}
            >
              Products
            </Link>
            <Link
              href="/products/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors text-center"
            >
              + Add Product
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
