"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Textarea,
} from "@/components/ui/textarea";

import {
  Label,
} from "@/components/ui/label";

import {
  projectSchema,
  ProjectFormValues,
} from "../schemas";

import {
  useCreateProject,
  useUpdateProject,
} from "../hooks";

import { Project } from "../types";

type Props = {
  project?: Project;
  onSuccess?: () => void;
};

export function ProjectForm({
  project,
  onSuccess,
}: Props) {
  const isEditing = !!project;

  const createMutation =
    useCreateProject();

  const updateMutation =
    useUpdateProject();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),

    defaultValues: {
      name: project?.name ?? "",
      description:
        project?.description ?? "",
    },
  });

  const onSubmit = async (
    data: ProjectFormValues
  ) => {
    try {
      if (project) {
        await updateMutation.mutateAsync({
          id: project.id,
          payload: {
            name: data.name,
            description:
              data.description ?? "",
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          description:
            data.description ?? "",
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          Project name
        </Label>

        <Input
          id="name"
          placeholder="My project"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          placeholder="Describe your project..."
          rows={5}
          {...register("description")}
        />

        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
      >
        {isPending
          ? "Saving..."
          : isEditing
            ? "Update project"
            : "Create project"}
      </Button>
    </form>
  );
}