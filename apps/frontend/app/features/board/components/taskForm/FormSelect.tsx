import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { TaskFormData } from "../../schemas/tasks.schema";

interface FormSelectProps {
  name: keyof TaskFormData;
  label: string;
  control: Control<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  disabled?: boolean;
  placeholder?: string;
  children: React.ReactNode;
}

export function FormSelect({
  name,
  label,
  control,
  errors,
  disabled = false,
  placeholder,
  children,
}: FormSelectProps) {
  const error = errors[name];

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full" id={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>{children}</SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
