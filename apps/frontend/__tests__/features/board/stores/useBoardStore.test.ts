import { describe, expect, it, beforeEach } from "vitest";
import { useBoardStore } from "~/features/board/stores/useBoardStore";
import type { Task } from "@repo/shared";

const mockTask: Task = {
  id: 1,
  name: "Test Task",
  description: "Test description",
  priority: "HIGH",
  status: "NEW",
  deadline: null,
  projectId: 1,
  userId: "1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  finishedAt: new Date().toISOString(),
  user: {
    name: "John Doe",
  },
  project: {
    name: "Test Project",
    color: "#3b82f6",
  },
};

describe("useBoardStore", () => {
  beforeEach(() => {
    useBoardStore.setState({
      selectedTask: null,
      selectedStatus: null,
      isDialogOpen: false,
    });
  });

  it("starts with default state", () => {
    const state = useBoardStore.getState();
    expect(state.selectedTask).toBeNull();
    expect(state.selectedStatus).toBeNull();
    expect(state.isDialogOpen).toBe(false);
  });

  it("setSelectedTask sets the task and opens the dialog", () => {
    useBoardStore.getState().setSelectedTask(mockTask);
    const state = useBoardStore.getState();
    expect(state.selectedTask).toEqual(mockTask);
    expect(state.isDialogOpen).toBe(true);
  });

  it("setSelectedTask(null) clears the task and opens the dialog", () => {
    useBoardStore.getState().setSelectedTask(null);
    const state = useBoardStore.getState();
    expect(state.selectedTask).toBeNull();
    expect(state.isDialogOpen).toBe(true);
  });

  it("setDialogOpen(false) closes the dialog and resets form state", () => {
    useBoardStore.getState().setSelectedTask(mockTask);
    useBoardStore.getState().setDialogOpen(false);
    const state = useBoardStore.getState();
    expect(state.isDialogOpen).toBe(false);
    expect(state.selectedTask).toBeNull();
    expect(state.selectedStatus).toBeNull();
  });

  it("setDialogOpen(true) opens the dialog without modifying other state", () => {
    useBoardStore.getState().setSelectedTask(mockTask);
    useBoardStore.getState().setDialogOpen(false);
    useBoardStore.getState().setDialogOpen(true);
    const state = useBoardStore.getState();
    expect(state.isDialogOpen).toBe(true);
  });

  it("setSelectedStatus sets the status and opens the dialog", () => {
    useBoardStore.getState().setSelectedStatus("IN_PROGRESS");
    const state = useBoardStore.getState();
    expect(state.selectedStatus).toBe("IN_PROGRESS");
    expect(state.isDialogOpen).toBe(true);
  });

  it("setSelectedStatus(null) clears the status and opens the dialog", () => {
    useBoardStore.getState().setSelectedStatus("FINISHED");
    useBoardStore.getState().setSelectedStatus(null);
    const state = useBoardStore.getState();
    expect(state.selectedStatus).toBeNull();
    expect(state.isDialogOpen).toBe(true);
  });

  it("resetFormState clears all form state", () => {
    useBoardStore.getState().setSelectedTask(mockTask);
    useBoardStore.getState().setSelectedStatus("IN_PROGRESS");
    useBoardStore.getState().resetFormState();
    const state = useBoardStore.getState();
    expect(state.selectedTask).toBeNull();
    expect(state.selectedStatus).toBeNull();
    expect(state.isDialogOpen).toBe(false);
  });
});
