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

export type { BoardStore };

export const useBoardStore = create<BoardStore>()(
  devtools(
    (set, get) => ({
      selectedTask: null,
      selectedStatus: null,
      isDialogOpen: false,

      setSelectedTask: (task) =>
        set({ selectedTask: task, isDialogOpen: true }),

      setDialogOpen: (isOpen) => {
        if (!isOpen) {
          get().resetFormState();
          return;
        }
        set({ isDialogOpen: isOpen });
      },

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
