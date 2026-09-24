import React from "react";

export function TableSkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <tr key={idx} className="animate-pulse border-b border-border">
          <td className="py-3 px-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          </td>
          <td className="py-3 px-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </td>
          <td className="py-3 px-4">
            <div className="h-6 bg-gray-200 rounded-full w-20" />
          </td>
          <td className="py-3 px-4">
            <div className="h-4 bg-gray-200 rounded w-16" />
          </td>
          <td className="py-3 px-4">
            <div className="h-4 bg-gray-200 rounded w-12" />
          </td>
          <td className="py-3 px-4">
            <div className="h-4 bg-gray-200 rounded w-14" />
          </td>
          <td className="py-3 px-4 text-right">
            <div className="h-8 bg-gray-200 rounded w-20 ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function CardSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-border p-4 animate-pulse space-y-3"
        >
          <div className="w-full h-44 bg-gray-200 rounded-lg" />
          <div className="h-5 bg-gray-200 rounded w-4/5" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="h-5 bg-gray-200 rounded w-20" />
            <div className="h-8 bg-gray-200 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LoadingState({
  message = "Loading products...",
}: {
  message?: string;
}) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-text-secondary">{message}</p>
    </div>
  );
}
