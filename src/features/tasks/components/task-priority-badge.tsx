import { Badge } from "@/components/ui/badge";

import type { TaskPriority } from "../types";

type TaskPriorityBadgeProps = {
  priority: TaskPriority;
};

const priorityConfig = {
  low: {
    label: "Low",
    variant: "outline" as const,
  },

  medium: {
    label: "Medium",
    variant: "secondary" as const,
  },

  high: {
    label: "High",
    variant: "destructive" as const,
  },
};

export function TaskPriorityBadge({
  priority,
}: TaskPriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}