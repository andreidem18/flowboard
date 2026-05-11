import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProjectsHeader } from "~/features/projects/components/ProjectsHeader";
import { useProjectsStore } from "~/features/projects/stores/useProjectsStore";

vi.mock("zustand");

describe("ProjectsHeader", () => {
  it("renders the Projects title", () => {
    render(<ProjectsHeader />);
    expect(
      screen.getByRole("heading", { name: /projects/i })
    ).toBeInTheDocument();
  });

  it("opens the create dialog with no selected project when New Project is clicked", async () => {
    const user = userEvent.setup();
    render(<ProjectsHeader />);

    await user.click(screen.getByRole("button", { name: /new project/i }));

    const state = useProjectsStore.getState();
    expect(state.isDialogOpen).toBe(true);
    expect(state.selectedProject).toBeNull();
  });
});
