import {
  ProjectForm,
  ProjectsHeader,
  ProjectsList,
} from "~/features/projects/components";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <ProjectsHeader />
      <ProjectsList />
      <ProjectForm />
    </div>
  );
}
