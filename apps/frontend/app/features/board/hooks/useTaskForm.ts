import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { taskFormSchema, type TaskFormData } from "../schemas/tasks.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoardStore } from "../stores/useBoardStore";
import { format } from "date-fns";
import type { Task, TaskStatus, CreateTaskBody } from "@repo/shared";
import { useAuth } from "~/features/auth/hooks";
import { useCreateTaskMutation } from "../mutations";
import { useProjectIdParam } from "./useProjectIdParam";

interface Props {
  onSuccess?: () => void;
}

export const useTaskForm = ({ onSuccess }: Props = {}) => {
  const { selectedTask, selectedStatus, resetFormState } = useBoardStore();
  const projectId = useProjectIdParam();
  const { user } = useAuth();

  const defaultValues = useMemo(
    () =>
      getDefaultValues({
        selectedTask,
        selectedStatus,
        defaultUserId: user?.id,
      }),
    [selectedTask, selectedStatus]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const { mutateAsync: createTask } = useCreateTaskMutation({
    projectId: projectId || 0,
    status: selectedTask?.status || selectedStatus || undefined,
    onSuccess: () => {
      resetFormState();
      onSuccess?.();
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    if (!projectId || !data.userId) {
      throw new Error("Project ID and User ID are required");
    }

    const createTaskData: CreateTaskBody = {
      ...data,
      projectId,
      userId: data.userId,
      deadline: data.deadline
        ? new Date(data.deadline).toISOString()
        : undefined,
    };

    await createTask(createTaskData);
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

interface GetDefaultValuesParams {
  selectedTask: Task | null;
  selectedStatus: TaskStatus | null;
  defaultUserId: string | undefined;
}

const getDefaultValues = ({
  defaultUserId,
  selectedStatus,
  selectedTask,
}: GetDefaultValuesParams): TaskFormData => {
  if (selectedTask) {
    return {
      name: selectedTask.name,
      description: selectedTask.description || "",
      status: selectedTask.status,
      priority: selectedTask.priority,
      deadline: selectedTask.deadline
        ? format(new Date(selectedTask.deadline), "yyyy-MM-dd")
        : "",
      userId: selectedTask.userId,
    };
  }

  return {
    name: "",
    description: "",
    status: selectedStatus || "NEW",
    priority: "MEDIUM",
    deadline: "",
    userId: defaultUserId,
  };
};
