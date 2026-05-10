import { ProjectsList } from "~/features/projects/components";
import { ProjectsHeader } from "~/features/projects/components/ProjectsHeader";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <ProjectsHeader />
      <ProjectsList />
    </div>
  );
}
