"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  FolderKanban,
  FolderPlus,
  RefreshCw,
  Search,
  SearchX,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/pagination";

import { ProjectCard } from "./project-card";
import { EditProjectDialog } from "./edit-project-dialog";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { CreateProjectDialog } from "./create-project-dialog";
import { ProjectCardSkeleton } from "./project-card-skeleton";

import { useProjects } from "../hooks";
import type { Project } from "../types";

const PAGE_SIZE = 9;

export function ProjectList() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useProjects({
    search: debouncedSearch || undefined,
    ordering,
    page,
    page_size: PAGE_SIZE,
  });

  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const handleClearSearch = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handleOrderingChange = (newOrdering: string) => {
    setOrdering(newOrdering);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search projects by name or description..."
            className="pl-9 pr-9 h-10 bg-card border-border/80 rounded-lg focus-visible:ring-primary shadow-xs"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort selector & stats */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {isFetching && !isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Updating...</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground shrink-0 cursor-pointer"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sort:</span>
            </label>

            <div className="relative">
              <select
                id="sort-select"
                value={ordering}
                onChange={(e) => handleOrderingChange(e.target.value)}
                className="h-10 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary shadow-xs cursor-pointer"
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="name">Name (A–Z)</option>
                <option value="-name">Name (Z–A)</option>
                <option value="-tasks_count">Most Tasks</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-semibold text-destructive">
            Failed to load projects
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "An unexpected error occurred."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-4"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      ) : !data?.results.length ? (
        /* Empty States */
        debouncedSearch ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
              <SearchX className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No matching projects found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
              No projects matched your search for &ldquo;{debouncedSearch}&rdquo;. Try another search term or clear the filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSearch}
              className="mt-5"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              <FolderPlus className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No projects yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
              You haven&apos;t created any projects. Get organized by creating your first project now.
            </p>
            <div className="mt-5 flex justify-center">
              <CreateProjectDialog />
            </div>
          </div>
        )
      ) : (
        /* Project Cards Grid */
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.results.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={setEditingProject}
                onDelete={setDeletingProject}
              />
            ))}
          </div>

          {/* Pagination Component */}
          {totalPages > 1 && (
            <div className="mt-8 border-t border-border/60 pt-2">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                totalItems={totalCount}
                pageSize={PAGE_SIZE}
              />
            </div>
          )}
        </>
      )}

      {/* Edit & Delete Dialogs */}
      <EditProjectDialog
        project={editingProject}
        open={!!editingProject}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProject(null);
          }
        }}
      />

      <DeleteProjectDialog
        project={deletingProject}
        open={!!deletingProject}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingProject(null);
          }
        }}
      />
    </div>
  );
}