"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  projectSchema,
  type ProjectFormValues,
} from "../schemas";

import { useCreateProject } from "../hooks";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);

  const createMutation = useCreateProject();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),

    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        toast.success(
          "Project created successfully."
        );
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message ||
          "Failed to create project"
        );
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          form.reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button className="shadow-sm font-medium">
            <Plus className="mr-1.5 h-4 w-4" />
            Create Project
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Project
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Name */}
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

          {/* Description */}
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
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}