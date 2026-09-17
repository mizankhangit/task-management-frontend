"use client";

import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  Pencil,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import type { Project } from "../types";

type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const tasksCount = project.tasks_count ?? 0;
  const completedCount = project.completed_tasks_count ?? 0;
  const progressPercent =
    tasksCount > 0 ? Math.round((completedCount / tasksCount) * 100) : 0;

  const formattedDate = new Date(project.created_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      {/* Top accent gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
              <FolderKanban className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3
                className="font-semibold text-base leading-tight tracking-tight line-clamp-1 group-hover:text-primary transition-colors"
                title={project.name}
              >
                {project.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-2 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {project.description || "No description provided."}
        </p>

        {/* Task progress stats */}
        <div className="mt-4 rounded-lg bg-muted/40 p-3 border border-border/40">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <ListTodo className="h-3.5 w-3.5 text-primary" />
              <span>Tasks</span>
            </span>

            {tasksCount > 0 ? (
              <span className="flex items-center gap-1 text-xs font-semibold">
                <span className="text-foreground">{completedCount}</span>
                <span className="text-muted-foreground">/ {tasksCount}</span>
                <span className="ml-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  ({progressPercent}%)
                </span>
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground">
                No tasks yet
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3 flex items-center justify-between border-t border-border/40 bg-muted/20">
        <Link
          href={`/tasks?project=${project.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline group/link"
        >
          <span>View Tasks</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
        </Link>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => onEdit(project)}
            title="Edit project"
            aria-label="Edit project"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(project)}
            title="Delete project"
            aria-label="Delete project"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}