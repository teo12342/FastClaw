import { describe, expect, it } from "vitest";
import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it.each([
    {
      name: "help flag",
      argv: ["node", "fastclaw", "--help"],
      expected: true,
    },
    {
      name: "version flag",
      argv: ["node", "fastclaw", "-V"],
      expected: true,
    },
    {
      name: "normal command",
      argv: ["node", "fastclaw", "status"],
      expected: false,
    },
    {
      name: "root -v alias",
      argv: ["node", "fastclaw", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "fastclaw", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with log-level",
      argv: ["node", "fastclaw", "--log-level", "debug", "-v"],
      expected: true,
    },
    {
      name: "subcommand -v should not be treated as version",
      argv: ["node", "fastclaw", "acp", "-v"],
      expected: false,
    },
    {
      name: "root -v alias with equals profile",
      argv: ["node", "fastclaw", "--profile=work", "-v"],
      expected: true,
    },
    {
      name: "subcommand path after global root flags should not be treated as version",
      argv: ["node", "fastclaw", "--dev", "skills", "list", "-v"],
      expected: false,
    },
  ])("detects help/version flags: $name", ({ argv, expected }) => {
    expect(hasHelpOrVersion(argv)).toBe(expected);
  });

  it.each([
    {
      name: "single command with trailing flag",
      argv: ["node", "fastclaw", "status", "--json"],
      expected: ["status"],
    },
    {
      name: "two-part command",
      argv: ["node", "fastclaw", "agents", "list"],
      expected: ["agents", "list"],
    },
    {
      name: "terminator cuts parsing",
      argv: ["node", "fastclaw", "status", "--", "ignored"],
      expected: ["status"],
    },
  ])("extracts command path: $name", ({ argv, expected }) => {
    expect(getCommandPath(argv, 2)).toEqual(expected);
  });

  it.each([
    {
      name: "returns first command token",
      argv: ["node", "fastclaw", "agents", "list"],
      expected: "agents",
    },
    {
      name: "returns null when no command exists",
      argv: ["node", "fastclaw"],
      expected: null,
    },
  ])("returns primary command: $name", ({ argv, expected }) => {
    expect(getPrimaryCommand(argv)).toBe(expected);
  });

  it.each([
    {
      name: "detects flag before terminator",
      argv: ["node", "fastclaw", "status", "--json"],
      flag: "--json",
      expected: true,
    },
    {
      name: "ignores flag after terminator",
      argv: ["node", "fastclaw", "--", "--json"],
      flag: "--json",
      expected: false,
    },
  ])("parses boolean flags: $name", ({ argv, flag, expected }) => {
    expect(hasFlag(argv, flag)).toBe(expected);
  });

  it.each([
    {
      name: "value in next token",
      argv: ["node", "fastclaw", "status", "--timeout", "5000"],
      expected: "5000",
    },
    {
      name: "value in equals form",
      argv: ["node", "fastclaw", "status", "--timeout=2500"],
      expected: "2500",
    },
    {
      name: "missing value",
      argv: ["node", "fastclaw", "status", "--timeout"],
      expected: null,
    },
    {
      name: "next token is another flag",
      argv: ["node", "fastclaw", "status", "--timeout", "--json"],
      expected: null,
    },
    {
      name: "flag appears after terminator",
      argv: ["node", "fastclaw", "--", "--timeout=99"],
      expected: undefined,
    },
  ])("extracts flag values: $name", ({ argv, expected }) => {
    expect(getFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "fastclaw", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "fastclaw", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "fastclaw", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it.each([
    {
      name: "missing flag",
      argv: ["node", "fastclaw", "status"],
      expected: undefined,
    },
    {
      name: "missing value",
      argv: ["node", "fastclaw", "status", "--timeout"],
      expected: null,
    },
    {
      name: "valid positive integer",
      argv: ["node", "fastclaw", "status", "--timeout", "5000"],
      expected: 5000,
    },
    {
      name: "invalid integer",
      argv: ["node", "fastclaw", "status", "--timeout", "nope"],
      expected: undefined,
    },
  ])("parses positive integer flag values: $name", ({ argv, expected }) => {
    expect(getPositiveIntFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("builds parse argv from raw args", () => {
    const cases = [
      {
        rawArgs: ["node", "fastclaw", "status"],
        expected: ["node", "fastclaw", "status"],
      },
      {
        rawArgs: ["node-22", "fastclaw", "status"],
        expected: ["node-22", "fastclaw", "status"],
      },
      {
        rawArgs: ["node-22.2.0.exe", "fastclaw", "status"],
        expected: ["node-22.2.0.exe", "fastclaw", "status"],
      },
      {
        rawArgs: ["node-22.2", "fastclaw", "status"],
        expected: ["node-22.2", "fastclaw", "status"],
      },
      {
        rawArgs: ["node-22.2.exe", "fastclaw", "status"],
        expected: ["node-22.2.exe", "fastclaw", "status"],
      },
      {
        rawArgs: ["/usr/bin/node-22.2.0", "fastclaw", "status"],
        expected: ["/usr/bin/node-22.2.0", "fastclaw", "status"],
      },
      {
        rawArgs: ["node24", "fastclaw", "status"],
        expected: ["node24", "fastclaw", "status"],
      },
      {
        rawArgs: ["/usr/bin/node24", "fastclaw", "status"],
        expected: ["/usr/bin/node24", "fastclaw", "status"],
      },
      {
        rawArgs: ["node24.exe", "fastclaw", "status"],
        expected: ["node24.exe", "fastclaw", "status"],
      },
      {
        rawArgs: ["nodejs", "fastclaw", "status"],
        expected: ["nodejs", "fastclaw", "status"],
      },
      {
        rawArgs: ["node-dev", "fastclaw", "status"],
        expected: ["node", "fastclaw", "node-dev", "fastclaw", "status"],
      },
      {
        rawArgs: ["fastclaw", "status"],
        expected: ["node", "fastclaw", "status"],
      },
      {
        rawArgs: ["bun", "src/entry.ts", "status"],
        expected: ["bun", "src/entry.ts", "status"],
      },
    ] as const;

    for (const testCase of cases) {
      const parsed = buildParseArgv({
        programName: "fastclaw",
        rawArgs: [...testCase.rawArgs],
      });
      expect(parsed).toEqual([...testCase.expected]);
    }
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "fastclaw",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "fastclaw", "status"]);
  });

  it("decides when to migrate state", () => {
    const nonMutatingArgv = [
      ["node", "fastclaw", "status"],
      ["node", "fastclaw", "health"],
      ["node", "fastclaw", "sessions"],
      ["node", "fastclaw", "config", "get", "update"],
      ["node", "fastclaw", "config", "unset", "update"],
      ["node", "fastclaw", "models", "list"],
      ["node", "fastclaw", "models", "status"],
      ["node", "fastclaw", "memory", "status"],
      ["node", "fastclaw", "agent", "--message", "hi"],
    ] as const;
    const mutatingArgv = [
      ["node", "fastclaw", "agents", "list"],
      ["node", "fastclaw", "message", "send"],
    ] as const;

    for (const argv of nonMutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(false);
    }
    for (const argv of mutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(true);
    }
  });

  it.each([
    { path: ["status"], expected: false },
    { path: ["config", "get"], expected: false },
    { path: ["models", "status"], expected: false },
    { path: ["agents", "list"], expected: true },
  ])("reuses command path for migrate state decisions: $path", ({ path, expected }) => {
    expect(shouldMigrateStateFromPath(path)).toBe(expected);
  });
});
