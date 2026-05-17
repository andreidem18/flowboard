import type { GetAllTasks, TaskStatus } from "@repo/shared";
import { TaskColumn } from "./TaskColumn";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { useMoveTaskMutation } from "../mutations";
import { useProjectIdParam } from "../hooks";
import { queryClient } from "~/providers/ReactQueryClientProvider";
import { TASKS_QUERY_KEY } from "../queries";

export const Tasks = () => {
  const projectId = useProjectIdParam();
  const { mutate: moveTask } = useMoveTaskMutation();
  const projectIdNum = projectId ? Number(projectId) : undefined;

  return (
    <div className="flex-1 overflow-auto p-6">
      <DragDropProvider
        onDragEnd={(event) => {
          const { operation, canceled } = event;
          if (canceled) return;

          const { source, target } = operation;
          if (!source || !target || !isSortable(source)) return;

          const fromIndex = source.initialIndex;
          const sourceStatus = source.initialGroup as TaskStatus | undefined;
          if (!sourceStatus) return;

          let targetStatus: TaskStatus;
          let toIndex: number;

          if (isSortable(target)) {
            targetStatus = target.group as TaskStatus;
            toIndex = target.index;
          } else {
            targetStatus = target.id as TaskStatus;
            const targetTasks =
              queryClient.getQueryData<GetAllTasks>([
                TASKS_QUERY_KEY,
                projectIdNum,
                targetStatus,
                undefined,
              ]) ?? [];
            toIndex = targetTasks.length;
          }

          if (sourceStatus === targetStatus && fromIndex === toIndex) return;

          moveTask({
            fromIndex,
            toIndex,
            sourceStatus,
            targetStatus,
            projectId: projectIdNum,
          });
        }}
      >
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {columns.map(({ status, label }) => (
            <TaskColumn key={status} status={status} label={label} />
          ))}
        </div>
      </DragDropProvider>
    </div>
  );
};

const columns: { status: TaskStatus; label: string }[] = [
  { status: "NEW", label: "New" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "STOPPED", label: "Stopped" },
  { status: "FINISHED", label: "Finished" },
];
