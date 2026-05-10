import { useForm } from "react-hook-form";
import {
  projectFormSchema,
  type ProjectFormData,
} from "../schemas/projects.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProjectMutation } from "../mutations";
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

  const { mutateAsync: createProject } = useCreateProjectMutation({
    onSuccess,
  });

  const onSubmit = async (data: ProjectFormData) => {
    if (project) {
      // TODO: Conectar con mutación de actualizar proyecto
      throw new Error("Update not implemented yet");
    }

    await createProject(data);
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
