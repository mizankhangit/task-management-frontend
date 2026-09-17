"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  projectSchema,
  type ProjectFormValues,
} from "../schemas";

import { useUpdateProject } from "../hooks";
import type { Project } from "../types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type EditProjectDialogProps = {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
}: EditProjectDialogProps) {
  const updateMutation = useUpdateProject();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),

    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description,
      });
    }
  }, [project, form]);

  const onSubmit = (values: ProjectFormValues) => {
    if (!project) return;

    updateMutation.mutate(
      {
        id: project.id,
        payload: values,
      },
      {
        onSuccess: () => {
          onOpenChange(false);

          toast.success(
            "Project updated successfully."
          );
        },

        onError: (error: any) => {
          toast.error(
            error.response?.data?.message ||
            "Failed to update project"
          );
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Project
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <Input
              placeholder="Project name"
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Project description"
              rows={5}
              {...form.register("description")}
            />

            {form.formState.errors.description && (
              <p className="mt-1 text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Project"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}