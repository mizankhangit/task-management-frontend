"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { Pagination } from "@/components/pagination";
import {
  useRestoreTask,
  useTrashTasks,
} from "@/features/tasks/hooks";
import { TrashTaskCard } from "@/features/tasks/components/trash-task-card";
import { PermanentDeleteDialog } from "@/features/tasks/components/permanent-delete-dialog";
import type { Task } from "@/features/tasks/types";

export default function TrashPage() {
  const [page, setPage] = useState(1);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [permanentDialogOpen, setPermanentDialogOpen] = useState(false);

  const { data, isLoading, isError } = useTrashTasks(page);
  const restoreMutation = useRestoreTask();

  const tasks = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const pageSize = 9;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleRestore = (task: Task) => {
    restoreMutation.mutate(task.id);
  };

  const handleOpenPermanentDelete = (task: Task) => {
    setTaskToDelete(task);
    setPermanentDialogOpen(true);
  };

  return (
    <ProtectedRoute>
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Trash2 className="h-4 w-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Trash
              </h1>
              {totalCount > 0 && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {totalCount} {totalCount === 1 ? "task" : "tasks"}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Soft deleted tasks can be restored to their projects or deleted permanently.
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Loading trash items...
          </div>
        ) : isError ? (
          <div className="flex h-64 items-center justify-center text-sm text-destructive">
            Failed to load trash items. Please try again.
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-3">
              <Trash2 className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Trash is empty
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Deleted tasks will appear here. You can restore them or permanently remove them anytime.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tasks.map((task) => (
                <TrashTaskCard
                  key={task.id}
                  task={task}
                  onRestore={handleRestore}
                  onDeletePermanently={handleOpenPermanentDelete}
                  isRestoring={
                    restoreMutation.isPending &&
                    restoreMutation.variables === task.id
                  }
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}

        {/* Permanent Delete Confirmation Dialog */}
        <PermanentDeleteDialog
          task={taskToDelete}
          open={permanentDialogOpen}
          onOpenChange={(open) => {
            setPermanentDialogOpen(open);
            if (!open) {
              setTaskToDelete(null);
            }
          }}
        />
      </main>
    </ProtectedRoute>
  );
}
