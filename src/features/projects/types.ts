export type ProjectRole = "owner" | "admin" | "member" | "viewer";

export type ProjectPermissions = {
  can_view: boolean;
  can_create_task: boolean;
  can_edit_task: boolean;
  can_delete_task: boolean;
  can_assign_task: boolean;
  can_manage_members: boolean;
  can_change_roles: boolean;
  can_delete_project: boolean;
};

export type ProjectMembership = {
  id: number;
  project: number;
  project_name?: string;
  user: number;
  username: string;
  email: string;
  role: ProjectRole;
  joined_at: string;
};

export type UserSearchResult = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
};

export type Project = {
  id: number;
  owner: string;
  name: string;
  description: string;
  current_user_role?: ProjectRole;
  user_permissions?: ProjectPermissions;
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

