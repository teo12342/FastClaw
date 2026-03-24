import { vi } from "vitest";
import { installChromeUserDataDirHooks } from "./chrome-user-data-dir.test-harness.js";

const chromeUserDataDir = { dir: "/tmp/fastclaw" };
installChromeUserDataDirHooks(chromeUserDataDir);

vi.mock("./chrome.js", () => ({
  isChromeCdpReady: vi.fn(async () => true),
  isChromeReachable: vi.fn(async () => true),
  launchFastClawChrome: vi.fn(async () => {
    throw new Error("unexpected launch");
  }),
  resolveFastClawUserDataDir: vi.fn(() => chromeUserDataDir.dir),
  stopFastClawChrome: vi.fn(async () => {}),
}));
