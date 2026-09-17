"use client";

import { useTasks } from "@/features/tasks/hooks";

export default function TasksPage() {
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong.</div>;
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Tasks
      </h1>

      <div className="space-y-4">
        {tasks?.results?.map((task) => (
          <div
            key={task.id}
            className="rounded-lg border p-4"
          >
            <h2 className="font-semibold">
              {task.title}
            </h2>

            <p className="text-sm text-muted-foreground">
              {task.description}
            </p>

            <div className="mt-2 text-sm">
              Status: {task.status}
            </div>

            <div className="text-sm">
              Priority: {task.priority}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}