---
summary: "CLI reference for `fastclaw backup` (create local backup archives)"
read_when:
  - You want a first-class backup archive for local FastClaw state
  - You want to preview which paths would be included before reset or uninstall
title: "backup"
---

# `fastclaw backup`

Create a local backup archive for FastClaw state, config, credentials, sessions, and optionally workspaces.

```bash
fastclaw backup create
fastclaw backup create --output ~/Backups
fastclaw backup create --dry-run --json
fastclaw backup create --verify
fastclaw backup create --no-include-workspace
fastclaw backup create --only-config
fastclaw backup verify ./2026-03-09T00-00-00.000Z-fastclaw-backup.tar.gz
```

## Notes

- The archive includes a `manifest.json` file with the resolved source paths and archive layout.
- Default output is a timestamped `.tar.gz` archive in the current working directory.
- If the current working directory is inside a backed-up source tree, FastClaw falls back to your home directory for the default archive location.
- Existing archive files are never overwritten.
- Output paths inside the source state/workspace trees are rejected to avoid self-inclusion.
- `fastclaw backup verify <archive>` validates that the archive contains exactly one root manifest, rejects traversal-style archive paths, and checks that every manifest-declared payload exists in the tarball.
- `fastclaw backup create --verify` runs that validation immediately after writing the archive.
- `fastclaw backup create --only-config` backs up just the active JSON config file.

## What gets backed up

`fastclaw backup create` plans backup sources from your local FastClaw install:

- The state directory returned by FastClaw's local state resolver, usually `~/.fastclaw`
- The active config file path
- The OAuth / credentials directory
- Workspace directories discovered from the current config, unless you pass `--no-include-workspace`

If you use `--only-config`, FastClaw skips state, credentials, and workspace discovery and archives only the active config file path.

FastClaw canonicalizes paths before building the archive. If config, credentials, or a workspace already live inside the state directory, they are not duplicated as separate top-level backup sources. Missing paths are skipped.

The archive payload stores file contents from those source trees, and the embedded `manifest.json` records the resolved absolute source paths plus the archive layout used for each asset.

## Invalid config behavior

`fastclaw backup` intentionally bypasses the normal config preflight so it can still help during recovery. Because workspace discovery depends on a valid config, `fastclaw backup create` now fails fast when the config file exists but is invalid and workspace backup is still enabled.

If you still want a partial backup in that situation, rerun:

```bash
fastclaw backup create --no-include-workspace
```

That keeps state, config, and credentials in scope while skipping workspace discovery entirely.

If you only need a copy of the config file itself, `--only-config` also works when the config is malformed because it does not rely on parsing the config for workspace discovery.

## Size and performance

FastClaw does not enforce a built-in maximum backup size or per-file size limit.

Practical limits come from the local machine and destination filesystem:

- Available space for the temporary archive write plus the final archive
- Time to walk large workspace trees and compress them into a `.tar.gz`
- Time to rescan the archive if you use `fastclaw backup create --verify` or run `fastclaw backup verify`
- Filesystem behavior at the destination path. FastClaw prefers a no-overwrite hard-link publish step and falls back to exclusive copy when hard links are unsupported

Large workspaces are usually the main driver of archive size. If you want a smaller or faster backup, use `--no-include-workspace`.

For the smallest archive, use `--only-config`.
