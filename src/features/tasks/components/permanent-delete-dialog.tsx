"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { usePermanentlyDeleteTask } from "../hooks";
import type { Task } from "../types";

type PermanentDeleteDialogProps = {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PermanentDeleteDialog({
  task,
  open,
  onOpenChange,
}: PermanentDeleteDialogProps) {
  const permanentDeleteMutation = usePermanentlyDeleteTask();

  if (!task) {
    return null;
  }

  const handleDelete = () => {
    permanentDeleteMutation.mutate(task.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Permanently delete task?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to permanently delete{" "}
            <strong>&ldquo;{task.title}&rdquo;</strong>? This action is
            irreversible and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={permanentDeleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={permanentDeleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {permanentDeleteMutation.isPending
              ? "Deleting..."
              : "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
