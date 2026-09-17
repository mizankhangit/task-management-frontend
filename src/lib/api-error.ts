import axios from "axios";

type DjangoErrorResponse = {
  detail?: string;
  [key: string]: unknown;
};

export function getApiErrorMessage(
  error: unknown
): string {
  if (!axios.isAxiosError(error)) {
    return "Something went wrong.";
  }

  const data = error.response?.data as
    | DjangoErrorResponse
    | undefined;

  if (!data) {
    return "Unable to connect to the server.";
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value.length > 0) {
      return String(value[0]);
    }

    if (typeof value === "string") {
      return value;
    }
  }

  return "Something went wrong.";
}