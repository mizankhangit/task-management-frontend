export type Project = {
  id: number;
  owner: string;
  name: string;
  description: string;
  tasks_count?: number;
  completed_tasks_count?: number;
  created_at: string;
  updated_at: string;
};

export type CreateProjectPayload = {
  name: string;
  description?: string;
};

export type UpdateProjectPayload = {
  name?: string;
  description?: string;
};

export type ProjectQueryParams = {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};