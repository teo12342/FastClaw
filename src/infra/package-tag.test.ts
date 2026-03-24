import { describe, expect, it } from "vitest";
import { normalizePackageTagInput } from "./package-tag.js";

describe("normalizePackageTagInput", () => {
  const packageNames = ["fastclaw", "@fastclaw/plugin"] as const;

  it("returns null for blank inputs", () => {
    expect(normalizePackageTagInput(undefined, packageNames)).toBeNull();
    expect(normalizePackageTagInput("   ", packageNames)).toBeNull();
  });

  it("strips known package-name prefixes before returning the tag", () => {
    expect(normalizePackageTagInput("fastclaw@beta", packageNames)).toBe("beta");
    expect(normalizePackageTagInput("@fastclaw/plugin@2026.2.24", packageNames)).toBe("2026.2.24");
    expect(normalizePackageTagInput("fastclaw@   ", packageNames)).toBeNull();
  });

  it("treats exact known package names as an empty tag", () => {
    expect(normalizePackageTagInput("fastclaw", packageNames)).toBeNull();
    expect(normalizePackageTagInput(" @fastclaw/plugin ", packageNames)).toBeNull();
  });

  it("returns trimmed raw values when no package prefix matches", () => {
    expect(normalizePackageTagInput(" latest ", packageNames)).toBe("latest");
    expect(normalizePackageTagInput("@other/plugin@beta", packageNames)).toBe("@other/plugin@beta");
    expect(normalizePackageTagInput("fastclawer@beta", packageNames)).toBe("fastclawer@beta");
  });
});
