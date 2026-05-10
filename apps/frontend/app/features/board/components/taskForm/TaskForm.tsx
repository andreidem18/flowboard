import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useBoardStore } from "../../stores/useBoardStore";
import { useTaskForm } from "../../hooks/useTaskForm";
import { TaskNameInput } from "./TaskNameInput";
import { TaskDescriptionInput } from "./TaskDescriptionInput";
import { UserSelector } from "./UserSelector";
import { StatusSelector } from "./StatusSelector";
import { PrioritySelector } from "./PrioritySelector";
import { TaskDeadlineInput } from "./TaskDeadlineInput";

export function TaskForm() {
  const { register, control, handleSubmit, errors, isSubmitting, onSubmit } =
    useTaskForm();

  const open = useBoardStore((s) => s.isDialogOpen);
  const onOpenChange = useBoardStore((s) => s.setDialogOpen);
  const task = useBoardStore((s) => s.selectedTask);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="inset-x-0 px-5 data-[side=right]:w-screen sm:inset-x-auto sm:px-10 data-[side=right]:sm:max-w-150">
        <SheetHeader className="pt-10">
          <SheetTitle>{task ? "Edit Task" : "Create New Task"}</SheetTitle>
          <SheetDescription>
            {task ? "Update task details" : "Add a new task to your board"}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <TaskNameInput
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
              />
              <TaskDescriptionInput
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
              />
              <UserSelector
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
              />
              <StatusSelector
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
              />
              <PrioritySelector
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
              />
              <TaskDeadlineInput
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : task
                  ? "Update Task"
                  : "Create Task"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
