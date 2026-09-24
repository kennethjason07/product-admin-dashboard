import { SortField, SortOrder, ProductQueryParams } from "@/types";

export const ALLOWED_PAGE_SIZES = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;
export const ALLOWED_SORT_FIELDS: SortField[] = ["price", "rating", "title"];
export const ALLOWED_SORT_ORDERS: SortOrder[] = ["asc", "desc"];

/**
 * Safely parse an integer from query params with bounds and default fallback.
 */
export function parseSafeInt(
  value: string | null | undefined,
  fallback: number,
  min: number = 1,
  max?: number
): number {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < min) return fallback;
  if (max !== undefined && parsed > max) return max;
  return parsed;
}

/**
 * Validates and normalizes pageSize against allowed options [10, 20, 50].
 */
export function parsePageSize(value: string | null | undefined): number {
  const parsed = parseSafeInt(value, DEFAULT_PAGE_SIZE);
  if (ALLOWED_PAGE_SIZES.includes(parsed as (typeof ALLOWED_PAGE_SIZES)[number])) {
    return parsed;
  }
  return DEFAULT_PAGE_SIZE;
}

/**
 * Parses and sanitizes all product query parameters from URLSearchParams.
 * Guarantees zero crashes on garbage/invalid inputs (e.g., ?page=abc&pageSize=9999).
 */
export function parseProductQueryParams(
  searchParams: URLSearchParams
): ProductQueryParams {
  const page = parseSafeInt(searchParams.get("page"), DEFAULT_PAGE, 1);
  const pageSize = parsePageSize(searchParams.get("pageSize"));
  const search = searchParams.get("search")?.trim() || "";
  const category = searchParams.get("category")?.trim() || "";

  const rawSort = searchParams.get("sort")?.toLowerCase() || "";
  const sort: SortField | "" = ALLOWED_SORT_FIELDS.includes(rawSort as SortField)
    ? (rawSort as SortField)
    : "";

  const rawOrder = searchParams.get("sortOrder")?.toLowerCase() || "";
  const sortOrder: SortOrder = ALLOWED_SORT_ORDERS.includes(rawOrder as SortOrder)
    ? (rawOrder as SortOrder)
    : "asc";

  return {
    page,
    pageSize,
    search,
    category,
    sort,
    sortOrder,
  };
}

/**
 * Builds a query string by updating specific keys while preserving others.
 * Omits default values to keep URLs clean and user-friendly.
 */
export function buildQueryString(
  currentParams: URLSearchParams,
  updates: Partial<Record<keyof ProductQueryParams, string | number | null>>
): string {
  const next = new URLSearchParams(currentParams.toString());

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
  }

  // Clean defaults to maintain pretty URLs
  if (next.get("page") === "1") next.delete("page");
  if (next.get("pageSize") === String(DEFAULT_PAGE_SIZE)) next.delete("pageSize");
  if (next.get("sortOrder") === "asc" && !next.get("sort")) next.delete("sortOrder");

  const qs = next.toString();
  return qs ? `?${qs}` : "";
}
