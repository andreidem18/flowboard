import type { GetTasksQuery, TaskStatus } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import { cn } from "~/lib/utils";
import { getTasksByProjectIdQueryOptions } from "../queries/getTasksByProjectIdQueryOptions";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { useBoardStore } from "../stores/useBoardStore";
import { useProjectIdParam } from "../hooks";

interface TaskColumnProps {
  status: TaskStatus;
  label: string;
}

export const TaskColumn = ({ status, label }: TaskColumnProps) => {
  const projectId = useProjectIdParam();

  const filters: GetTasksQuery = { status };
  if (projectId) filters.projectId = projectId;

  const setSelectedStatus = useBoardStore((s) => s.setSelectedStatus);

  const { data: tasks } = useQuery(getTasksByProjectIdQueryOptions(filters));

  if (!tasks) return <></>;

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border-2 transition-colors",
        statusColors[status]
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h3 className="font-semibold">{label}</h3>
          <p className="text-sm text-slate-600">{tasks.length} tasks</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedStatus(status)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 space-y-3 overflow-auto p-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} projectId={Number(projectId)} />
        ))}
        {tasks.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-400">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};

const statusColors = {
  NEW: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
  IN_PROGRESS:
    "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
  STOPPED: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
  FINISHED:
    "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
};
