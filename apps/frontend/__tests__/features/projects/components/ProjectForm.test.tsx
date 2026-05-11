import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { ProjectForm } from "~/features/projects/components/ProjectForm";
import { useProjectsStore } from "~/features/projects/stores/useProjectsStore";
import type { useProjectForm } from "~/features/projects/hooks/useProjectForm";
import type { Project } from "@repo/shared";

vi.mock("zustand");

vi.mock("~/features/projects/hooks/useProjectForm", () => ({
  useProjectForm: vi.fn(),
}));

import { useProjectForm as mockUseProjectForm } from "~/features/projects/hooks/useProjectForm";

type ProjectFormHook = ReturnType<typeof useProjectForm>;

const mockOnSubmit = vi.fn();

function buildHook(overrides: Partial<ProjectFormHook> = {}): ProjectFormHook {
  const { control, register, handleSubmit } = useForm();
  return {
    register,
    control,
    handleSubmit,
    errors: {},
    isSubmitting: false,
    onSubmit: mockOnSubmit,
    ...overrides,
  } as unknown as ProjectFormHook;
}

const mockProject: Project = {
  id: 1,
  name: "Existing Project",
  description: "Existing description",
  color: "#3b82f6",
};

describe("ProjectForm", () => {
  beforeEach(() => {
    vi.mocked(mockUseProjectForm).mockImplementation(() => buildHook());
    useProjectsStore.setState({ isDialogOpen: true, selectedProject: null });
  });

  it('shows "Create New Project" title when no project is selected', () => {
    render(<ProjectForm />);
    expect(screen.getByText("Create New Project")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^create$/i })
    ).toBeInTheDocument();
  });

  it('shows "Edit Project" title when a project is selected', () => {
    useProjectsStore.setState({
      isDialogOpen: true,
      selectedProject: mockProject,
    });
    render(<ProjectForm />);
    expect(screen.getByText("Edit Project")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
  });

  it("shows field validation errors", () => {
    vi.mocked(mockUseProjectForm).mockImplementation(() =>
      buildHook({
        errors: { name: { message: "Name is required", type: "min" } },
      })
    );

    render(<ProjectForm />);
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("disables buttons and shows Saving... while submitting", () => {
    vi.mocked(mockUseProjectForm).mockImplementation(() =>
      buildHook({ isSubmitting: true })
    );

    render(<ProjectForm />);
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });

  it("closes the dialog when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(useProjectsStore.getState().isDialogOpen).toBe(false);
  });
});
