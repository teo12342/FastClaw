import { describe, expect, it } from "vitest";
import { buildPlatformRuntimeLogHints, buildPlatformServiceStartHints } from "./runtime-hints.js";

describe("buildPlatformRuntimeLogHints", () => {
  it("renders launchd log hints on darwin", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "darwin",
        env: {
          FASTCLAW_STATE_DIR: "/tmp/fastclaw-state",
          FASTCLAW_LOG_PREFIX: "gateway",
        },
        systemdServiceName: "fastclaw-gateway",
        windowsTaskName: "FastClaw Gateway",
      }),
    ).toEqual([
      "Launchd stdout (if installed): /tmp/fastclaw-state/logs/gateway.log",
      "Launchd stderr (if installed): /tmp/fastclaw-state/logs/gateway.err.log",
    ]);
  });

  it("renders systemd and windows hints by platform", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "linux",
        systemdServiceName: "fastclaw-gateway",
        windowsTaskName: "FastClaw Gateway",
      }),
    ).toEqual(["Logs: journalctl --user -u fastclaw-gateway.service -n 200 --no-pager"]);
    expect(
      buildPlatformRuntimeLogHints({
        platform: "win32",
        systemdServiceName: "fastclaw-gateway",
        windowsTaskName: "FastClaw Gateway",
      }),
    ).toEqual(['Logs: schtasks /Query /TN "FastClaw Gateway" /V /FO LIST']);
  });
});

describe("buildPlatformServiceStartHints", () => {
  it("builds platform-specific service start hints", () => {
    expect(
      buildPlatformServiceStartHints({
        platform: "darwin",
        installCommand: "fastclaw gateway install",
        startCommand: "fastclaw gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.fastclaw.gateway.plist",
        systemdServiceName: "fastclaw-gateway",
        windowsTaskName: "FastClaw Gateway",
      }),
    ).toEqual([
      "fastclaw gateway install",
      "fastclaw gateway",
      "launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.fastclaw.gateway.plist",
    ]);
    expect(
      buildPlatformServiceStartHints({
        platform: "linux",
        installCommand: "fastclaw gateway install",
        startCommand: "fastclaw gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.fastclaw.gateway.plist",
        systemdServiceName: "fastclaw-gateway",
        windowsTaskName: "FastClaw Gateway",
      }),
    ).toEqual([
      "fastclaw gateway install",
      "fastclaw gateway",
      "systemctl --user start fastclaw-gateway.service",
    ]);
  });
});
