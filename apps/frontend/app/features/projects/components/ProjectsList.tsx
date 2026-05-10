import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllProjectsQueryOptions } from "../queries";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";

export const ProjectsList = () => {
  const { data: projects, isLoading } = useQuery(getAllProjectsQueryOptions());

  // TODO: Implement skeletons
  if (isLoading) return <>loading...</>;
  if (!projects) return <></>;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color || "#64748b" }}
                  />
                  <CardTitle>{project.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    // TODO: add edit feature
                    // onClick={() => openEditDialog(project)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    // TODO: add delete feature
                    // onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {project.description && (
                <CardDescription>{project.description}</CardDescription>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-slate-500">
            No projects yet. Create your first project to get started.
          </p>
        </div>
      )}
    </>
  );
};
