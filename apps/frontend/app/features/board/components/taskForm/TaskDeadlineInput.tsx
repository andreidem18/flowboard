import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { TaskFormData } from "../../schemas/tasks.schema";

interface TaskDeadlineInputProps {
  register: UseFormRegister<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  isSubmitting: boolean;
}

export function TaskDeadlineInput({
  register,
  errors,
  isSubmitting,
}: TaskDeadlineInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="deadline">Deadline</Label>
      <Input
        id="deadline"
        type="date"
        {...register("deadline")}
        disabled={isSubmitting}
      />
      {errors.deadline && (
        <p className="text-sm text-red-500">{errors.deadline.message}</p>
      )}
    </div>
  );
}
