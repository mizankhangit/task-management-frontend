import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getProjectActivities,
  getProjectTasks,
  getProjectTaskStatistics,
  getTask,
  getTaskActivities,
  getTasks,
  getTrashTasks,
  permanentlyDeleteTask,
  restoreTask,
  updateTask,
  updateTaskStatus,
} from "./api";

import type {
  CreateTaskPayload,
  TaskQueryParams,
  TaskStatus,
  UpdateTaskPayload,
} from "./types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
export function useTasks(params?: TaskQueryParams) {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => getTasks(params),
  });
}

export function useProjectTasks(
  projectId: number,
  params?: TaskQueryParams
) {
  return useQuery({
    queryKey: ["projects", projectId, "tasks", params],
    queryFn: () => getProjectTasks(projectId, params),
    enabled: !!projectId,
  });
}

export function useCreateTask() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateTaskPayload
    ) => createTask(payload),

    onSuccess: (task) => {
      toast.success("Task created successfully.");

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "tasks",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "task-statistics",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "activities",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateTaskPayload;
    }) =>
      updateTask(id, payload),

    onSuccess: (task) => {
      toast.success("Task updated successfully.");

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "tasks",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "task-statistics",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "activities",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", task.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", task.id, "activities"],
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      task: {
        id: number;
        projectId: number;
      }
    ) =>
      deleteTask(task.id),

    onSuccess: (_, variables) => {
      toast.success("Task deleted successfully.");

      if (variables?.projectId) {
        const pId = Number(variables.projectId);
        queryClient.invalidateQueries({
          queryKey: [
            "projects",
            pId,
            "tasks",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "projects",
            pId,
            "task-statistics",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "projects",
            pId,
            "activities",
          ],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", "trash"],
      });
    },
  });
}

export function useProjectTaskStatistics(
  projectId: number
) {
  return useQuery({
    queryKey: [
      "projects",
      projectId,
      "task-statistics",
    ],

    queryFn: () =>
      getProjectTaskStatistics(projectId),

    enabled: !!projectId,
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: TaskStatus;
    }) =>
      updateTaskStatus(id, status),

    onSuccess: (task) => {
      toast.success("Task status updated.");

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "tasks",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "task-statistics",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "activities",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", task.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", task.id, "activities"],
      });
    },
  });
}

export function useTaskActivities(
  taskId: number
) {
  return useQuery({
    queryKey: [
      "tasks",
      taskId,
      "activities",
    ],

    queryFn: () =>
      getTaskActivities(taskId),

    enabled: !!taskId,
  });
}

export function useProjectActivities(
  projectId: number
) {
  return useQuery({
    queryKey: [
      "projects",
      projectId,
      "activities",
    ],

    queryFn: () =>
      getProjectActivities(projectId),

    enabled: !!projectId,
  });
}

export function useRestoreTask() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      restoreTask(id),

    onSuccess: (task) => {
      toast.success(
        "Task restored successfully."
      );

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "tasks",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "task-statistics",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          task.project,
          "activities",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", "trash"],
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(error)
      );
    },
  });
}

export function useTrashTasks(
  page = 1
) {
  return useQuery({
    queryKey: [
      "tasks",
      "trash",
      page,
    ],

    queryFn: () =>
      getTrashTasks(page),
  });
}

export function usePermanentlyDeleteTask() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: number
    ) => permanentlyDeleteTask(id),

    onSuccess: () => {
      toast.success(
        "Task permanently deleted."
      );

      queryClient.invalidateQueries({
        queryKey: [
          "tasks",
          "trash",
        ],
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(error)
      );
    },
  });
}