import { describe, expect, it } from "vitest";
import { formatBackupCreateSummary, type BackupCreateResult } from "./backup-create.js";

function makeResult(overrides: Partial<BackupCreateResult> = {}): BackupCreateResult {
  return {
    createdAt: "2026-01-01T00:00:00.000Z",
    archiveRoot: "fastclaw-backup-2026-01-01",
    archivePath: "/tmp/fastclaw-backup.tar.gz",
    dryRun: false,
    includeWorkspace: true,
    onlyConfig: false,
    verified: false,
    assets: [],
    skipped: [],
    ...overrides,
  };
}

describe("formatBackupCreateSummary", () => {
  it("formats created archives with included and skipped paths", () => {
    const lines = formatBackupCreateSummary(
      makeResult({
        verified: true,
        assets: [
          {
            kind: "state",
            sourcePath: "/state",
            archivePath: "archive/state",
            displayPath: "~/.fastclaw",
          },
        ],
        skipped: [
          {
            kind: "workspace",
            sourcePath: "/workspace",
            displayPath: "~/Projects/fastclaw",
            reason: "covered",
            coveredBy: "~/.fastclaw",
          },
        ],
      }),
    );

    expect(lines).toEqual([
      "Backup archive: /tmp/fastclaw-backup.tar.gz",
      "Included 1 path:",
      "- state: ~/.fastclaw",
      "Skipped 1 path:",
      "- workspace: ~/Projects/fastclaw (covered by ~/.fastclaw)",
      "Created /tmp/fastclaw-backup.tar.gz",
      "Archive verification: passed",
    ]);
  });

  it("formats dry runs and pluralized counts", () => {
    const lines = formatBackupCreateSummary(
      makeResult({
        dryRun: true,
        assets: [
          {
            kind: "config",
            sourcePath: "/config",
            archivePath: "archive/config",
            displayPath: "~/.fastclaw/config.json",
          },
          {
            kind: "credentials",
            sourcePath: "/oauth",
            archivePath: "archive/oauth",
            displayPath: "~/.fastclaw/oauth",
          },
        ],
      }),
    );

    expect(lines).toEqual([
      "Backup archive: /tmp/fastclaw-backup.tar.gz",
      "Included 2 paths:",
      "- config: ~/.fastclaw/config.json",
      "- credentials: ~/.fastclaw/oauth",
      "Dry run only; archive was not written.",
    ]);
  });
});
