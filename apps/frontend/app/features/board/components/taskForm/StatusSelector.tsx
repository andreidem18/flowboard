import { SelectItem } from "~/components/ui/select";
import type { Control, FieldErrors } from "react-hook-form";
import type { TaskFormData } from "../../schemas/tasks.schema";
import { FormSelect } from "./FormSelect";
import { STATUS_OPTIONS } from "../../constants";

interface StatusSelectorProps {
  control: Control<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  isSubmitting: boolean;
}

export function StatusSelector({
  control,
  errors,
  isSubmitting,
}: StatusSelectorProps) {
  return (
    <FormSelect
      name="status"
      label="Status"
      control={control}
      errors={errors}
      disabled={isSubmitting}
    >
      {STATUS_OPTIONS.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </FormSelect>
  );
}
