import { describe, expect, it } from "vitest";
import { isFastClawManagedMatrixDevice, summarizeMatrixDeviceHealth } from "./device-health.js";

describe("matrix device health", () => {
  it("detects FastClaw-managed device names", () => {
    expect(isFastClawManagedMatrixDevice("FastClaw Gateway")).toBe(true);
    expect(isFastClawManagedMatrixDevice("FastClaw Debug")).toBe(true);
    expect(isFastClawManagedMatrixDevice("Element iPhone")).toBe(false);
    expect(isFastClawManagedMatrixDevice(null)).toBe(false);
  });

  it("summarizes stale FastClaw-managed devices separately from the current device", () => {
    const summary = summarizeMatrixDeviceHealth([
      {
        deviceId: "du314Zpw3A",
        displayName: "FastClaw Gateway",
        current: true,
      },
      {
        deviceId: "BritdXC6iL",
        displayName: "FastClaw Gateway",
        current: false,
      },
      {
        deviceId: "G6NJU9cTgs",
        displayName: "FastClaw Debug",
        current: false,
      },
      {
        deviceId: "phone123",
        displayName: "Element iPhone",
        current: false,
      },
    ]);

    expect(summary.currentDeviceId).toBe("du314Zpw3A");
    expect(summary.currentFastClawDevices).toEqual([
      expect.objectContaining({ deviceId: "du314Zpw3A" }),
    ]);
    expect(summary.staleFastClawDevices).toEqual([
      expect.objectContaining({ deviceId: "BritdXC6iL" }),
      expect.objectContaining({ deviceId: "G6NJU9cTgs" }),
    ]);
  });
});
