"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { TaskForm } from "./task-form";
import { useCreateTask } from "../hooks";
import type { TaskFormValues } from "../schemas";

type CreateTaskDialogProps = {
  projectId: number;
};

export function CreateTaskDialog({
  projectId,
}: CreateTaskDialogProps) {
  const createTaskMutation = useCreateTask();

  const handleSubmit = (values: TaskFormValues) => {
    createTaskMutation.mutate({
      project: projectId,
      title: values.title,
      description: values.description ?? "",
      status: values.status,
      priority: values.priority,
      due_date: values.due_date || null,
      assignee: values.assignee ?? null,
    });
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            Create Task
          </Button>
        }
      />

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Create Task
          </DialogTitle>
        </DialogHeader>

        <TaskForm
          projectId={projectId}
          onSubmit={handleSubmit}
          isPending={createTaskMutation.isPending}
          submitLabel="Create Task"
        />
      </DialogContent>
    </Dialog>
  );
}