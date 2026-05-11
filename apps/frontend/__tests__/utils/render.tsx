import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router";

export function renderWithRouter(
  ui: React.ReactElement,
  {
    initialEntries = ["/"],
    ...options
  }: { initialEntries?: string[] } & RenderOptions = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    ),
    ...options,
  });
}
