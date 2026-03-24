import type { ChildProcessWithoutNullStreams } from "node:child_process";
import { EventEmitter } from "node:events";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  vi.resetModules();
});

import "./server-context.chrome-test-harness.js";
import {
  PROFILE_ATTACH_RETRY_TIMEOUT_MS,
  PROFILE_HTTP_REACHABILITY_TIMEOUT_MS,
} from "./cdp-timeouts.js";
import * as chromeModule from "./chrome.js";
import type { RunningChrome } from "./chrome.js";
import type { BrowserServerState } from "./server-context.js";
import { createBrowserRouteContext } from "./server-context.js";

function makeBrowserState(): BrowserServerState {
  return {
    // oxlint-disable-next-line typescript/no-explicit-any
    server: null as any,
    port: 0,
    resolved: {
      enabled: true,
      controlPort: 18791,
      cdpProtocol: "http",
      cdpHost: "127.0.0.1",
      cdpIsLoopback: true,
      cdpPortRangeStart: 18800,
      cdpPortRangeEnd: 18810,
      evaluateEnabled: false,
      remoteCdpTimeoutMs: 1500,
      remoteCdpHandshakeTimeoutMs: 3000,
      extraArgs: [],
      color: "#FF4500",
      headless: true,
      noSandbox: false,
      attachOnly: false,
      ssrfPolicy: { allowPrivateNetwork: true },
      defaultProfile: "fastclaw",
      profiles: {
        fastclaw: { cdpPort: 18800, color: "#FF4500" },
      },
    },
    profiles: new Map(),
  };
}

function mockLaunchedChrome(
  launchFastClawChrome: { mockResolvedValue: (value: RunningChrome) => unknown },
  pid: number,
) {
  const proc = new EventEmitter() as unknown as ChildProcessWithoutNullStreams;
  launchFastClawChrome.mockResolvedValue({
    pid,
    exe: { kind: "chromium", path: "/usr/bin/chromium" },
    userDataDir: "/tmp/fastclaw-test",
    cdpPort: 18800,
    startedAt: Date.now(),
    proc,
  });
}

function setupEnsureBrowserAvailableHarness() {
  vi.useFakeTimers();

  const launchFastClawChrome = vi.mocked(chromeModule.launchFastClawChrome);
  const stopFastClawChrome = vi.mocked(chromeModule.stopFastClawChrome);
  const isChromeReachable = vi.mocked(chromeModule.isChromeReachable);
  const isChromeCdpReady = vi.mocked(chromeModule.isChromeCdpReady);
  isChromeReachable.mockResolvedValue(false);

  const state = makeBrowserState();
  const ctx = createBrowserRouteContext({ getState: () => state });
  const profile = ctx.forProfile("fastclaw");

  return { launchFastClawChrome, stopFastClawChrome, isChromeCdpReady, profile };
}

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("browser server-context ensureBrowserAvailable", () => {
  it("waits for CDP readiness after launching to avoid follow-up PortInUseError races (#21149)", async () => {
    const { launchFastClawChrome, stopFastClawChrome, isChromeCdpReady, profile } =
      setupEnsureBrowserAvailableHarness();
    isChromeCdpReady.mockResolvedValueOnce(false).mockResolvedValue(true);
    mockLaunchedChrome(launchFastClawChrome, 123);

    const promise = profile.ensureBrowserAvailable();
    await vi.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toBeUndefined();

    expect(launchFastClawChrome).toHaveBeenCalledTimes(1);
    expect(isChromeCdpReady).toHaveBeenCalled();
    expect(stopFastClawChrome).not.toHaveBeenCalled();
  });

  it("stops launched chrome when CDP readiness never arrives", async () => {
    const { launchFastClawChrome, stopFastClawChrome, isChromeCdpReady, profile } =
      setupEnsureBrowserAvailableHarness();
    isChromeCdpReady.mockResolvedValue(false);
    mockLaunchedChrome(launchFastClawChrome, 321);

    const promise = profile.ensureBrowserAvailable();
    const rejected = expect(promise).rejects.toThrow("not reachable after start");
    await vi.advanceTimersByTimeAsync(8100);
    await rejected;

    expect(launchFastClawChrome).toHaveBeenCalledTimes(1);
    expect(stopFastClawChrome).toHaveBeenCalledTimes(1);
  });

  it("reuses a pre-existing loopback browser after an initial short probe miss", async () => {
    const { launchFastClawChrome, stopFastClawChrome, isChromeCdpReady, profile } =
      setupEnsureBrowserAvailableHarness();
    const isChromeReachable = vi.mocked(chromeModule.isChromeReachable);

    isChromeReachable.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    isChromeCdpReady.mockResolvedValueOnce(true);

    await expect(profile.ensureBrowserAvailable()).resolves.toBeUndefined();

    expect(isChromeReachable).toHaveBeenNthCalledWith(
      1,
      "http://127.0.0.1:18800",
      PROFILE_HTTP_REACHABILITY_TIMEOUT_MS,
      {
        allowPrivateNetwork: true,
      },
    );
    expect(isChromeReachable).toHaveBeenNthCalledWith(
      2,
      "http://127.0.0.1:18800",
      PROFILE_ATTACH_RETRY_TIMEOUT_MS,
      {
        allowPrivateNetwork: true,
      },
    );
    expect(launchFastClawChrome).not.toHaveBeenCalled();
    expect(stopFastClawChrome).not.toHaveBeenCalled();
  });
});
