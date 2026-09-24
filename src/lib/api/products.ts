import apiClient from "@/lib/axios";
import { Category, Product, ProductsResponse } from "@/types";

export interface FetchProductsOptions {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  signal?: AbortSignal;
}

/**
 * Fetch paginated list of products from DummyJSON.
 * Supports sorting via sortBy & order query parameters.
 * Endpoint: GET /products
 */
export async function getProducts(
  options: FetchProductsOptions = {}
): Promise<ProductsResponse> {
  const { limit = 10, skip = 0, sortBy, order, signal } = options;

  const params: Record<string, string | number> = {
    limit,
    skip,
  };

  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }

  const response = await apiClient.get<ProductsResponse>("/products", {
    params,
    signal,
  });

  return response.data;
}

/**
 * Search products by query keyword.
 * Supports request cancellation via AbortSignal to prevent race conditions.
 * Endpoint: GET /products/search?q={query}
 */
export async function searchProducts(
  query: string,
  options: FetchProductsOptions = {}
): Promise<ProductsResponse> {
  const { limit = 10, skip = 0, sortBy, order, signal } = options;

  const params: Record<string, string | number> = {
    q: query,
    limit,
    skip,
  };

  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }

  const response = await apiClient.get<ProductsResponse>("/products/search", {
    params,
    signal,
  });

  return response.data;
}

/**
 * Fetch all available categories from DummyJSON.
 * Endpoint: GET /products/categories
 */
export async function getCategories(
  signal?: AbortSignal
): Promise<Category[]> {
  const response = await apiClient.get<Category[]>("/products/categories", {
    signal,
  });

  return response.data;
}

/**
 * Fetch products filtered by a category slug.
 * Endpoint: GET /products/category/{category}
 */
export async function getProductsByCategory(
  category: string,
  options: FetchProductsOptions = {}
): Promise<ProductsResponse> {
  const { limit = 10, skip = 0, sortBy, order, signal } = options;

  const params: Record<string, string | number> = {
    limit,
    skip,
  };

  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }

  const response = await apiClient.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(category)}`,
    {
      params,
      signal,
    }
  );

  return response.data;
}

/**
 * Fetch a single product by its numeric ID.
 * Endpoint: GET /products/{id}
 */
export async function getProductById(
  id: number | string,
  signal?: AbortSignal
): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`, {
    signal,
  });

  return response.data;
}

/**
 * Create a new product.
 * NOTE: DummyJSON simulates product creation and returns the created item with an assigned ID (e.g. 195+),
 * but will not persist it on their backend server.
 * Endpoint: POST /products/add
 */
export async function createProduct(
  productData: Partial<Product>
): Promise<Product> {
  const response = await apiClient.post<Product>("/products/add", productData);
  return response.data;
}

/**
 * Update an existing product.
 * NOTE: DummyJSON simulates product updates and returns the updated product,
 * but does not persist the change across subsequent GET requests.
 * Endpoint: PUT /products/{id}
 */
export async function updateProduct(
  id: number | string,
  productData: Partial<Product>
): Promise<Product> {
  const response = await apiClient.put<Product>(`/products/${id}`, productData);
  return response.data;
}

/**
 * Delete a product.
 * NOTE: DummyJSON simulates deletion and returns { id, isDeleted, deletedOn }.
 * Endpoint: DELETE /products/{id}
 */
export async function deleteProduct(
  id: number | string
): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> {
  const response = await apiClient.delete<{
    id: number;
    isDeleted: boolean;
    deletedOn: string;
  }>(`/products/${id}`);
  return response.data;
}
