import { api } from "@/lib/api";

import type {
  CreateProjectPayload,
  PaginatedResponse,
  Project,
  ProjectMembership,
  ProjectQueryParams,
  ProjectRole,
  UpdateProjectPayload,
  UserSearchResult,
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

export async function getProjectMembers(projectId: number) {
  const response = await api.get<ProjectMembership[]>(
    `/projects/${projectId}/members/`
  );
  return response.data;
}

export async function addProjectMember(
  projectId: number,
  payload: { user: number; role: ProjectRole }
) {
  const response = await api.post<ProjectMembership>(
    `/projects/${projectId}/members/`,
    payload
  );
  return response.data;
}

export async function updateProjectMemberRole(
  membershipId: number,
  role: ProjectRole
) {
  const response = await api.patch<ProjectMembership>(
    `/project-memberships/${membershipId}/`,
    { role }
  );
  return response.data;
}

export async function removeProjectMember(membershipId: number) {
  await api.delete(`/project-memberships/${membershipId}/`);
}

export async function leaveProject(projectId: number) {
  const response = await api.post<{ detail: string }>(
    `/projects/${projectId}/leave/`
  );
  return response.data;
}

export async function transferProjectOwnership(
  projectId: number,
  userId: number
) {
  const response = await api.post<{ detail: string }>(
    `/projects/${projectId}/transfer-ownership/`,
    { user_id: userId }
  );
  return response.data;
}

export async function searchUsers(query: string) {
  const response = await api.get<UserSearchResult[]>("/users/", {
    params: { search: query },
  });
  return response.data;
}