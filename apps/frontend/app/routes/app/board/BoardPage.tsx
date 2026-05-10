import { useQuery } from "@tanstack/react-query";
import { Link, Navigate } from "react-router";
import { FolderPlus } from "lucide-react";
import { getAllProjectsQueryOptions } from "~/features/projects/queries";

export default function BoardPage() {
  const { data: projects = [], isLoading } = useQuery(
    getAllProjectsQueryOptions()
  );

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-20">
        <div className="text-center">
          <FolderPlus className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-semibold">No projects yet</h2>
          <p className="mb-6 text-muted-foreground">
            Start by creating your first project
          </p>
          <Link
            to="/app/projects"
            className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-4 py-2 text-white transition-colors hover:from-blue-700 hover:to-purple-700"
          >
            Create a Project
          </Link>
        </div>
      </div>
    );
  }

  const firstProjectId = projects[0].id;
  return <Navigate to={`/app/board/${firstProjectId}`} />;
}
