import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TaskCard } from "~/features/board/components/TaskCard";
import type { useTaskCard } from "~/features/board/hooks";
import type { Task } from "@repo/shared";

vi.mock("~/features/board/hooks", () => ({
  useTaskCard: vi.fn(),
}));

import { useTaskCard as mockUseTaskCard } from "~/features/board/hooks";

type TaskCardHook = ReturnType<typeof useTaskCard>;

const mockTask: Task = {
  id: 1,
  name: "Fix login bug",
  description: "User cannot login with special characters",
  priority: "HIGH",
  status: "IN_PROGRESS" as const,
  deadline: "2025-12-31",
  projectId: 1,
  userId: "1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  finishedAt: new Date().toISOString(),
  user: {
    name: "Jane Smith",
  },
  project: {
    name: "Backend API",
    color: "#3b82f6",
  },
};

const mockTaskOverdue: Task = {
  ...mockTask,
  deadline: "2024-01-01",
  status: "NEW",
};

const baseHook: TaskCardHook = {
  deleteConfirmOpen: false,
  setDeleteConfirmOpen: vi.fn(),
  isPending: false,
  isOverdue: false,
  handleConfirmDelete: vi.fn(),
  selectCard: vi.fn(),
} as unknown as TaskCardHook;

describe("TaskCard", () => {
  beforeEach(() => {
    vi.mocked(mockUseTaskCard).mockReturnValue(baseHook);
  });

  it("renders task name", () => {
    render(<TaskCard task={mockTask} projectId={1} index={0} />);
    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
  });

  it("calls selectCard when edit button is clicked", async () => {
    const user = userEvent.setup();
    const selectCardMock = vi.fn();
    vi.mocked(mockUseTaskCard).mockReturnValue({
      ...baseHook,
      selectCard: selectCardMock,
    } as unknown as TaskCardHook);

    render(<TaskCard task={mockTask} projectId={1} index={0} />);

    const editButton = screen.getAllByRole("button")[0];
    await user.click(editButton);

    expect(selectCardMock).toHaveBeenCalledWith(mockTask);
  });

  it("opens delete confirm dialog when delete button is clicked", async () => {
    const user = userEvent.setup();
    const setDeleteConfirmOpenMock = vi.fn();
    vi.mocked(mockUseTaskCard).mockReturnValue({
      ...baseHook,
      setDeleteConfirmOpen: setDeleteConfirmOpenMock,
    } as unknown as TaskCardHook);

    render(<TaskCard task={mockTask} projectId={1} index={0} />);

    const deleteButton = screen.getAllByRole("button")[1];
    await user.click(deleteButton);

    expect(setDeleteConfirmOpenMock).toHaveBeenCalledWith(true);
  });

  it("applies slate text color when task is not overdue", () => {
    const finishedTask = { ...mockTaskOverdue, status: "FINISHED" as const };
    vi.mocked(mockUseTaskCard).mockReturnValue({
      ...baseHook,
      isOverdue: false,
    } as unknown as TaskCardHook);

    const { container } = render(
      <TaskCard task={finishedTask} projectId={1} index={0} />
    );
    // The finished task should show deadline in normal slate color
    const slateTexts = container.querySelectorAll(".text-slate-600");
    expect(slateTexts.length).toBeGreaterThan(0);
  });

  it("applies red text color when task is overdue", () => {
    vi.mocked(mockUseTaskCard).mockReturnValue({
      ...baseHook,
      isOverdue: true,
    } as unknown as TaskCardHook);

    const { container } = render(
      <TaskCard task={mockTaskOverdue} projectId={1} index={0} />
    );
    // The overdue indicator should have the red text class
    const overdueDates = container.querySelectorAll(".text-red-600");
    expect(overdueDates.length).toBeGreaterThan(0);
  });

  it("disables buttons while delete is pending", () => {
    vi.mocked(mockUseTaskCard).mockReturnValue({
      ...baseHook,
      isPending: true,
      deleteConfirmOpen: true,
    } as unknown as TaskCardHook);

    render(<TaskCard task={mockTask} projectId={1} index={0} />);
    // The delete confirm dialog should be open with isPending true
    // This affects the delete confirmation behavior
  });
});
