import { Controller } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useProjectForm } from "../hooks/useProjectForm";
import { useProjectsStore } from "../stores/useProjectsStore";

const colorOptions = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#06b6d4",
  "#6366f1",
  "#84cc16",
  "#f97316",
];

export function ProjectForm() {
  const { register, control, handleSubmit, errors, isSubmitting, onSubmit } =
    useProjectForm({
      onSuccess: () => {
        setDialogOpen(false);
      },
    });

  const { selectedProject, isDialogOpen, setDialogOpen, setSelectedProject } =
    useProjectsStore();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedProject(null);
    }
    setDialogOpen(isOpen);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedProject ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {selectedProject
              ? "Update project details"
              : "Add a new project to your workspace"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Project name"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Project description (optional)"
                rows={3}
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`h-8 w-8 rounded-full transition-transform ${
                          field.value === c
                            ? "scale-110 ring-2 ring-slate-400 ring-offset-2"
                            : ""
                        }`}
                        style={{ backgroundColor: c }}
                        onClick={() => field.onChange(c)}
                      />
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : selectedProject
                  ? "Update"
                  : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
