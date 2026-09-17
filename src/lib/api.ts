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

api.interceptors.response.use(
	(response) => response,

	async (error: AxiosError) => {
		const originalRequest =
			error.config as InternalAxiosRequestConfig & {
				_retry?: boolean;
			};

		if (error.response?.status !== 401 || originalRequest?._retry) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		const {
			refreshToken,
			setTokens,
			logout,
		} = useAuthStore.getState();

		if (!refreshToken) {
			logout();

			return Promise.reject(error);
		}

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/refresh/`,
				{
					refresh: refreshToken,
				}
			);

			const newAccessToken =
				response.data.access;

			setTokens(newAccessToken);

			originalRequest.headers.Authorization =
				`Bearer ${newAccessToken}`;

			return api(originalRequest);
		} catch (refreshError) {
			logout();

			return Promise.reject(refreshError);
		}
	}
);