"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, RotateCcw, Trash2, User } from "lucide-react";
import type { Task } from "../types";

type TrashTaskCardProps = {
  task: Task;
  onRestore: (task: Task) => void;
  onDeletePermanently: (task: Task) => void;
  isRestoring?: boolean;
  isDeleting?: boolean;
};

function formatDeletedDate(dateString: string | null): string {
  if (!dateString) return "Unknown";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function TrashTaskCard({
  task,
  onRestore,
  onDeletePermanently,
  isRestoring = false,
  isDeleting = false,
}: TrashTaskCardProps) {
  const deletedDate = formatDeletedDate(task.deleted_at);
  const deletedBy = task.deleted_by || "Unknown";

  return (
    <Card className="flex flex-col justify-between border-dashed hover:border-solid transition-colors">
      <CardHeader className="pb-3">
        <div className="space-y-1.5">
          <CardTitle className="text-base font-semibold tracking-tight text-foreground leading-snug">
            {task.title}
          </CardTitle>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground pb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground/70 shrink-0" />
          <span>Deleted {deletedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground/70 shrink-0" />
          <span>
            Deleted by:{" "}
            <strong className="font-medium text-foreground">
              {deletedBy}
            </strong>
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-2 pt-3 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRestore(task)}
          disabled={isRestoring || isDeleting}
          className="flex-1"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          {isRestoring ? "Restoring..." : "Restore"}
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDeletePermanently(task)}
          disabled={isRestoring || isDeleting}
          className="flex-1"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          {isDeleting ? "Deleting..." : "Delete Permanently"}
        </Button>
      </CardFooter>
    </Card>
  );
}
