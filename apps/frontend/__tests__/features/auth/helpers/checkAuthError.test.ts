import { describe, expect, it } from "vitest";
import { checkAuthError } from "~/features/auth/helpers/checkAuthError";

describe("checkAuthError", () => {
  it("returns true when error has the matching code", () => {
    const error = { code: "INVALID_EMAIL_OR_PASSWORD" };
    expect(checkAuthError(error, "INVALID_EMAIL_OR_PASSWORD")).toBe(true);
  });

  it("returns false when error has a different code", () => {
    const error = { code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" };
    expect(checkAuthError(error, "INVALID_EMAIL_OR_PASSWORD")).toBe(false);
  });

  it("returns false when error has no code property", () => {
    expect(
      checkAuthError({ message: "oops" }, "INVALID_EMAIL_OR_PASSWORD")
    ).toBe(false);
  });

  it("returns false for null", () => {
    expect(checkAuthError(null, "INVALID_EMAIL_OR_PASSWORD")).toBe(false);
  });

  it("returns false for a string", () => {
    expect(checkAuthError("error", "INVALID_EMAIL_OR_PASSWORD")).toBe(false);
  });
});
