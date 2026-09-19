import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addProjectMember,
  createProject,
  deleteProject,
  getProject,
  getProjectMembers,
  getProjects,
  leaveProject,
  removeProjectMember,
  searchUsers,
  transferProjectOwnership,
  updateProject,
  updateProjectMemberRole,
} from "./api";

import type {
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectQueryParams,
  Project,
} from "./types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";

export function useProjects(
  params?: ProjectQueryParams
) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => getProjects(params),
    placeholderData: keepPreviousData,
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProject(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      createProject(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateProjectPayload;
    }) => updateProject(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      deleteProject(id),

    onMutate: async (projectId) => {
      await queryClient.cancelQueries({
        queryKey: ["projects"],
      });

      const previousProjects =
        queryClient.getQueriesData({
          queryKey: ["projects"],
        });

      queryClient.setQueriesData(
        { queryKey: ["projects"] },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            results: old.results.filter(
              (project: Project) =>
                project.id !== projectId
            ),
            count: Math.max(
              0,
              old.count - 1
            ),
          };
        }
      );

      return {
        previousProjects,
      };
    },

    onError: (
      error,
      projectId,
      context
    ) => {
      if (context?.previousProjects) {
        context.previousProjects.forEach(
          ([queryKey, data]) => {
            queryClient.setQueryData(
              queryKey,
              data
            );
          }
        );
      }

      toast.error(
        getApiErrorMessage(error)
      );
    },

    onSuccess: () => {
      toast.success(
        "Project deleted successfully."
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}

export function useProjectMembers(projectId: number) {
  return useQuery({
    queryKey: ["projects", projectId, "members"],
    queryFn: () => getProjectMembers(projectId),
    enabled: Number.isInteger(projectId) && projectId > 0,
  });
}

export function useAddProjectMember(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { user: number; role: any }) =>
      addProjectMember(projectId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "members"],
      });
      toast.success("Member added successfully.");
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateProjectMemberRole(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      membershipId,
      role,
    }: {
      membershipId: number;
      role: any;
    }) => updateProjectMemberRole(membershipId, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "members"],
      });
      toast.success("Member role updated.");
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRemoveProjectMember(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (membershipId: number) =>
      removeProjectMember(membershipId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "members"],
      });
      toast.success("Member removed successfully.");
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useLeaveProject(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => leaveProject(projectId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      toast.success(data.detail || "You have left the project.");
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useTransferProjectOwnership(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) =>
      transferProjectOwnership(projectId, userId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "members"],
      });
      toast.success(data.detail || "Ownership transferred successfully.");
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => searchUsers(query),
    enabled: query.trim().length >= 2,
    staleTime: 30000,
  });
}