import { describe, expect, it } from "vitest";
import { shortenText } from "./text-format.js";

describe("shortenText", () => {
  it("returns original text when it fits", () => {
    expect(shortenText("fastclaw", 16)).toBe("fastclaw");
  });

  it("truncates and appends ellipsis when over limit", () => {
    expect(shortenText("fastclaw-status-output", 10)).toBe("fastclaw-…");
  });

  it("counts multi-byte characters correctly", () => {
    expect(shortenText("hello🙂world", 7)).toBe("hello🙂…");
  });
});
