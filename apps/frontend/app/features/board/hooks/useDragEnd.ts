import type { DragEndEvent } from "@dnd-kit/dom";
import { useMoveTaskMutation } from "../mutations";
import { isSortable } from "@dnd-kit/dom/sortable";
import type { TaskStatus, GetAllTasks } from "@repo/shared";
import { queryClient } from "~/providers/ReactQueryClientProvider";
import { TASKS_QUERY_KEY } from "../queries";
import { useProjectIdParam } from "./useProjectIdParam";

export const useDragEnd = () => {
  const { mutate: moveTask } = useMoveTaskMutation();
  const projectId = useProjectIdParam();

  const onDragEnd = (event: DragEndEvent) => {
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
      // Empty column case: if the target is not sortable, it means we're dragging to an empty column
      targetStatus = target.id as TaskStatus;
      const targetTasks =
        queryClient.getQueryData<GetAllTasks>([
          TASKS_QUERY_KEY,
          projectId,
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
      taskId: Number(source.id),
      projectId: projectId,
    });
  };

  return { onDragEnd };
};
