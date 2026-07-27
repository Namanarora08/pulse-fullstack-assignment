import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn class name helper", () => {
  it("joins truthy class names and ignores falsy values", () => {
    expect(cn("a", "b")).toBe("a b");
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("supports conditional object and array syntax", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("merges conflicting tailwind utilities keeping the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm text-red-500", "text-lg")).toBe("text-red-500 text-lg");
  });

  it("returns an empty string when given no meaningful input", () => {
    expect(cn()).toBe("");
    expect(cn(false, null, undefined)).toBe("");
  });
});
