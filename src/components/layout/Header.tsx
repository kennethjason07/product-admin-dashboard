"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Package, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

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
                isActive("/products") && pathname !== "/products/new"
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

          {/* User area & Logout */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2.5">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border border-border object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-semibold">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xs font-semibold text-gray-900 leading-tight">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[11px] text-text-muted leading-tight">
                    @{user.username}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              title="Sign out"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-danger hover:bg-red-50 border border-border transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
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
        <nav className="md:hidden border-t border-border bg-white px-4 py-3 space-y-2">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-semibold">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-text-muted">@{user.username}</p>
              </div>
            </div>
          )}
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/products") && pathname !== "/products/new"
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
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-red-50 transition-colors border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </nav>
      )}
    </header>
  );
}
