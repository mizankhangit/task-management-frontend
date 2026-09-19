"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

import {
  taskSchema,
  type TaskFormValues,
} from "../schemas";
import { useProjectMembers } from "@/features/projects/hooks";

type TaskFormProps = {
  projectId?: number;
  defaultValues?: Partial<TaskFormValues>;

  onSubmit: (
    values: TaskFormValues
  ) => void;

  isPending?: boolean;

  submitLabel?: string;
};

export function TaskForm({
  projectId,
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Create Task",
}: TaskFormProps) {
  const { data: members } = useProjectMembers(projectId ?? 0);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),

    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      due_date: null,
      assignee: null,

      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div>
        <Input
          placeholder="Task title"
          {...form.register("title")}
        />

        {form.formState.errors.title && (
          <p className="mt-1 text-sm text-destructive">
            {
              form.formState.errors.title
                .message
            }
          </p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Task description"
          rows={5}
          {...form.register("description")}
        />

        {form.formState.errors.description && (
          <p className="mt-1 text-sm text-destructive">
            {
              form.formState.errors
                .description.message
            }
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
            )}
          />

          {form.formState.errors.status && (
            <p className="mt-1 text-sm text-destructive">
              {form.formState.errors.status.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Priority
          </label>

          <Controller
            control={form.control}
            name="priority"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>

                <SelectContent>
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
            )}
          />

          {form.formState.errors.priority && (
            <p className="mt-1 text-sm text-destructive">
              {form.formState.errors.priority.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Due date
          </label>

          <Input
            type="date"
            {...form.register("due_date")}
          />
        </div>

        {projectId && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Assignee
            </label>

            <Controller
              control={form.control}
              name="assignee"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : "unassigned"}
                  onValueChange={(val) =>
                    field.onChange(val === "unassigned" ? null : Number(val))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {members?.map((member) => (
                      <SelectItem key={member.user} value={String(member.user)}>
                        {member.username} ({member.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
      >
        {isPending
          ? "Saving..."
          : submitLabel}
      </Button>
    </form>
  );
}