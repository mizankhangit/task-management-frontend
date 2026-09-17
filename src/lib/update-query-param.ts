"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const updateQueryParam = (
  key: string,
  value: string
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(
    searchParams.toString()
  );

  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  router.push(
    `${pathname}?${params.toString()}`
  );
};