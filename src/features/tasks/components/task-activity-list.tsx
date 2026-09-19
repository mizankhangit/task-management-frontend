"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "cn";
import type { TaskActivity } from "../types";

type TaskActivityListProps = {
  activities: TaskActivity[];
  title?: string;
  isLoading?: boolean;
};

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffSec = Math.max(0, Math.floor(diffMs / 1000));
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return "Just now";
    if (diffMin < 60) {
      return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    }
    if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    }

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
    });
  } catch {
    return dateString;
  }
}

function formatValue(value: unknown, field?: string): string {
  if (value === null || value === undefined || value === "") {
    return "None";
  }

  const str = String(value).trim();

  // Status mapping
  if (str === "todo") return "Todo";
  if (str === "in_progress") return "In Progress";
  if (str === "done") return "Done";

  // Priority mapping
  if (str === "low") return "Low";
  if (str === "medium") return "Medium";
  if (str === "high") return "High";

  // Capitalize single words if plain lowercase
  if (/^[a-z]+$/.test(str)) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return str;
}

function getActionLabel(action: TaskActivity["action"]): string {
  switch (action) {
    case "status_changed":
      return "changed status";
    case "priority_changed":
      return "changed priority";
    case "due_date_changed":
      return "changed due date";
    case "created":
      return "created task";
    case "updated":
      return "updated task";
    case "deleted":
      return "deleted task";
    case "restored":
      return "restored task";
    default:
      return String(action).replace(/_/g, " ");
  }
}

function getDotColor(action: TaskActivity["action"]): string {
  switch (action) {
    case "status_changed":
      return "text-blue-500";
    case "priority_changed":
      return "text-amber-500";
    case "created":
      return "text-emerald-500";
    case "due_date_changed":
      return "text-purple-500";
    case "restored":
      return "text-teal-500";
    case "deleted":
      return "text-rose-500";
    default:
      return "text-primary";
  }
}

export function TaskActivityList({
  activities,
  title = "Activity",
  isLoading = false,
}: TaskActivityListProps) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-lg font-semibold tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            Loading activity...
          </p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activity yet.
          </p>
        ) : (
          <div className="space-y-5">
            {activities.map((activity) => {
              const userName = activity.user
                ? activity.user.charAt(0).toUpperCase() + activity.user.slice(1)
                : "Someone";
              const actionLabel = getActionLabel(activity.action);

              const hasDiff =
                activity.old_value !== null &&
                activity.old_value !== undefined &&
                activity.new_value !== null &&
                activity.new_value !== undefined;

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-2.5 text-sm"
                >
                  <span
                    className={cn(
                      "text-base leading-none select-none font-bold mt-0.5",
                      getDotColor(activity.action)
                    )}
                    aria-hidden="true"
                  >
                    ●
                  </span>

                  <div className="flex-1 space-y-1 leading-snug">
                    {/* Header: User changed status */}
                    <div className="flex flex-wrap items-baseline gap-x-1.5 font-medium">
                      <span className="text-foreground font-semibold">
                        {userName}
                      </span>
                      <span className="text-muted-foreground font-normal">
                        {actionLabel}
                      </span>
                      {activity.task_title && (
                        <span className="text-xs text-muted-foreground/75 font-normal">
                          &bull; {activity.task_title}
                        </span>
                      )}
                    </div>

                    {/* Transition: Todo → In Progress */}
                    {hasDiff ? (
                      <div className="text-sm font-medium text-foreground/90 pl-0.5">
                        <span>
                          {formatValue(activity.old_value, activity.field)}
                        </span>
                        <span className="mx-2 text-muted-foreground font-normal">
                          →
                        </span>
                        <span>
                          {formatValue(activity.new_value, activity.field)}
                        </span>
                      </div>
                    ) : activity.new_value ? (
                      <div className="text-sm font-medium text-foreground/90 pl-0.5">
                        {formatValue(activity.new_value, activity.field)}
                      </div>
                    ) : null}

                    {/* Timestamp: 10 minutes ago */}
                    <div className="text-xs text-muted-foreground pl-0.5">
                      {formatRelativeTime(activity.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}