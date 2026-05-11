import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectProgress } from "~/features/dashboard/components/ProjectProgress";
import type { Dashboard, TasksByProject } from "@repo/shared";

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

const makeProject = (overrides: Partial<TasksByProject>): TasksByProject => ({
  id: 1,
  name: "Alpha",
  color: "#3b82f6",
  totalTasks: 10,
  finishedTasks: 5,
  inProgressTasks: 3,
  notFinishedTasks: 5,
  ...overrides,
});

describe("ProjectProgress", () => {
  it("renders no items when tasksByProject is empty", () => {
    vi.mocked(useGetDashboardData).mockReturnValue({
      data: { taskCount: baseTaskCount, tasksByProject: [], upcomingTasks: [] },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    render(<ProjectProgress />);

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("renders no items when data is undefined", () => {
    vi.mocked(useGetDashboardData).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useGetDashboardData>);

    render(<ProjectProgress />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("renders project name and task counts", () => {
    const project = makeProject({
      name: "My Project",
      finishedTasks: 3,
      totalTasks: 10,
    });

    vi.mocked(useGetDashboardData).mockReturnValue({
      data: {
        taskCount: baseTaskCount,
        tasksByProject: [project],
        upcomingTasks: [],
      },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    render(<ProjectProgress />);

    expect(screen.getByText("My Project")).toBeInTheDocument();
    expect(screen.getByText("3/10")).toBeInTheDocument();
  });

  it("renders multiple projects", () => {
    const projects = [
      makeProject({ id: 1, name: "Alpha" }),
      makeProject({ id: 2, name: "Beta" }),
    ];

    vi.mocked(useGetDashboardData).mockReturnValue({
      data: {
        taskCount: baseTaskCount,
        tasksByProject: projects,
        upcomingTasks: [],
      },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    render(<ProjectProgress />);

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("shows 0/0 and zero progress for a project with no tasks", () => {
    const project = makeProject({ totalTasks: 0, finishedTasks: 0 });

    vi.mocked(useGetDashboardData).mockReturnValue({
      data: {
        taskCount: baseTaskCount,
        tasksByProject: [project],
        upcomingTasks: [],
      },
    } as unknown as ReturnType<typeof useGetDashboardData>);

    render(<ProjectProgress />);

    expect(screen.getByText("0/0")).toBeInTheDocument();
  });
});
