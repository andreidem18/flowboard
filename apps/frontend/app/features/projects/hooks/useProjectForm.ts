import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  projectFormSchema,
  type ProjectFormData,
} from "../schemas/projects.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../mutations";
import { useProjectsStore } from "../stores/useProjectsStore";

interface Props {
  onSuccess?: () => void;
}

export const useProjectForm = ({ onSuccess }: Props) => {
  const { selectedProject, resetFormState } = useProjectsStore();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3b82f6",
    },
  });

  useEffect(() => {
    reset({
      name: selectedProject?.name || "",
      description: selectedProject?.description || "",
      color: selectedProject?.color || "#3b82f6",
    });
  }, [selectedProject, reset]);

  const { mutateAsync: createProject } = useCreateProjectMutation({
    onSuccess: () => {
      resetFormState();
      onSuccess?.();
    },
  });

  const { mutateAsync: updateProject } = useUpdateProjectMutation({
    onSuccess: () => {
      resetFormState();
      onSuccess?.();
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    if (selectedProject) {
      await updateProject({
        id: selectedProject.id,
        body: data,
      });
      return;
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
