import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SignUpForm } from "~/features/auth/components/SignUpForm";
import type { useSignUpForm } from "~/features/auth/hooks/useSignUpForm";

vi.mock("~/features/auth/hooks/useSignUpForm", () => ({
  useSignUpForm: vi.fn(),
}));

import { useSignUpForm as mockUseSignUpForm } from "~/features/auth/hooks/useSignUpForm";

type SignUpFormHook = ReturnType<typeof useSignUpForm>;

const baseHook = {
  register: vi.fn().mockReturnValue({}),
  handleSubmit: vi.fn((fn) => (e: Event) => {
    e.preventDefault();
    fn({});
  }),
  errors: {},
  isSubmitting: false,
  onSubmit: vi.fn(),
} as unknown as SignUpFormHook;

describe("SignUpForm", () => {
  beforeEach(() => {
    vi.mocked(mockUseSignUpForm).mockReturnValue(baseHook);
  });

  it("renders name, email and password fields", () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows field validation errors", () => {
    vi.mocked(mockUseSignUpForm).mockReturnValue({
      ...baseHook,
      errors: {
        name: { message: "Name must be at least 2 characters", type: "min" },
        email: { message: "Please enter a valid email", type: "validate" },
        password: {
          message: "Password must be at least 6 characters",
          type: "min",
        },
      },
    } as unknown as SignUpFormHook);

    render(<SignUpForm />);

    expect(
      screen.getByText("Name must be at least 2 characters")
    ).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
    expect(
      screen.getByText("Password must be at least 6 characters")
    ).toBeInTheDocument();
  });

  it("disables button and shows loading text while submitting", () => {
    vi.mocked(mockUseSignUpForm).mockReturnValue({
      ...baseHook,
      isSubmitting: true,
    } as unknown as SignUpFormHook);

    render(<SignUpForm />);

    const submitBtn = screen.getByRole("button", { name: /creating account/i });
    expect(submitBtn).toBeDisabled();
  });
});
