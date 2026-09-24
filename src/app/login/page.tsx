"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Package, Lock, User, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, isSubmitting, error, clearError } =
    useAuth();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [validationError, setValidationError] = useState<string | null>(null);

  // If already authenticated, redirect to /products
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/products");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    // Basic validation
    if (!username.trim()) {
      setValidationError("Username is required.");
      return;
    }
    if (!password.trim()) {
      setValidationError("Password is required.");
      return;
    }

    await login({ username: username.trim(), password });
  };

  const handleFillDemo = () => {
    setUsername("emilys");
    setPassword("emilyspass");
    setValidationError(null);
    clearError();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-indigo-200">
            <Package className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
          ProductHub Admin
        </h2>
        <p className="mt-1 text-center text-sm text-text-secondary">
          Sign in to access your product management dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-border sm:px-10">
          {/* Demo credentials banner */}
          <div className="mb-6 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-indigo-950">Demo Credentials:</p>
              <p className="mt-0.5 text-indigo-800">
                User: <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold">emilys</code>
                {" / "}
                Pass: <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold">emilyspass</code>
              </p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-semibold text-primary hover:text-primary-hover underline underline-offset-2 shrink-0 cursor-pointer pt-0.5"
            >
              Fill Demo
            </button>
          </div>

          {/* Error notifications */}
          {(error || validationError) && (
            <div
              className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-sm text-red-700"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-semibold">Authentication failed: </span>
                {validationError || error}
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (validationError) setValidationError(null);
                    if (error) clearError();
                  }}
                  disabled={isSubmitting}
                  placeholder="e.g. emilys"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 border border-border rounded-xl text-sm text-gray-900 placeholder-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationError) setValidationError(null);
                    if (error) clearError();
                  }}
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 border border-border rounded-xl text-sm text-gray-900 placeholder-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                id="login-submit-button"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
