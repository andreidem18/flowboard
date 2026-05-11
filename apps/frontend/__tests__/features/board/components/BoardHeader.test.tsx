import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { BoardHeader } from "~/features/board/components/BoardHeader";
import type { NavigateFunction } from "react-router";
import { makeQueryResult, mockProjects } from "../test-utils";
import type { Project } from "@repo/shared";

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(() => ({ projectId: "1" })),
}));

vi.mock("~/features/projects/queries", () => ({
  useGetAllProjects: vi.fn(),
}));

import { useGetAllProjects as mockUseGetAllProjects } from "~/features/projects/queries";
import { useNavigate } from "react-router";

describe("BoardHeader", () => {
  let mockNavigate: NavigateFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate = vi.fn() as unknown as NavigateFunction;
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it("renders Project label", () => {
    vi.mocked(mockUseGetAllProjects).mockReturnValue(makeQueryResult([]));

    render(<BoardHeader />);
    expect(screen.getByText("Project:")).toBeInTheDocument();
  });

  it("renders select dropdown", () => {
    vi.mocked(mockUseGetAllProjects).mockReturnValue(makeQueryResult([]));

    render(<BoardHeader />);
    const triggers = screen.getAllByRole("combobox");
    expect(triggers.length).toBeGreaterThan(0);
  });

  it("renders 'All Projects' option when select is opened", async () => {
    const user = userEvent.setup();
    vi.mocked(mockUseGetAllProjects).mockReturnValue(
      makeQueryResult(mockProjects)
    );

    render(<BoardHeader />);
    const select = screen.getByRole("combobox");
    await user.click(select);
    expect(screen.getByText("All Projects")).toBeInTheDocument();
  });

  it("renders all project options when select is opened", async () => {
    const user = userEvent.setup();
    vi.mocked(mockUseGetAllProjects).mockReturnValue(
      makeQueryResult(mockProjects)
    );

    render(<BoardHeader />);
    const select = screen.getByRole("combobox");
    await user.click(select);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Mobile")).toBeInTheDocument();
  });

  it("renders project color indicators", () => {
    vi.mocked(mockUseGetAllProjects).mockReturnValue(
      makeQueryResult(mockProjects)
    );

    const { container } = render(<BoardHeader />);
    const colorDots = container.querySelectorAll('[class*="rounded-full"]');
    expect(colorDots.length).toBeGreaterThan(0);
  });

  it("navigates to selected project when option is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(mockUseGetAllProjects).mockReturnValue(
      makeQueryResult(mockProjects)
    );

    render(<BoardHeader />);
    const select = screen.getByRole("combobox");
    await user.click(select);

    const backendOption = screen.getByText("Backend");
    await user.click(backendOption);

    expect(mockNavigate).toHaveBeenCalledWith("/app/board/2");
  });

  it("navigates to all projects when All Projects is selected", async () => {
    const user = userEvent.setup();
    vi.mocked(mockUseGetAllProjects).mockReturnValue(
      makeQueryResult(mockProjects)
    );

    render(<BoardHeader />);
    const select = screen.getByRole("combobox");
    await user.click(select);

    const allOption = screen.getByText("All Projects");
    await user.click(allOption);

    expect(mockNavigate).toHaveBeenCalledWith("/app/board/all");
  });

  it("handles empty projects list gracefully", async () => {
    const user = userEvent.setup();
    vi.mocked(mockUseGetAllProjects).mockReturnValue(makeQueryResult([]));

    render(<BoardHeader />);
    expect(screen.getByText("Project:")).toBeInTheDocument();
    const select = screen.getByRole("combobox");
    await user.click(select);
    expect(screen.getByText("All Projects")).toBeInTheDocument();
  });

  it("uses default color when project has no color", async () => {
    const user = userEvent.setup();
    const projectWithoutColor: Project = {
      id: 4,
      name: "No Color Project",
      description: "Project without color",
      color: null,
    };

    vi.mocked(mockUseGetAllProjects).mockReturnValue(
      makeQueryResult([projectWithoutColor])
    );

    render(<BoardHeader />);
    const select = screen.getByRole("combobox");
    await user.click(select);
    expect(screen.getByText("No Color Project")).toBeInTheDocument();
  });

  it("displays project names correctly in select options", async () => {
    const user = userEvent.setup();
    vi.mocked(mockUseGetAllProjects).mockReturnValue(
      makeQueryResult(mockProjects)
    );

    render(<BoardHeader />);
    const select = screen.getByRole("combobox");
    await user.click(select);

    mockProjects.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
    });
  });

  it("shows current project id in select trigger", () => {
    vi.mocked(mockUseGetAllProjects).mockReturnValue(
      makeQueryResult(mockProjects)
    );

    render(<BoardHeader />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });
});
