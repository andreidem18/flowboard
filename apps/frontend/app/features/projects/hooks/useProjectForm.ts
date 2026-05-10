import { useForm } from "react-hook-form";
import {
  projectFormSchema,
  type ProjectFormData,
} from "../schemas/projects.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Project } from "@repo/shared";

interface Props {
  project?: Project | null;
  onSuccess?: () => void;
}

export const useProjectForm = ({ project, onSuccess }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      color: project?.color || "#3b82f6",
    },
  });

  const onSubmit = async (/* data: ProjectFormData */) => {
    try {
      // TODO: Conectar con mutación de crear/actualizar proyecto
      // const mutation = project
      //   ? await updateProjectMutation(project.id, data)
      //   : await createProjectMutation(data);

      toast.success(
        project
          ? "Project updated successfully"
          : "Project created successfully"
      );
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to save project");
      console.error("Error saving project:", error);
    }
  };

  return {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
};
