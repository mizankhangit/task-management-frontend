"use client";

import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="p-6">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2">
          You are authenticated.
        </p>
      </main>
    </ProtectedRoute>
  );
}