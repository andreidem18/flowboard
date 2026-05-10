import type { Task } from "@repo/shared";
import { Pencil, Trash2, AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { DeleteConfirmDialog } from "~/components/ui/delete-confirm-dialog";
import { useTaskCard } from "../hooks";

interface Props {
  task: Task;
  projectId: number;
}

export const TaskCard = ({ task, projectId }: Props) => {
  const {
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    isPending,
    isOverdue,
    handleConfirmDelete,
  } = useTaskCard({ task, projectId });

  return (
    <>
      <Card className={`cursor-move transition-shadow hover:shadow-md`}>
        <CardHeader className="p-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium">{task.name}</h4>
            <div className="flex shrink-0 gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: edit task
                  // onEdit(task);
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
        <CardContent className="space-y-2 p-3 pt-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`text-xs ${priorityColors[task.priority]}`}>
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
          {task.deadline && (
            <div
              className={`flex items-center gap-1 text-xs ${
                isOverdue ? "text-red-600" : "text-slate-600"
              }`}
            >
              {isOverdue && <AlertCircle className="h-3 w-3" />}
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.deadline), "MMM d, yyyy")}</span>
            </div>
          )}
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

const priorityColors = {
  LOW: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  MEDIUM: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  HIGH: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
  URGENT: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
};
