import { useState } from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import type { TaskFormData } from "../../schemas/tasks.schema";

interface TaskDeadlineInputProps {
  control: Control<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  isSubmitting: boolean;
}

export function TaskDeadlineInput({
  control,
  errors,
  isSubmitting,
}: TaskDeadlineInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label>Deadline</Label>
      <Controller
        name="deadline"
        control={control}
        render={({ field }) => {
          const selectedDate = field.value ? parseISO(field.value) : undefined;

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {field.value
                    ? format(parseISO(field.value), "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {errors.deadline && (
        <p className="text-sm text-red-500">{errors.deadline.message}</p>
      )}
    </div>
  );
}
