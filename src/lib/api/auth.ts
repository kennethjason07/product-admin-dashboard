import apiClient from "@/lib/axios";
import { AuthResponse, LoginCredentials } from "@/types";

/**
 * Authenticates user credentials with DummyJSON auth endpoint.
 * Endpoint: POST /auth/login
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
}

/**
 * Fetches the currently authenticated user's profile using the stored access token.
 * Endpoint: GET /auth/me
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await apiClient.get<AuthResponse>("/auth/me");
  return response.data;
}
