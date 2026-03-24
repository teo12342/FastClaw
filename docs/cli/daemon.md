---
summary: "CLI reference for `fastclaw daemon` (legacy alias for gateway service management)"
read_when:
  - You still use `fastclaw daemon ...` in scripts
  - You need service lifecycle commands (install/start/stop/restart/status)
title: "daemon"
---

# `fastclaw daemon`

Legacy alias for Gateway service management commands.

`fastclaw daemon ...` maps to the same service control surface as `fastclaw gateway ...` service commands.

## Usage

```bash
fastclaw daemon status
fastclaw daemon install
fastclaw daemon start
fastclaw daemon stop
fastclaw daemon restart
fastclaw daemon uninstall
```

## Subcommands

- `status`: show service install state and probe Gateway health
- `install`: install service (`launchd`/`systemd`/`schtasks`)
- `uninstall`: remove service
- `start`: start service
- `stop`: stop service
- `restart`: restart service

## Common options

- `status`: `--url`, `--token`, `--password`, `--timeout`, `--no-probe`, `--deep`, `--json`
- `install`: `--port`, `--runtime <node|bun>`, `--token`, `--force`, `--json`
- lifecycle (`uninstall|start|stop|restart`): `--json`

## Prefer

Use [`fastclaw gateway`](/cli/gateway) for current docs and examples.
