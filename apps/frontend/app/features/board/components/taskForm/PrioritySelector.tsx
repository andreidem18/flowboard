import { SelectItem } from "~/components/ui/select";
import type { Control, FieldErrors } from "react-hook-form";
import type { TaskFormData } from "../../schemas/tasks.schema";
import { FormSelect } from "./FormSelect";
import { PRIORITY_COLORS, PRIORITY_OPTIONS } from "../../constants";
import { cn } from "~/lib/utils";

interface PrioritySelectorProps {
  control: Control<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  isSubmitting: boolean;
}

export function PrioritySelector({
  control,
  errors,
  isSubmitting,
}: PrioritySelectorProps) {
  return (
    <FormSelect
      name="priority"
      label="Priority"
      control={control}
      errors={errors}
      disabled={isSubmitting}
    >
      {PRIORITY_OPTIONS.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          <div
            className={cn(
              "size-2 rounded-full bg-red-400",
              PRIORITY_COLORS[option.value]
            )}
          />
          {option.label}
        </SelectItem>
      ))}
    </FormSelect>
  );
}
