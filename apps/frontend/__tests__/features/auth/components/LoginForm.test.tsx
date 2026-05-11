import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "~/features/auth/components/LoginForm";
import type { useLoginForm } from "~/features/auth/hooks";

vi.mock("~/features/auth/hooks", () => ({
  useLoginForm: vi.fn(),
}));

import { useLoginForm as mockUseLoginForm } from "~/features/auth/hooks";

type LoginFormHook = ReturnType<typeof useLoginForm>;

const mockSetValue = vi.fn();
const mockOnSubmit = vi.fn();

const baseHook: LoginFormHook = {
  register: vi.fn().mockReturnValue({}),
  handleSubmit: vi.fn((fn) => (e: Event) => {
    e.preventDefault();
    fn({});
  }),
  errors: {},
  isSubmitting: false,
  onSubmit: mockOnSubmit,
  setValue: mockSetValue,
} as unknown as LoginFormHook;

describe("LoginForm", () => {
  beforeEach(() => {
    vi.mocked(mockUseLoginForm).mockReturnValue(baseHook);
    mockSetValue.mockClear();
  });

  it("renders email, password fields and remember me checkbox", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
  });

  it("shows field validation errors", () => {
    vi.mocked(mockUseLoginForm).mockReturnValue({
      ...baseHook,
      errors: {
        email: { message: "Please enter a valid email", type: "validate" },
        password: {
          message: "Password must be at least 6 characters",
          type: "min",
        },
      },
    } as unknown as LoginFormHook);

    render(<LoginForm />);

    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
    expect(
      screen.getByText("Password must be at least 6 characters")
    ).toBeInTheDocument();
  });

  it("shows form-level error when errors.form is set", () => {
    vi.mocked(mockUseLoginForm).mockReturnValue({
      ...baseHook,
      errors: { form: { message: "Invalid credentials", type: "manual" } },
    } as unknown as LoginFormHook);

    render(<LoginForm />);

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("disables button and shows loading text while submitting", () => {
    vi.mocked(mockUseLoginForm).mockReturnValue({
      ...baseHook,
      isSubmitting: true,
    } as unknown as LoginFormHook);

    render(<LoginForm />);

    const submitBtn = screen.getByRole("button", { name: /logging in/i });
    expect(submitBtn).toBeDisabled();
  });

  it("calls setValue twice when demo credentials button is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(
      screen.getByRole("button", { name: /fill with demo credentials/i })
    );

    expect(mockSetValue).toHaveBeenCalledTimes(2);
    expect(mockSetValue).toHaveBeenCalledWith("email", "alice@example.com");
    expect(mockSetValue).toHaveBeenCalledWith("password", "admin1234");
  });
});
