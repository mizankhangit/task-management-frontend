import { api } from "@/lib/api";

import type {
  CreateProjectPayload,
  PaginatedResponse,
  Project,
  ProjectQueryParams,
  UpdateProjectPayload,
} from "./types";

export async function getProjects(
  params?: ProjectQueryParams
) {
  const response = await api.get<
    PaginatedResponse<Project>
  >("/projects/", {
    params,
  });

  return response.data;
}

export async function getProject(id: number) {
  const response = await api.get<Project>(
    `/projects/${id}/`
  );

  return response.data;
}

export async function createProject(
  payload: CreateProjectPayload
) {
  const response = await api.post<Project>(
    "/projects/",
    payload
  );

  return response.data;
}

export async function updateProject(
  id: number,
  payload: UpdateProjectPayload
) {
  const response = await api.patch<Project>(
    `/projects/${id}/`,
    payload
  );

  return response.data;
}

export async function deleteProject(id: number) {
  await api.delete(`/projects/${id}/`);
}