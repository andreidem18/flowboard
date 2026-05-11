import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserAvatar } from "~/features/board/components/UserAvatar";

describe("UserAvatar", () => {
  it("renders avatar with first letter of user name", () => {
    render(<UserAvatar userName="John Doe" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("extracts first letter correctly for single letter name", () => {
    render(<UserAvatar userName="A" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("extracts first letter correctly for multi-word names", () => {
    render(<UserAvatar userName="Jane Smith Williams" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("handles lowercase names by converting to uppercase", () => {
    render(<UserAvatar userName="alice" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders avatar with correct size classes", () => {
    const { container } = render(<UserAvatar userName="Bob" />);
    const avatar = container.querySelector("span");
    expect(avatar).toHaveClass("h-6", "w-6");
  });

  it("renders avatar fallback text with uppercase letter", () => {
    render(<UserAvatar userName="charlie" />);
    const fallback = screen.getByText("C");
    expect(fallback.textContent).toBe("C");
  });

  it("handles names with special characters correctly", () => {
    render(<UserAvatar userName="José María" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("handles empty string gracefully", () => {
    const { container } = render(<UserAvatar userName="" />);
    // The Avatar component should render with an empty AvatarFallback
    const avatar = container.querySelector('[data-slot="avatar"]');
    expect(avatar).toBeInTheDocument();
  });
});
