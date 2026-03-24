import { afterEach, describe, expect, it, vi } from "vitest";

type LoggerModule = typeof import("./logger.js");

const originalGetBuiltinModule = (
  process as NodeJS.Process & { getBuiltinModule?: (id: string) => unknown }
).getBuiltinModule;

async function importBrowserSafeLogger(params?: {
  resolvePreferredFastClawTmpDir?: ReturnType<typeof vi.fn>;
}): Promise<{
  module: LoggerModule;
  resolvePreferredFastClawTmpDir: ReturnType<typeof vi.fn>;
}> {
  vi.resetModules();
  const resolvePreferredFastClawTmpDir =
    params?.resolvePreferredFastClawTmpDir ??
    vi.fn(() => {
      throw new Error("resolvePreferredFastClawTmpDir should not run during browser-safe import");
    });

  vi.doMock("../infra/tmp-fastclaw-dir.js", async () => {
    const actual = await vi.importActual<typeof import("../infra/tmp-fastclaw-dir.js")>(
      "../infra/tmp-fastclaw-dir.js",
    );
    return {
      ...actual,
      resolvePreferredFastClawTmpDir,
    };
  });

  Object.defineProperty(process, "getBuiltinModule", {
    configurable: true,
    value: undefined,
  });

  const module = await import("./logger.js");
  return { module, resolvePreferredFastClawTmpDir };
}

describe("logging/logger browser-safe import", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("../infra/tmp-fastclaw-dir.js");
    Object.defineProperty(process, "getBuiltinModule", {
      configurable: true,
      value: originalGetBuiltinModule,
    });
  });

  it("does not resolve the preferred temp dir at import time when node fs is unavailable", async () => {
    const { module, resolvePreferredFastClawTmpDir } = await importBrowserSafeLogger();

    expect(resolvePreferredFastClawTmpDir).not.toHaveBeenCalled();
    expect(module.DEFAULT_LOG_DIR).toBe("/tmp/fastclaw");
    expect(module.DEFAULT_LOG_FILE).toBe("/tmp/fastclaw/fastclaw.log");
  });

  it("disables file logging when imported in a browser-like environment", async () => {
    const { module, resolvePreferredFastClawTmpDir } = await importBrowserSafeLogger();

    expect(module.getResolvedLoggerSettings()).toMatchObject({
      level: "silent",
      file: "/tmp/fastclaw/fastclaw.log",
    });
    expect(module.isFileLogLevelEnabled("info")).toBe(false);
    expect(() => module.getLogger().info("browser-safe")).not.toThrow();
    expect(resolvePreferredFastClawTmpDir).not.toHaveBeenCalled();
  });
});
