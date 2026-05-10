import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Task, TaskStatus } from "@repo/shared";

interface BoardStore {
  selectedTask: Task | null;
  isDialogOpen: boolean;
  selectedStatus: TaskStatus | null;

  setSelectedTask: (task: Task | null) => void;
  setDialogOpen: (open: boolean) => void;
  setSelectedStatus: (status: TaskStatus | null) => void;
  resetFormState: () => void;
}

export const useBoardStore = create<BoardStore>()(
  devtools(
    (set) => ({
      selectedTask: null,
      selectedStatus: null,
      isDialogOpen: false,

      setSelectedTask: (task) =>
        set({ selectedTask: task, isDialogOpen: true }),

      setDialogOpen: (open) => set({ isDialogOpen: open }),

      setSelectedStatus: (status) =>
        set({ selectedStatus: status, isDialogOpen: true }),

      resetFormState: () =>
        set({
          selectedTask: null,
          selectedStatus: null,
          isDialogOpen: false,
        }),
    }),
    { name: "projects-store" }
  )
);
