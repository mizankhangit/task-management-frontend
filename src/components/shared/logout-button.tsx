"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/store";

export function LogoutButton() {
  const router = useRouter();

  const logout = useAuthStore(
    (state) => state.logout
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border px-4 py-2"
    >
      Logout
    </button>
  );
}