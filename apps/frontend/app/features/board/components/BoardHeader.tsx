import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getAllProjectsQueryOptions } from "~/features/projects/queries";

export const BoardHeader = () => {
  const { data: projects = [] } = useQuery(getAllProjectsQueryOptions());
  const navigate = useNavigate();
  const { projectId } = useParams();
  console.log({ projectId });

  return (
    <div className="flex items-center justify-between border-b bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold">Project:</h2>
        <Select
          value={projectId}
          onValueChange={(value) => navigate("/app/board/" + value)}
        >
          <SelectTrigger className="w-62.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: project.color || "#64748b" }}
                  />
                  {project.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
