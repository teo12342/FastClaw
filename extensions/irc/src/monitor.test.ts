import { describe, expect, it } from "vitest";
import { resolveIrcInboundTarget } from "./monitor.js";

describe("irc monitor inbound target", () => {
  it("keeps channel target for group messages", () => {
    expect(
      resolveIrcInboundTarget({
        target: "#fastclaw",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: true,
      target: "#fastclaw",
      rawTarget: "#fastclaw",
    });
  });

  it("maps DM target to sender nick and preserves raw target", () => {
    expect(
      resolveIrcInboundTarget({
        target: "fastclaw-bot",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: false,
      target: "alice",
      rawTarget: "fastclaw-bot",
    });
  });

  it("falls back to raw target when sender nick is empty", () => {
    expect(
      resolveIrcInboundTarget({
        target: "fastclaw-bot",
        senderNick: " ",
      }),
    ).toEqual({
      isGroup: false,
      target: "fastclaw-bot",
      rawTarget: "fastclaw-bot",
    });
  });
});
