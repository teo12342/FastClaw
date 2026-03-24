---
summary: "CLI reference for `fastclaw approvals` (exec approvals for gateway or node hosts)"
read_when:
  - You want to edit exec approvals from the CLI
  - You need to manage allowlists on gateway or node hosts
title: "approvals"
---

# `fastclaw approvals`

Manage exec approvals for the **local host**, **gateway host**, or a **node host**.
By default, commands target the local approvals file on disk. Use `--gateway` to target the gateway, or `--node` to target a specific node.

Related:

- Exec approvals: [Exec approvals](/tools/exec-approvals)
- Nodes: [Nodes](/nodes)

## Common commands

```bash
fastclaw approvals get
fastclaw approvals get --node <id|name|ip>
fastclaw approvals get --gateway
```

## Replace approvals from a file

```bash
fastclaw approvals set --file ./exec-approvals.json
fastclaw approvals set --node <id|name|ip> --file ./exec-approvals.json
fastclaw approvals set --gateway --file ./exec-approvals.json
```

## Allowlist helpers

```bash
fastclaw approvals allowlist add "~/Projects/**/bin/rg"
fastclaw approvals allowlist add --agent main --node <id|name|ip> "/usr/bin/uptime"
fastclaw approvals allowlist add --agent "*" "/usr/bin/uname"

fastclaw approvals allowlist remove "~/Projects/**/bin/rg"
```

## Notes

- `--node` uses the same resolver as `fastclaw nodes` (id, name, ip, or id prefix).
- `--agent` defaults to `"*"`, which applies to all agents.
- The node host must advertise `system.execApprovals.get/set` (macOS app or headless node host).
- Approvals files are stored per host at `~/.fastclaw/exec-approvals.json`.
