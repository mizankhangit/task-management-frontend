import { TaskCardSkeleton } from "./task-card-skeleton";

export function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map(
        (_, index) => (
          <TaskCardSkeleton key={index} />
        )
      )}
    </div>
  );
}