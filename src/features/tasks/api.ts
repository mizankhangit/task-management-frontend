import { api } from "@/lib/api";
import type {
  CreateTaskPayload,
  PaginatedResponse,
  Task,
  TaskActivity,
  TaskQueryParams,
  TaskStatistics,
  TaskStatus,
  UpdateTaskPayload,
} from "./types";

export async function getTasks(
  params?: TaskQueryParams
): Promise<PaginatedResponse<Task>> {
  const response = await api.get<PaginatedResponse<Task>>("/tasks/", {
    params,
  });

  return response.data;
}

export async function getTask(id: number): Promise<Task> {
  const response = await api.get<Task>(`/tasks/${id}/`);
  return response.data;
}

export async function createTask(
  payload: CreateTaskPayload
): Promise<Task> {
  const response = await api.post<Task>("/tasks/", payload);
  return response.data;
}

export async function updateTask(
  id: number,
  payload: UpdateTaskPayload
): Promise<Task> {
  const response = await api.patch<Task>(`/tasks/${id}/`, payload);
  return response.data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}/`);
}

// Project-specific task endpoints
export async function getProjectTasks(
  projectId: number,
  params?: TaskQueryParams
): Promise<PaginatedResponse<Task>> {
  const response = await api.get<PaginatedResponse<Task>>(
    `/projects/${projectId}/tasks/`,
    { params }
  );
  return response.data;
}

export async function createProjectTask(
  projectId: number,
  payload: Omit<CreateTaskPayload, "project">
): Promise<Task> {
  const response = await api.post<Task>(
    `/projects/${projectId}/tasks/`,
    payload
  );
  return response.data;
}


export async function getProjectTaskStatistics(
  projectId: number
) {
  const response = await api.get<TaskStatistics>(
    `/projects/${projectId}/task-statistics/`
  );

  return response.data;
}

export async function updateTaskStatus(
  id: number,
  status: TaskStatus
) {
  const response = await api.patch<Task>(
    `/tasks/${id}/`,
    {
      status,
      completed: status === "done",
    }
  );

  return response.data;
}

export async function getTaskActivities(
  taskId: number
) {
  const response = await api.get<
    TaskActivity[]
  >(`/tasks/${taskId}/activities/`);

  return response.data;
}

export async function getProjectActivities(
  projectId: number
) {
  const response = await api.get<
    TaskActivity[]
  >(`/projects/${projectId}/activities/`);

  return response.data;
}

export async function restoreTask(
  id: number
) {
  const response = await api.post<Task>(
    `/tasks/${id}/restore/`
  );

  return response.data;
}

export async function getTrashTasks(
  page = 1
) {
  const response =
    await api.get<
      PaginatedResponse<Task>
    >("/tasks/trash/", {
      params: {
        page,
      },
    });

  return response.data;
}

export async function permanentlyDeleteTask(
  id: number
) {
  await api.delete(
    `/tasks/${id}/permanent/`
  );
}