import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useProjectsStore } from "../stores/useProjectsStore";

export const ProjectsHeader = () => {
  const { setDialogOpen, setSelectedProject } = useProjectsStore();

  const openCreateDialog = () => {
    setSelectedProject(null);
    setDialogOpen(true);
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
    </div>
  );
};
