import axios, {
	AxiosError,
	InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/features/auth/store";

export const api = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_API_URL ||
		"http://localhost:8000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token =
		useAuthStore.getState().accessToken;

	if (token) {
		config.headers.Authorization =
			`Bearer ${token}`;
	}

	return config;
});

// Shared promise for concurrent 401 refresh calls
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
	(response) => response,

	async (error: AxiosError) => {
		const originalRequest =
			error.config as InternalAxiosRequestConfig & {
				_retry?: boolean;
			};

		const isAuthEndpoint =
			originalRequest?.url?.includes("/auth/login/") ||
			originalRequest?.url?.includes("/auth/refresh/");

		if (
			error.response?.status !== 401 ||
			originalRequest?._retry ||
			isAuthEndpoint
		) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		const { refreshToken, setTokens, logout } =
			useAuthStore.getState();

		if (!refreshToken) {
			logout();
			return Promise.reject(error);
		}

		try {
			// Reuse single refresh promise if multiple requests 401 at the same time
			if (!refreshPromise) {
				refreshPromise = (async () => {
					try {
						const response = await axios.post(
							`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/refresh/`,
							{
								refresh: refreshToken,
							}
						);

						const newAccessToken = response.data.access;
						setTokens(newAccessToken);
						return newAccessToken;
					} finally {
						refreshPromise = null;
					}
				})();
			}

			const newAccessToken = await refreshPromise;

			originalRequest.headers.Authorization =
				`Bearer ${newAccessToken}`;

			return api(originalRequest);
		} catch (refreshError) {
			logout();
			return Promise.reject(refreshError);
		}
	}
);