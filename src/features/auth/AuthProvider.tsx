"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useAuthStore } from "./store";
import { getCurrentUser } from "./api";

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const isVerifyingRef = useRef(false);

  useEffect(() => {
    const { accessToken, refreshToken, setUser, logout } =
      useAuthStore.getState();

    // If no tokens exist, user is not logged in
    if (!accessToken || !refreshToken) {
      return;
    }

    // Prevent duplicate calls
    if (isVerifyingRef.current) {
      return;
    }
    isVerifyingRef.current = true;

    // Verify session and sync user profile once on mount
    getCurrentUser()
      .then((fetchedUser) => {
        setUser(fetchedUser);
      })
      .catch((error) => {
        // If 401 and token refresh also failed
        if (error.response?.status === 401) {
          logout();
        }
      })
      .finally(() => {
        isVerifyingRef.current = false;
      });
  }, []);

  return <>{children}</>;
}