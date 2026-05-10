import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {task ? "Update task details" : "Add a new task to your board"}
          </DialogDescription>
        </DialogHeader>
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
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
