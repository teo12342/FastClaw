import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "fastclaw",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "fastclaw", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "fastclaw", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "fastclaw", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "fastclaw", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "fastclaw", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "fastclaw", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "fastclaw", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "fastclaw", "--profile", "work", "--dev", "status"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".fastclaw-dev");
    expect(env.FASTCLAW_PROFILE).toBe("dev");
    expect(env.FASTCLAW_STATE_DIR).toBe(expectedStateDir);
    expect(env.FASTCLAW_CONFIG_PATH).toBe(path.join(expectedStateDir, "fastclaw.json"));
    expect(env.FASTCLAW_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      FASTCLAW_STATE_DIR: "/custom",
      FASTCLAW_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.FASTCLAW_STATE_DIR).toBe("/custom");
    expect(env.FASTCLAW_GATEWAY_PORT).toBe("19099");
    expect(env.FASTCLAW_CONFIG_PATH).toBe(path.join("/custom", "fastclaw.json"));
  });

  it("uses FASTCLAW_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      FASTCLAW_HOME: "/srv/fastclaw-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/fastclaw-home");
    expect(env.FASTCLAW_STATE_DIR).toBe(path.join(resolvedHome, ".fastclaw-work"));
    expect(env.FASTCLAW_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".fastclaw-work", "fastclaw.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "fastclaw doctor --fix",
      env: {},
      expected: "fastclaw doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "fastclaw doctor --fix",
      env: { FASTCLAW_PROFILE: "default" },
      expected: "fastclaw doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "fastclaw doctor --fix",
      env: { FASTCLAW_PROFILE: "Default" },
      expected: "fastclaw doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "fastclaw doctor --fix",
      env: { FASTCLAW_PROFILE: "bad profile" },
      expected: "fastclaw doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "fastclaw --profile work doctor --fix",
      env: { FASTCLAW_PROFILE: "work" },
      expected: "fastclaw --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "fastclaw --dev doctor",
      env: { FASTCLAW_PROFILE: "dev" },
      expected: "fastclaw --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("fastclaw doctor --fix", { FASTCLAW_PROFILE: "work" })).toBe(
      "fastclaw --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("fastclaw doctor --fix", { FASTCLAW_PROFILE: "  jbfastclaw  " })).toBe(
      "fastclaw --profile jbfastclaw doctor --fix",
    );
  });

  it("handles command with no args after fastclaw", () => {
    expect(formatCliCommand("fastclaw", { FASTCLAW_PROFILE: "test" })).toBe(
      "fastclaw --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm fastclaw doctor", { FASTCLAW_PROFILE: "work" })).toBe(
      "pnpm fastclaw --profile work doctor",
    );
  });
});
