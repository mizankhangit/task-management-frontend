"use client";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  TaskPriority,
  TaskStatus,
} from "../types";

type TaskFiltersProps = {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  completed: "all" | "true" | "false";
  ordering: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: TaskStatus | "all"
  ) => void;
  onPriorityChange: (
    value: TaskPriority | "all"
  ) => void;
  onCompletedChange: (
    value: "all" | "true" | "false"
  ) => void;
  onOrderingChange: (value: string) => void;
};

export function TaskFilters({
  search,
  status,
  priority,
  completed,
  ordering,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCompletedChange,
  onOrderingChange,
}: TaskFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
      />

      <Select
        value={status}
        onValueChange={(value) =>
          onStatusChange(
            value as TaskStatus | "all"
          )
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All statuses
          </SelectItem>

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

      <Select
        value={priority}
        onValueChange={(value) =>
          onPriorityChange(
            value as TaskPriority | "all"
          )
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All priorities
          </SelectItem>

          <SelectItem value="low">
            Low
          </SelectItem>

          <SelectItem value="medium">
            Medium
          </SelectItem>

          <SelectItem value="high">
            High
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={completed}
        onValueChange={(value) =>
          onCompletedChange(
            value as "all" | "true" | "false"
          )
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Completion" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All
          </SelectItem>

          <SelectItem value="true">
            Completed
          </SelectItem>

          <SelectItem value="false">
            Incomplete
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={ordering}
        onValueChange={(value) => {
          if (value) {
            onOrderingChange(value);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sort" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="-created_at">
            Newest
          </SelectItem>

          <SelectItem value="created_at">
            Oldest
          </SelectItem>

          <SelectItem value="title">
            Title A-Z
          </SelectItem>

          <SelectItem value="-title">
            Title Z-A
          </SelectItem>

          <SelectItem value="due_date">
            Due Date
          </SelectItem>

          <SelectItem value="-updated_at">
            Recently Updated
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}