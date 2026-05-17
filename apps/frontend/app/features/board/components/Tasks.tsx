import type { TaskStatus } from "@repo/shared";
import { TaskColumn } from "./TaskColumn";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, isSortableOperation } from "@dnd-kit/react/sortable";
import { useMoveTaskMutation } from "../mutations";
import { useProjectIdParam } from "../hooks";

export const Tasks = () => {
  const projectId = useProjectIdParam();
  const { mutate: moveTask } = useMoveTaskMutation();

  return (
    <div className="flex-1 overflow-auto p-6">
      <DragDropProvider
        onDragEnd={(event) => {
          const { operation, canceled } = event;
          if (canceled) return;

          if (!isSortableOperation(operation)) return;
          const { source, target } = operation;
          if (!source || !target || !isSortable(source) || !isSortable(target))
            return;

          const fromIndex = source.initialIndex;
          const sourceStatus = source?.initialGroup as TaskStatus | undefined;
          if (!sourceStatus) return;

          const toIndex = target.index;
          const targetStatus = target.group as TaskStatus;

          console.log({ sourceStatus, targetStatus });
          if (sourceStatus === targetStatus && fromIndex === toIndex) return;

          moveTask({
            fromIndex,
            toIndex,
            sourceStatus,
            targetStatus,
            projectId: projectId ? Number(projectId) : undefined,
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
