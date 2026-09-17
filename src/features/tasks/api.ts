import { api } from "@/lib/api";

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Task = {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  due_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export async function getTasks(): Promise<
  PaginatedResponse<Task>
> {
  const response = await api.get<
    PaginatedResponse<Task>
  >("/tasks/");

  return response.data;
}