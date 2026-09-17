"use client";

import { ReactNode, useEffect } from "react";

import { useAuthStore } from "./store";
import { getCurrentUser } from "./api";

type Props = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: Props) {
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  const setAuth = useAuthStore(
    (state) => state.setAuth
  );

  const refreshToken = useAuthStore(
    (state) => state.refreshToken
  );

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      return;
    }

    getCurrentUser(accessToken)
      .then((user) => {
        setAuth(
          user,
          accessToken,
          refreshToken
        );
      })
      .catch(() => {
        useAuthStore
          .getState()
          .logout();
      });
  }, [
    accessToken,
    refreshToken,
    setAuth,
  ]);

  return children;
}