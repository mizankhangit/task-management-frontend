"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { TaskForm } from "./task-form";

import { useUpdateTask } from "../hooks";

import type { Task } from "../types";
import type { TaskFormValues } from "../schemas";

type EditTaskDialogProps = {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
}: EditTaskDialogProps) {
  const updateTaskMutation = useUpdateTask();

  if (!task) {
    return null;
  }

  const handleSubmit = (
    values: TaskFormValues
  ) => {
    updateTaskMutation.mutate(
      {
        id: task.id,

        payload: {
          title: values.title,
          description: values.description ?? "",
          status: values.status,
          priority: values.priority,
          due_date: values.due_date || null,
          assignee: values.assignee ?? null,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Edit Task
          </DialogTitle>
        </DialogHeader>

        <TaskForm
          projectId={task.project}
          defaultValues={{
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            due_date: task.due_date,
            assignee: task.assignee ?? null,
          }}
          onSubmit={handleSubmit}
          isPending={updateTaskMutation.isPending}
          submitLabel="Update Task"
        />
      </DialogContent>
    </Dialog>
  );
}