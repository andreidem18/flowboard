import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useForm } from "react-hook-form";
import { TaskForm } from "~/features/board/components/taskForm/TaskForm";
import { useBoardStore } from "~/features/board/stores/useBoardStore";
import type { useTaskForm } from "~/features/board/hooks/useTaskForm";
import { mockTask1 } from "../test-utils";

vi.mock("zustand");

vi.mock("~/features/board/hooks/useTaskForm", () => ({
  useTaskForm: vi.fn(),
}));

vi.mock("~/features/users/queries", () => ({
  useGetAllUsers: vi.fn(() => ({ data: [] })),
}));

import { useTaskForm as mockUseTaskForm } from "~/features/board/hooks/useTaskForm";

type TaskFormHook = ReturnType<typeof useTaskForm>;

const mockOnSubmit = vi.fn();

function buildHook(overrides: Partial<TaskFormHook> = {}): TaskFormHook {
  const { control, register, handleSubmit } = useForm();
  return {
    register,
    control,
    handleSubmit,
    errors: {},
    isSubmitting: false,
    onSubmit: mockOnSubmit,
    ...overrides,
  } as unknown as TaskFormHook;
}

describe("TaskForm", () => {
  beforeEach(() => {
    vi.mocked(mockUseTaskForm).mockImplementation(() => buildHook());
    useBoardStore.setState({ isDialogOpen: true, selectedTask: null });
  });

  it('shows "Create New Task" title when no task is selected', () => {
    render(<TaskForm />);
    expect(screen.getByText("Create New Task")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create task/i })
    ).toBeInTheDocument();
  });

  it('shows "Edit Task" title when a task is selected', () => {
    useBoardStore.setState({ isDialogOpen: true, selectedTask: mockTask1 });
    render(<TaskForm />);
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update task/i })
    ).toBeInTheDocument();
  });

  it("shows field validation errors", () => {
    vi.mocked(mockUseTaskForm).mockImplementation(() =>
      buildHook({
        errors: { name: { message: "Task name is required", type: "min" } },
      })
    );

    render(<TaskForm />);
    expect(screen.getByText("Task name is required")).toBeInTheDocument();
  });

  it("disables buttons and shows Saving... while submitting", () => {
    vi.mocked(mockUseTaskForm).mockImplementation(() =>
      buildHook({ isSubmitting: true })
    );

    render(<TaskForm />);
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });

  it("closes the dialog when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(useBoardStore.getState().isDialogOpen).toBe(false);
  });
});
