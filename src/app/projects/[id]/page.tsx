"use client";

import { useState } from "react";

import type { Task, TaskPriority, TaskStatus } from "@/features/tasks/types";

import { EditTaskDialog } from "@/features/tasks/components/edit-task-dialog";
import { DeleteTaskDialog } from "@/features/tasks/components/delete-task-dialog";
import { useParams } from "next/navigation";
import { useProject } from "@/features/projects/hooks";
import {
  useProjectTasks,
  useProjectTaskStatistics,
  useProjectActivities,
} from "@/features/tasks/hooks";

import { CreateTaskDialog } from "@/features/tasks/components/create-task-dialog";
import { TaskList } from "@/features/tasks/components/task-list";
import { useDebounce } from "@/hooks/use-debounce";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import {
  useUpdateTaskStatus,
} from "@/features/tasks/hooks";
import { TaskActivityList } from "@/features/tasks/components/task-activity-list";
import { ProjectMembersDialog } from "@/features/projects/components/project-members-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


export default function ProjectDetailsPage() {
  const params = useParams();

  const projectId = Number(params.id);
  const [membersOpen, setMembersOpen] = useState(false);

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
  } = useProject(projectId);

  const [search, setSearch] =
    useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  const [status, setStatus] =
    useState<"all" | TaskStatus>("all");

  const [priority, setPriority] =
    useState<"all" | TaskPriority>("all");

  const [completed, setCompleted] =
    useState<"all" | "true" | "false">("all");

  const [ordering, setOrdering] =
    useState("-created_at");


  const taskParams = {
    search:
      debouncedSearch || undefined,

    status:
      status === "all"
        ? undefined
        : status,

    priority:
      priority === "all"
        ? undefined
        : priority,

    completed:
      completed === "all"
        ? undefined
        : completed === "true",

    ordering,
  };



  const {
    data: taskData,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useProjectTasks(
    projectId,
    taskParams
  );

  const {
    data: statsData,
    isLoading: statsLoading,
  } = useProjectTaskStatistics(projectId);

  const {
    data: activitiesData,
    isLoading: activitiesLoading,
  } = useProjectActivities(projectId);


  const updateStatusMutation =
    useUpdateTaskStatus();

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  if (projectLoading || tasksLoading || statsLoading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (projectError || tasksError) {
    return (
      <div className="p-6">
        Failed to load project.
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        Project not found.
      </div>
    );
  }


  const tasks = taskData?.results ?? [];

  const stats = statsData ?? {
    total: 0,
    todo: 0,
    in_progress: 0,
    done: 0,
    high_priority: 0,
    overdue: 0,
  };

  return (
    <main className="container mx-auto space-y-8 p-6">
      {/* Project Header */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              {project.name}
            </h1>
            {project.current_user_role && (
              <Badge
                variant="outline"
                className={`uppercase text-xs font-semibold ${
                  project.current_user_role === "owner"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                    : project.current_user_role === "admin"
                    ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
                    : project.current_user_role === "member"
                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                    : "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30"
                }`}
              >
                {project.current_user_role}
              </Badge>
            )}
          </div>

          {project.description && (
            <p className="mt-2 text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setMembersOpen(true)}
          >
            Team Members
          </Button>
        </div>
      </section>

      {/* Statistics */}

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Total
          </p>

          <p className="mt-2 text-2xl font-bold">
            {stats.total}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Todo
          </p>

          <p className="mt-2 text-2xl font-bold">
            {stats.todo}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            In Progress
          </p>

          <p className="mt-2 text-2xl font-bold">
            {stats.in_progress}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Done
          </p>

          <p className="mt-2 text-2xl font-bold">
            {stats.done}
          </p>
        </div>
      </section>

      {/* Tasks */}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Tasks
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage tasks for this project.
            </p>
          </div>

          {project.current_user_role !== "viewer" &&
            project.user_permissions?.can_create_task !== false && (
              <CreateTaskDialog projectId={projectId} />
            )}
        </div>

        <TaskFilters
          search={search}
          status={status}
          priority={priority}
          completed={completed}
          ordering={ordering}
          onSearchChange={(value) => {
            setSearch(value);
          }}
          onStatusChange={(value) => {
            setStatus(value);
          }}
          onPriorityChange={(value) => {
            setPriority(value);
          }}
          onCompletedChange={(value) => {
            setCompleted(value);
          }}
          onOrderingChange={(value) => {
            setOrdering(value);
          }}
        />

        <TaskList
          tasks={tasks}
          onEdit={(task) => {
            setSelectedTask(task);
            setEditOpen(true);
          }}
          onDelete={(task) => {
            setSelectedTask(task);
            setDeleteOpen(true);
          }}

          onStatusChange={(task, status) => {
            updateStatusMutation.mutate({
              id: task.id,
              status,
            });
          }}
        />
      </section>

      <TaskActivityList
        activities={activitiesData ?? []}
        isLoading={activitiesLoading}
      />

      {/* Dialogs */}

      <EditTaskDialog
        task={selectedTask}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) {
            setSelectedTask(null);
          }
        }}
      />

      <DeleteTaskDialog
        task={selectedTask}
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) {
            setSelectedTask(null);
          }
        }}
      />

      <ProjectMembersDialog
        project={project}
        open={membersOpen}
        onOpenChange={setMembersOpen}
      />
    </main>
  );
}