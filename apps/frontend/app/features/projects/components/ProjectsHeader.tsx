import type { Project } from "@repo/shared";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ProjectForm } from "./ProjectForm";

export const ProjectsHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const openCreateDialog = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold">Projects</h1>
        <p className="mt-1 text-slate-600">Manage your project portfolio</p>
      </div>
      <Button
        onClick={openCreateDialog}
        className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Project
      </Button>
      <ProjectForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={editingProject}
      />
    </div>
  );
};
