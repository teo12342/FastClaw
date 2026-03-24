---
summary: "CLI reference for `fastclaw browser` (profiles, tabs, actions, extension relay)"
read_when:
  - You use `fastclaw browser` and want examples for common tasks
  - You want to control a browser running on another machine via a node host
  - You want to use the Chrome extension relay (attach/detach via toolbar button)
title: "browser"
---

# `fastclaw browser`

Manage FastClaw’s browser control server and run browser actions (tabs, snapshots, screenshots, navigation, clicks, typing).

Related:

- Browser tool + API: [Browser tool](/tools/browser)
- Chrome extension relay: [Chrome extension](/tools/chrome-extension)

## Common flags

- `--url <gatewayWsUrl>`: Gateway WebSocket URL (defaults to config).
- `--token <token>`: Gateway token (if required).
- `--timeout <ms>`: request timeout (ms).
- `--browser-profile <name>`: choose a browser profile (default from config).
- `--json`: machine-readable output (where supported).

## Quick start (local)

```bash
fastclaw browser --browser-profile chrome tabs
fastclaw browser --browser-profile fastclaw start
fastclaw browser --browser-profile fastclaw open https://example.com
fastclaw browser --browser-profile fastclaw snapshot
```

## Profiles

Profiles are named browser routing configs. In practice:

- `fastclaw`: launches/attaches to a dedicated FastClaw-managed Chrome instance (isolated user data dir).
- `chrome`: controls your existing Chrome tab(s) via the Chrome extension relay.

```bash
fastclaw browser profiles
fastclaw browser create-profile --name work --color "#FF5A36"
fastclaw browser delete-profile --name work
```

Use a specific profile:

```bash
fastclaw browser --browser-profile work tabs
```

## Tabs

```bash
fastclaw browser tabs
fastclaw browser open https://docs.fastclaw.ai
fastclaw browser focus <targetId>
fastclaw browser close <targetId>
```

## Snapshot / screenshot / actions

Snapshot:

```bash
fastclaw browser snapshot
```

Screenshot:

```bash
fastclaw browser screenshot
```

Navigate/click/type (ref-based UI automation):

```bash
fastclaw browser navigate https://example.com
fastclaw browser click <ref>
fastclaw browser type <ref> "hello"
```

## Chrome extension relay (attach via toolbar button)

This mode lets the agent control an existing Chrome tab that you attach manually (it does not auto-attach).

Install the unpacked extension to a stable path:

```bash
fastclaw browser extension install
fastclaw browser extension path
```

Then Chrome → `chrome://extensions` → enable “Developer mode” → “Load unpacked” → select the printed folder.

Full guide: [Chrome extension](/tools/chrome-extension)

## Remote browser control (node host proxy)

If the Gateway runs on a different machine than the browser, run a **node host** on the machine that has Chrome/Brave/Edge/Chromium. The Gateway will proxy browser actions to that node (no separate browser control server required).

Use `gateway.nodes.browser.mode` to control auto-routing and `gateway.nodes.browser.node` to pin a specific node if multiple are connected.

Security + remote setup: [Browser tool](/tools/browser), [Remote access](/gateway/remote), [Tailscale](/gateway/tailscale), [Security](/gateway/security)
