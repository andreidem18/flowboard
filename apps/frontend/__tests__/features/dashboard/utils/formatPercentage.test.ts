import { describe, expect, it } from "vitest";
import { formatPercentage } from "~/features/dashboard/utils/formatPercentage";

describe("formatPercentage", () => {
  it("converts a decimal to a percentage string with 2 decimals by default", () => {
    expect(formatPercentage(0.5)).toBe("50.00%");
  });

  it("handles 0", () => {
    expect(formatPercentage(0)).toBe("0.00%");
  });

  it("handles 1 (100%)", () => {
    expect(formatPercentage(1)).toBe("100.00%");
  });

  it("respects custom decimal places", () => {
    expect(formatPercentage(0.3333, 0)).toBe("33%");
    expect(formatPercentage(0.3333, 1)).toBe("33.3%");
  });

  it("handles values above 1", () => {
    expect(formatPercentage(1.5)).toBe("150.00%");
  });
});
