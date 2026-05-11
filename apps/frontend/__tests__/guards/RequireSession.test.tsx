import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import RequireSession from "~/guards/RequireSession";

vi.mock("~/features/auth/hooks", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "~/features/auth/hooks";

function renderGuard(initialEntry = "/protected") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<RequireSession />}>
          <Route path="/protected" element={<div>Protected content</div>} />
        </Route>
        <Route path="/auth" element={<div>Auth page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("RequireSession", () => {
  it("redirects to /auth when not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
      session: null,
      refresh: vi.fn(),
    });

    renderGuard();

    expect(screen.getByText("Auth page")).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders protected content when authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: {
        id: "1",
        name: "Alice",
        email: "alice@example.com",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      session: {
        id: "s1",
        userId: "1",
        token: "tok",
        expiresAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      refresh: vi.fn(),
    });

    renderGuard();

    expect(screen.getByText("Protected content")).toBeInTheDocument();
    expect(screen.queryByText("Auth page")).not.toBeInTheDocument();
  });
});
