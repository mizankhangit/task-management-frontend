"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { LoginPayload } from "@/features/auth/types";
import { useLogin } from "@/features/auth/hooks";
import { useAuthStore } from "@/features/auth/store";
import { getCurrentUser } from "@/features/auth/api";

export default function LoginPage() {
  const router = useRouter();

  const setAuth = useAuthStore(
    (state) => state.setAuth
  );

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();

  const onSubmit = async (data: LoginPayload) => {
    try {
      const tokens =
        await loginMutation.mutateAsync(data);

      const user = await getCurrentUser(
        tokens.access
      );

      setAuth(
        user,
        tokens.access,
        tokens.refresh
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Login
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <input
            {...register("username", {
              required: "Username is required",
            })}
            placeholder="Username"
            className="w-full rounded-md border p-3"
          />

          {errors.username && (
            <p className="text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...register("password", {
              required: "Password is required",
            })}
            type="password"
            placeholder="Password"
            className="w-full rounded-md border p-3"
          />

          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-md bg-black p-3 text-white"
        >
          {loginMutation.isPending
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}