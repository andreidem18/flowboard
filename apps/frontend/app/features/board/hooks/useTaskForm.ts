import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { taskFormSchema, type TaskFormData } from "../schemas/tasks.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoardStore } from "../stores/useBoardStore";
import { format } from "date-fns";
import type { Task, TaskStatus } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import { getAllUsersQueryOptions } from "~/features/users/queries";

export const useTaskForm = () => {
  const { selectedTask, selectedStatus } = useBoardStore();

  const { data: allUsers } = useQuery(getAllUsersQueryOptions());

  const defaultValues = useMemo(
    () => getDefaultValues(selectedTask, selectedStatus),
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

  const onSubmit = async (/* data: TaskFormData */) => {
    // TODO: update or create
  };

  return {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    allUsers,
  };
};

const getDefaultValues = (
  selectedTask: Task | null,
  selectedStatus: TaskStatus | null
): TaskFormData => {
  if (selectedTask) {
    return {
      name: selectedTask.name,
      description: selectedTask.description || "",
      status: selectedTask.status,
      priority: selectedTask.priority,
      deadline: selectedTask.deadline
        ? format(new Date(selectedTask.deadline), "yyyy-MM-dd")
        : "",
    };
  }

  return {
    name: "",
    description: "",
    status: selectedStatus || "NEW",
    priority: "MEDIUM",
    deadline: "",
  };
};
