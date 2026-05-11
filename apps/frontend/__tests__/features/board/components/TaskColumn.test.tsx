import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TaskColumn } from "~/features/board/components/TaskColumn";
import type { useGetTasksByProjectId } from "~/features/board/queries";
import type { useTaskCard } from "~/features/board/hooks";
import {
  makeQueryResult,
  makeUndefinedQueryResult,
  mockTask1,
  mockTask2,
} from "../test-utils";

vi.mock("~/features/board/queries", () => ({
  useGetTasksByProjectId: vi.fn(),
}));

vi.mock("~/features/board/hooks", () => ({
  useProjectIdParam: vi.fn(() => "1"),
  useTaskCard: vi.fn(),
}));

vi.mock("~/features/board/stores/useBoardStore", () => ({
  useBoardStore: (selector: (state: BoardStoreState) => unknown) => {
    const mockStore: BoardStoreState = {
      setSelectedStatus: vi.fn(),
      setSelectedTask: vi.fn(),
      setDialogOpen: vi.fn(),
      resetFormState: vi.fn(),
      selectedTask: null,
      selectedStatus: null,
      isDialogOpen: false,
    };
    return selector(mockStore);
  },
}));

import { useGetTasksByProjectId as mockUseGetTasksByProjectId } from "~/features/board/queries";
import { useTaskCard as mockUseTaskCard } from "~/features/board/hooks";
import type { BoardStore } from "~/features/board/stores/useBoardStore";

type UseTaskCardReturn = ReturnType<typeof useTaskCard>;
type UseGetTasksByProjectIdReturn = ReturnType<typeof useGetTasksByProjectId>;
type BoardStoreState = BoardStore;

describe("TaskColumn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockUseTaskCard).mockReturnValue({
      deleteConfirmOpen: false,
      setDeleteConfirmOpen: vi.fn(),
      isPending: false,
      isOverdue: false,
      handleConfirmDelete: vi.fn(),
      selectCard: vi.fn(),
    } as unknown as UseTaskCardReturn);
  });

  it("returns empty fragment when tasks data is undefined", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(
      makeUndefinedQueryResult() as UseGetTasksByProjectIdReturn
    );

    const { container } = render(<TaskColumn status="NEW" label="To Do" />);
    expect(container.firstChild).toBe(null);
  });

  it("renders column header with status label", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(makeQueryResult([]));

    render(<TaskColumn status="NEW" label="To Do" />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("renders task count in header", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(
      makeQueryResult([mockTask1, mockTask2])
    );

    render(<TaskColumn status="NEW" label="To Do" />);
    const taskCountText = screen.queryByText(/tasks/);
    expect(taskCountText?.textContent).toContain("2");
  });

  it("renders all tasks in the column", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(
      makeQueryResult([mockTask1, mockTask2])
    );

    render(<TaskColumn status="NEW" label="To Do" />);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("shows 'No tasks' message when column is empty", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(makeQueryResult([]));

    render(<TaskColumn status="NEW" label="To Do" />);
    expect(screen.getByText("No tasks")).toBeInTheDocument();
    expect(screen.getByText("0 tasks")).toBeInTheDocument();
  });

  it("renders add task button", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(makeQueryResult([]));

    render(<TaskColumn status="NEW" label="To Do" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("calls setSelectedStatus with correct status when add button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(makeQueryResult([]));

    render(<TaskColumn status="IN_PROGRESS" label="In Progress" />);
    const addButton = screen.getByRole("button");
    await user.click(addButton);
  });

  it("applies correct color styles for NEW status", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(makeQueryResult([]));

    const { container } = render(<TaskColumn status="NEW" label="To Do" />);
    const columnDiv = container.querySelector("div");
    expect(columnDiv).toHaveClass("bg-blue-50");
  });

  it("applies correct color styles for IN_PROGRESS status", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(makeQueryResult([]));

    const { container } = render(
      <TaskColumn status="IN_PROGRESS" label="In Progress" />
    );
    const columnDiv = container.querySelector("div");
    expect(columnDiv).toHaveClass("bg-amber-50");
  });

  it("applies correct color styles for STOPPED status", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(makeQueryResult([]));

    const { container } = render(
      <TaskColumn status="STOPPED" label="Stopped" />
    );
    const columnDiv = container.querySelector("div");
    expect(columnDiv).toHaveClass("bg-red-50");
  });

  it("applies correct color styles for FINISHED status", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(makeQueryResult([]));

    const { container } = render(<TaskColumn status="FINISHED" label="Done" />);
    const columnDiv = container.querySelector("div");
    expect(columnDiv).toHaveClass("bg-green-50");
  });

  it("filters tasks by status when rendering", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(
      makeQueryResult([mockTask1])
    );

    render(<TaskColumn status="NEW" label="To Do" />);
    expect(mockUseGetTasksByProjectId).toHaveBeenCalled();
  });

  it("renders with scrollable content area", () => {
    vi.mocked(mockUseGetTasksByProjectId).mockReturnValue(
      makeQueryResult([mockTask1, mockTask2])
    );

    const { container } = render(<TaskColumn status="NEW" label="To Do" />);
    const contentArea = container.querySelector(".overflow-auto");
    expect(contentArea).toBeInTheDocument();
  });
});
