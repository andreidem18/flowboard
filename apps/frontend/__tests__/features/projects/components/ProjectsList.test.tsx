import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProjectsList } from "~/features/projects/components/ProjectsList";
import type { useProjectsList } from "~/features/projects/hooks/useProjectsList";
import type { Project } from "@repo/shared";

vi.mock("~/features/projects/hooks/useProjectsList", () => ({
  useProjectsList: vi.fn(),
}));

import { useProjectsList as mockUseProjectsList } from "~/features/projects/hooks/useProjectsList";

type ProjectsListHook = ReturnType<typeof useProjectsList>;

const mockSetSelectedProject = vi.fn();
const mockHandleDeleteProject = vi.fn();

const baseHook: ProjectsListHook = {
  projects: [],
  isLoading: false,
  deleteConfirmOpen: false,
  projectToDelete: null,
  confirmDelete: vi.fn(),
  handleDeleteProject: mockHandleDeleteProject,
  setSelectedProject: mockSetSelectedProject,
  setDeleteConfirmOpen: vi.fn(),
} as unknown as ProjectsListHook;

const mockProjects: Project[] = [
  {
    id: 1,
    name: "Alpha",
    description: "First project",
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "Beta",
    description: null,
    color: "#8b5cf6",
  },
];

describe("ProjectsList", () => {
  beforeEach(() => {
    vi.mocked(mockUseProjectsList).mockReturnValue(baseHook);
    mockSetSelectedProject.mockClear();
    mockHandleDeleteProject.mockClear();
  });

  it("shows loading text while fetching", () => {
    vi.mocked(mockUseProjectsList).mockReturnValue({
      ...baseHook,
      isLoading: true,
    } as unknown as ProjectsListHook);

    render(<ProjectsList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows empty state when there are no projects", () => {
    render(<ProjectsList />);
    expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
  });

  it("renders project names and descriptions", () => {
    vi.mocked(mockUseProjectsList).mockReturnValue({
      ...baseHook,
      projects: mockProjects,
    } as unknown as ProjectsListHook);

    render(<ProjectsList />);

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("First project")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("calls setSelectedProject with the project when edit button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(mockUseProjectsList).mockReturnValue({
      ...baseHook,
      projects: mockProjects,
    } as unknown as ProjectsListHook);

    render(<ProjectsList />);

    const editButtons = screen.getAllByRole("button", { name: "" });
    await user.click(editButtons[0]);

    expect(mockSetSelectedProject).toHaveBeenCalledWith(mockProjects[0]);
  });

  it("calls handleDeleteProject with the project id when delete button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(mockUseProjectsList).mockReturnValue({
      ...baseHook,
      projects: mockProjects,
    } as unknown as ProjectsListHook);

    render(<ProjectsList />);

    const deleteButtons = screen.getAllByRole("button", { name: "" });
    await user.click(deleteButtons[1]);

    expect(mockHandleDeleteProject).toHaveBeenCalledWith(mockProjects[0].id);
  });
});
