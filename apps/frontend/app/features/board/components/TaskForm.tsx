import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { SelectItem } from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useBoardStore } from "../stores/useBoardStore";
import { useTaskForm } from "../hooks/useTaskForm";
import { FormSelect } from "./FormSelect";
import { UserAvatar } from "./UserAvatar";

export function TaskForm() {
  const {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    allUsers,
  } = useTaskForm();

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
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
              {/* TODO: allow update user */}
              {allUsers && (
                <FormSelect
                  name="userId"
                  label="User"
                  control={control}
                  errors={errors}
                  disabled={isSubmitting}
                >
                  {allUsers?.map((user) => (
                    <SelectItem value={user.id}>
                      <UserAvatar userName={user.name} />
                      {user.name}
                    </SelectItem>
                  ))}
                </FormSelect>
              )}
              <FormSelect
                name="status"
                label="Status"
                control={control}
                errors={errors}
                disabled={isSubmitting}
              >
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="STOPPED">Stopped</SelectItem>
                <SelectItem value="FINISHED">Finished</SelectItem>
              </FormSelect>
              <FormSelect
                name="priority"
                label="Priority"
                control={control}
                errors={errors}
                disabled={isSubmitting}
              >
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </FormSelect>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  {...register("deadline")}
                  disabled={isSubmitting}
                />
                {errors.deadline && (
                  <p className="text-sm text-red-500">
                    {errors.deadline.message}
                  </p>
                )}
              </div>
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
