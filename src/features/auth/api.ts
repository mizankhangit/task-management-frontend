import { api } from "@/lib/api";

import {
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  User,
} from "./types";

export async function registerUser(
  data: RegisterPayload
): Promise<User> {
  const response = await api.post<User>(
    "/auth/register/",
    data
  );

  return response.data;
}

export async function loginUser(
  data: LoginPayload
): Promise<AuthTokens> {
  const response = await api.post<AuthTokens>(
    "/auth/login/",
    data
  );

  return response.data;
}

export async function getCurrentUser(
  accessToken?: string
): Promise<User> {
  const response = await api.get<User>(
    "/auth/me/",
    accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined
  );

  return response.data;
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<AuthTokens> {
  const response = await api.post<AuthTokens>(
    "/auth/refresh/",
    {
      refresh: refreshToken,
    }
  );

  return response.data;
}