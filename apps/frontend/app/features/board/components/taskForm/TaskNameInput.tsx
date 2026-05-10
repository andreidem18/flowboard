import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { TaskFormData } from "../../schemas/tasks.schema";

interface TaskNameInputProps {
  register: UseFormRegister<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  isSubmitting: boolean;
}

export function TaskNameInput({
  register,
  errors,
  isSubmitting,
}: TaskNameInputProps) {
  return (
    <div className="col-span-2 space-y-2">
      <Label htmlFor="name">Task Name</Label>
      <Input
        id="name"
        placeholder="Enter task name"
        {...register("name")}
        disabled={isSubmitting}
      />
      {errors.name && (
        <p className="text-sm text-red-500">{errors.name.message}</p>
      )}
    </div>
  );
}
