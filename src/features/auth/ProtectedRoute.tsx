"use client";

import {
  ReactNode,
  useEffect,
} from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "./store";

type Props = {
  children: ReactNode;
};

export function ProtectedRoute({
  children,
}: Props) {
  const router = useRouter();

  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  const hydrated = useAuthStore.persist?.hasHydrated();

  useEffect(() => {
    if (hydrated && !accessToken) {
      router.replace("/login");
    }
  }, [
    hydrated,
    accessToken,
    router,
  ]);

  if (!hydrated) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  return children;
}