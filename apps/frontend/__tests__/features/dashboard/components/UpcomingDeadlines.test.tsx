import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { UpcomingDeadlines } from "~/features/dashboard/components/UpcomingDeadlines";
import type { Dashboard, UpcomingTasks } from "@repo/shared";

vi.mock("~/features/dashboard/queries", () => ({
  useGetDashboardData: vi.fn(),
}));

import { useGetDashboardData } from "~/features/dashboard/queries";

const baseTaskCount: Dashboard["taskCount"] = {
  totalTasks: 0,
  newTasks: 0,
  inProgressTasks: 0,
  stoppedTasks: 0,
  completedTasks: 0,
  overdueTasks: 0,
  lowTasks: 0,
  mediumTasks: 0,
  highTasks: 0,
};

const makeTask = (overrides: Partial<UpcomingTasks>): UpcomingTasks => ({
  id: 1,
  name: "Test Task",
  daysLeft: 5,
  deadline: "2026-05-15",
  project: { id: 10, name: "Alpha", color: "#3b82f6" },
  ...overrides,
});

function renderComponent() {
  return render(
    <MemoryRouter>
      <UpcomingDeadlines />
    </MemoryRouter>
  );
}

describe("UpcomingDeadlines", () => {
  it("shows empty state when there are no upcoming tasks", () => {
    vi.mocked(useGetDashboardData).mockReturnValue({
      data: { taskCount: baseTaskCount, tasksByProject: [], upcomingTasks: [] },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    renderComponent();
    expect(screen.getByText(/no upcoming deadlines/i)).toBeInTheDocument();
  });

  it("shows empty state when data is undefined", () => {
    vi.mocked(useGetDashboardData).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useGetDashboardData>);

    renderComponent();
    expect(screen.getByText(/no upcoming deadlines/i)).toBeInTheDocument();
  });

  it("renders task name and project name", () => {
    const task = makeTask({
      name: "Fix login bug",
      project: { id: 1, name: "Backend", color: null },
    });

    vi.mocked(useGetDashboardData).mockReturnValue({
      data: {
        taskCount: baseTaskCount,
        tasksByProject: [],
        upcomingTasks: [task],
      },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    renderComponent();

    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("shows Overdue badge for tasks with negative daysLeft", () => {
    const task = makeTask({ daysLeft: -2 });

    vi.mocked(useGetDashboardData).mockReturnValue({
      data: {
        taskCount: baseTaskCount,
        tasksByProject: [],
        upcomingTasks: [task],
      },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    renderComponent();

    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.getByText("2 days ago")).toBeInTheDocument();
  });

  it("shows Urgent badge for tasks due within 3 days", () => {
    const task = makeTask({ daysLeft: 2 });

    vi.mocked(useGetDashboardData).mockReturnValue({
      data: {
        taskCount: baseTaskCount,
        tasksByProject: [],
        upcomingTasks: [task],
      },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    renderComponent();

    expect(screen.getByText("Urgent")).toBeInTheDocument();
    expect(screen.getByText("2 days")).toBeInTheDocument();
  });

  it("shows no badge for normal tasks (more than 3 days away)", () => {
    const task = makeTask({ daysLeft: 10 });

    vi.mocked(useGetDashboardData).mockReturnValue({
      data: {
        taskCount: baseTaskCount,
        tasksByProject: [],
        upcomingTasks: [task],
      },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    renderComponent();

    expect(screen.queryByText("Overdue")).not.toBeInTheDocument();
    expect(screen.queryByText("Urgent")).not.toBeInTheDocument();
    expect(screen.getByText("10 days")).toBeInTheDocument();
  });

  it("shows 'Today' when daysLeft is 0", () => {
    const task = makeTask({ daysLeft: 0 });

    vi.mocked(useGetDashboardData).mockReturnValue({
      data: {
        taskCount: baseTaskCount,
        tasksByProject: [],
        upcomingTasks: [task],
      },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    renderComponent();

    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("renders a link to the project board", () => {
    const task = makeTask({
      project: { id: 42, name: "My Project", color: null },
    });

    vi.mocked(useGetDashboardData).mockReturnValue({
      data: {
        taskCount: baseTaskCount,
        tasksByProject: [],
        upcomingTasks: [task],
      },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    renderComponent();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/app/board/42");
  });

  it("renders multiple tasks", () => {
    const tasks = [
      makeTask({ id: 1, name: "Task One", daysLeft: 1 }),
      makeTask({ id: 2, name: "Task Two", daysLeft: 7 }),
    ];

    vi.mocked(useGetDashboardData).mockReturnValue({
      data: {
        taskCount: baseTaskCount,
        tasksByProject: [],
        upcomingTasks: tasks,
      },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    renderComponent();

    expect(screen.getByText("Task One")).toBeInTheDocument();
    expect(screen.getByText("Task Two")).toBeInTheDocument();
  });
});
