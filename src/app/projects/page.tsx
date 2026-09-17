"use client";

import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import { ProjectList } from "@/features/projects/components/project-list";

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Projects
              </h1>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Create, organize, and track progress across all your workspaces.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <CreateProjectDialog />
          </div>
        </div>

        {/* Project List with search, sorting, cards, and pagination */}
        <ProjectList />
      </main>
    </ProtectedRoute>
  );
}