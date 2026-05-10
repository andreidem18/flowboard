import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { TaskFormData } from "../../schemas/tasks.schema";

interface TaskDescriptionInputProps {
  register: UseFormRegister<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  isSubmitting: boolean;
}

export function TaskDescriptionInput({
  register,
  errors,
  isSubmitting,
}: TaskDescriptionInputProps) {
  return (
    <div className="col-span-2 space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        placeholder="Task description (optional)"
        rows={3}
        {...register("description")}
        disabled={isSubmitting}
      />
      {errors.description && (
        <p className="text-sm text-red-500">{errors.description.message}</p>
      )}
    </div>
  );
}
