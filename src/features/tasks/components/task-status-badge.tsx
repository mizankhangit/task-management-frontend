import { Badge } from "@/components/ui/badge";

import type { TaskStatus } from "../types";

type TaskStatusBadgeProps = {
  status: TaskStatus;
};

const statusConfig = {
  todo: {
    label: "Todo",
    variant: "secondary" as const,
  },

  in_progress: {
    label: "In Progress",
    variant: "default" as const,
  },

  done: {
    label: "Done",
    variant: "outline" as const,
  },
};

export function TaskStatusBadge({
  status,
}: TaskStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}