export type TaskStatus =
  | "todo"
  | "in_progress"
  | "done";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export type Task = {
  id: number;
  project: number;
  project_name?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assignee?: number | null;
  assignee_name?: string | null;
  can_edit?: boolean;
  can_delete?: boolean;
  completed: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTaskPayload = {
  project: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assignee?: number | null;
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  assignee?: number | null;
  completed?: boolean;
};

export type TaskQueryParams = {
  search?: string;
  project?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: number;
  assigned_to_me?: boolean;
  completed?: boolean;
  page?: number;
  ordering?: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type TaskStatistics = {
  total: number;
  todo: number;
  in_progress: number;
  done: number;
  high_priority: number;
  overdue: number;
};

export type TaskActivityAction =
  | "created"
  | "updated"
  | "status_changed"
  | "priority_changed"
  | "due_date_changed"
  | "deleted"
  | "restored";

export type TaskActivity = {
  id: number;
  task?: number;
  task_title?: string;
  user: string | null;
  action: TaskActivityAction;
  field: string;
  old_value: unknown;
  new_value: unknown;
  created_at: string;
};