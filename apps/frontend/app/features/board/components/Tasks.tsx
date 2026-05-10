import type { TaskStatus } from "@repo/shared";
import { TaskColumn } from "./TaskColumn";

export const Tasks = () => {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {columns.map(({ status, label }) => (
          <TaskColumn key={status} status={status} label={label} />
        ))}
      </div>
    </div>
  );
};

const columns: { status: TaskStatus; label: string }[] = [
  { status: "NEW", label: "New" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "STOPPED", label: "Stopped" },
  { status: "FINISHED", label: "Finished" },
];
