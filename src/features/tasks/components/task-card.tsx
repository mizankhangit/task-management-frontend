"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { TaskPriorityBadge } from "./task-priority-badge";
import { TaskStatusBadge } from "./task-status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Task, TaskStatus } from "../types";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange?: (
    task: Task,
    status: TaskStatus
  ) => void;
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="font-semibold">
              {task.title}
            </h3>

            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {task.can_edit !== false && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(task)}
              >
                Edit
              </Button>
            )}

            {task.can_delete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(task)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={task.status}
            disabled={task.can_edit === false}
            onValueChange={(value) => {
              if (value && onStatusChange) {
                onStatusChange(
                  task,
                  value as TaskStatus
                );
              }
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="todo">
                Todo
              </SelectItem>

              <SelectItem value="in_progress">
                In Progress
              </SelectItem>

              <SelectItem value="done">
                Done
              </SelectItem>
            </SelectContent>
          </Select>

          <TaskPriorityBadge
            priority={task.priority}
          />

          {task.assignee_name && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              👤 {task.assignee_name}
            </span>
          )}

          {task.due_date && (
            <span className="text-sm text-muted-foreground">
              Due: {task.due_date}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}