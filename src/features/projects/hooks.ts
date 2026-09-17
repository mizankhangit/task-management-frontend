import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
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