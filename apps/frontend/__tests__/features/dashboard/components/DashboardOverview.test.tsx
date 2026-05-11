import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardOverview } from "~/features/dashboard/components/DashboardOverview";
import type { Dashboard } from "@repo/shared";

vi.mock("~/features/dashboard/queries", () => ({
  useGetDashboardData: vi.fn(),
}));

import { useGetDashboardData } from "~/features/dashboard/queries";

const mockDashboard: Dashboard = {
  taskCount: {
    totalTasks: 20,
    newTasks: 5,
    inProgressTasks: 6,
    stoppedTasks: 1,
    completedTasks: 8,
    overdueTasks: 3,
    lowTasks: 4,
    mediumTasks: 10,
    highTasks: 6,
  },
  tasksByProject: [],
  upcomingTasks: [],
};

describe("DashboardOverview", () => {
  it("renders nothing when data is not available", () => {
    vi.mocked(useGetDashboardData).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useGetDashboardData>);

    render(<DashboardOverview />);
    expect(screen.queryByText("Total Tasks")).not.toBeInTheDocument();
  });

  it("renders all four overview cards", () => {
    vi.mocked(useGetDashboardData).mockReturnValue({
      data: mockDashboard,
    } as unknown as ReturnType<typeof useGetDashboardData>);

    render(<DashboardOverview />);

    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("displays correct counts from data", () => {
    vi.mocked(useGetDashboardData).mockReturnValue({
      data: mockDashboard,
    } as unknown as ReturnType<typeof useGetDashboardData>);

    render(<DashboardOverview />);

    expect(screen.getByText("20")).toBeInTheDocument(); // totalTasks
    expect(screen.getByText("6")).toBeInTheDocument(); // inProgressTasks
    expect(screen.getByText("8")).toBeInTheDocument(); // completedTasks
    expect(screen.getByText("3")).toBeInTheDocument(); // overdueTasks
  });

  it("shows completion percentage in Total Tasks subtitle", () => {
    vi.mocked(useGetDashboardData).mockReturnValue({
      data: mockDashboard,
    } as unknown as ReturnType<typeof useGetDashboardData>);

    render(<DashboardOverview />);

    // 8/20 = 0.4 = 40.00%
    expect(screen.getByText("40.00% completed")).toBeInTheDocument();
  });

  it("shows static subtitles for other cards", () => {
    vi.mocked(useGetDashboardData).mockReturnValue({
      data: mockDashboard,
    } as unknown as ReturnType<typeof useGetDashboardData>);

    render(<DashboardOverview />);

    expect(screen.getByText("Active tasks")).toBeInTheDocument();
    expect(screen.getByText("Finished tasks")).toBeInTheDocument();
    expect(screen.getByText("Past deadline")).toBeInTheDocument();
  });
});
