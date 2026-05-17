import type { Task } from "@repo/shared";
import { Pencil, Trash2, AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { DeleteConfirmDialog } from "~/components/ui/delete-confirm-dialog";
import { useTaskCard } from "../hooks";
import { UserAvatar } from "./UserAvatar";
import { PRIORITY_COLORS } from "../constants";
import { DropIndicator } from "./DropIndicator";

interface Props {
  task: Task;
  projectId: number;
  index: number;
}

export const TaskCard = ({ task, projectId, index }: Props) => {
  const {
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    isPending,
    isOverdue,
    handleConfirmDelete,
    selectCard,
    cardRef,
    isDropTarget,
  } = useTaskCard({ task, projectId, index });

  return (
    <>
      <DropIndicator isDropTarget={isDropTarget} />
      <Card className={"py-2 transition-shadow hover:shadow-md"} ref={cardRef}>
        <CardHeader className="px-3 pt-1 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium">{task.name}</h4>
            <div className="flex shrink-0 gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  selectCard(task);
                }}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirmOpen(true);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {task.description && (
            <p className="mt-1 text-xs text-slate-600">{task.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-2 px-3">
          <div className="flex flex-col justify-between gap-2">
            <div className="flex gap-2">
              <Badge className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </Badge>
              {/* TODO: fetch color from backend */}
              <Badge variant="outline" className="text-xs">
                <div
                  className="mr-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: task.project.color || "#64748b" }}
                />
                {task.project.name}
              </Badge>
            </div>
            <div className="flex items-end justify-between">
              {task.deadline ? (
                <div
                  className={`flex items-center gap-1 text-xs ${
                    isOverdue ? "text-red-600" : "text-slate-600"
                  }`}
                >
                  {isOverdue && <AlertCircle className="h-3 w-3" />}
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.deadline), "MMM d, yyyy")}</span>
                </div>
              ) : (
                <div />
              )}
              <div className="flex h-fit items-center gap-2 pt-1">
                <span className="text-xs text-slate-600">{task.user.name}</span>
                <UserAvatar userName={task.user.name} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        description="This will permanently delete this task. This action cannot be undone."
        isLoading={isPending}
      />
    </>
  );
};
