import { describe, expect, it } from "vitest";
import {
  ensureFastClawExecMarkerOnProcess,
  markFastClawExecEnv,
  FASTCLAW_CLI_ENV_VALUE,
  FASTCLAW_CLI_ENV_VAR,
} from "./fastclaw-exec-env.js";

describe("markFastClawExecEnv", () => {
  it("returns a cloned env object with the exec marker set", () => {
    const env = { PATH: "/usr/bin", FASTCLAW_CLI: "0" };
    const marked = markFastClawExecEnv(env);

    expect(marked).toEqual({
      PATH: "/usr/bin",
      FASTCLAW_CLI: FASTCLAW_CLI_ENV_VALUE,
    });
    expect(marked).not.toBe(env);
    expect(env.FASTCLAW_CLI).toBe("0");
  });
});

describe("ensureFastClawExecMarkerOnProcess", () => {
  it("mutates and returns the provided process env", () => {
    const env: NodeJS.ProcessEnv = { PATH: "/usr/bin" };

    expect(ensureFastClawExecMarkerOnProcess(env)).toBe(env);
    expect(env[FASTCLAW_CLI_ENV_VAR]).toBe(FASTCLAW_CLI_ENV_VALUE);
  });

  it("defaults to mutating process.env when no env object is provided", () => {
    const previous = process.env[FASTCLAW_CLI_ENV_VAR];
    delete process.env[FASTCLAW_CLI_ENV_VAR];

    try {
      expect(ensureFastClawExecMarkerOnProcess()).toBe(process.env);
      expect(process.env[FASTCLAW_CLI_ENV_VAR]).toBe(FASTCLAW_CLI_ENV_VALUE);
    } finally {
      if (previous === undefined) {
        delete process.env[FASTCLAW_CLI_ENV_VAR];
      } else {
        process.env[FASTCLAW_CLI_ENV_VAR] = previous;
      }
    }
  });
});
