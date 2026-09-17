import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "./api";

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}

export function useCurrentUser(
  accessToken: string | null
) {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => getCurrentUser(accessToken!),
    enabled: !!accessToken,
  });
}