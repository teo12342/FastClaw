---
summary: "Run FastClaw in a rootless Podman container"
read_when:
  - You want a containerized gateway with Podman instead of Docker
title: "Podman"
---

# Podman

Run the FastClaw gateway in a **rootless** Podman container. Uses the same image as Docker (build from the repo [Dockerfile](https://github.com/fastclaw/fastclaw/blob/main/Dockerfile)).

## Requirements

- Podman (rootless)
- Sudo for one-time setup (create user, build image)

## Quick start

**1. One-time setup** (from repo root; creates user, builds image, installs launch script):

```bash
./setup-podman.sh
```

This also creates a minimal `~fastclaw/.fastclaw/fastclaw.json` (sets `gateway.mode="local"`) so the gateway can start without running the wizard.

By default the container is **not** installed as a systemd service, you start it manually (see below). For a production-style setup with auto-start and restarts, install it as a systemd Quadlet user service instead:

```bash
./setup-podman.sh --quadlet
```

(Or set `FASTCLAW_PODMAN_QUADLET=1`; use `--container` to install only the container and launch script.)

**2. Start gateway** (manual, for quick smoke testing):

```bash
./scripts/run-fastclaw-podman.sh launch
```

**3. Onboarding wizard** (e.g. to add channels or providers):

```bash
./scripts/run-fastclaw-podman.sh launch setup
```

Then open `http://127.0.0.1:18789/` and use the token from `~fastclaw/.fastclaw/.env` (or the value printed by setup).

## Systemd (Quadlet, optional)

If you ran `./setup-podman.sh --quadlet` (or `FASTCLAW_PODMAN_QUADLET=1`), a [Podman Quadlet](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html) unit is installed so the gateway runs as a systemd user service for the fastclaw user. The service is enabled and started at the end of setup.

- **Start:** `sudo systemctl --machine fastclaw@ --user start fastclaw.service`
- **Stop:** `sudo systemctl --machine fastclaw@ --user stop fastclaw.service`
- **Status:** `sudo systemctl --machine fastclaw@ --user status fastclaw.service`
- **Logs:** `sudo journalctl --machine fastclaw@ --user -u fastclaw.service -f`

The quadlet file lives at `~fastclaw/.config/containers/systemd/fastclaw.container`. To change ports or env, edit that file (or the `.env` it sources), then `sudo systemctl --machine fastclaw@ --user daemon-reload` and restart the service. On boot, the service starts automatically if lingering is enabled for fastclaw (setup does this when loginctl is available).

To add quadlet **after** an initial setup that did not use it, re-run: `./setup-podman.sh --quadlet`.

## The fastclaw user (non-login)

`setup-podman.sh` creates a dedicated system user `fastclaw`:

- **Shell:** `nologin` — no interactive login; reduces attack surface.
- **Home:** e.g. `/home/fastclaw` — holds `~/.fastclaw` (config, workspace) and the launch script `run-fastclaw-podman.sh`.
- **Rootless Podman:** The user must have a **subuid** and **subgid** range. Many distros assign these automatically when the user is created. If setup prints a warning, add lines to `/etc/subuid` and `/etc/subgid`:

  ```text
  fastclaw:100000:65536
  ```

  Then start the gateway as that user (e.g. from cron or systemd):

  ```bash
  sudo -u fastclaw /home/fastclaw/run-fastclaw-podman.sh
  sudo -u fastclaw /home/fastclaw/run-fastclaw-podman.sh setup
  ```

- **Config:** Only `fastclaw` and root can access `/home/fastclaw/.fastclaw`. To edit config: use the Control UI once the gateway is running, or `sudo -u fastclaw $EDITOR /home/fastclaw/.fastclaw/fastclaw.json`.

## Environment and config

- **Token:** Stored in `~fastclaw/.fastclaw/.env` as `FASTCLAW_GATEWAY_TOKEN`. `setup-podman.sh` and `run-fastclaw-podman.sh` generate it if missing (uses `openssl`, `python3`, or `od`).
- **Optional:** In that `.env` you can set provider keys (e.g. `GROQ_API_KEY`, `OLLAMA_API_KEY`) and other FastClaw env vars.
- **Host ports:** By default the script maps `18789` (gateway) and `18790` (bridge). Override the **host** port mapping with `FASTCLAW_PODMAN_GATEWAY_HOST_PORT` and `FASTCLAW_PODMAN_BRIDGE_HOST_PORT` when launching.
- **Gateway bind:** By default, `run-fastclaw-podman.sh` starts the gateway with `--bind loopback` for safe local access. To expose on LAN, set `FASTCLAW_GATEWAY_BIND=lan` and configure `gateway.controlUi.allowedOrigins` (or explicitly enable host-header fallback) in `fastclaw.json`.
- **Paths:** Host config and workspace default to `~fastclaw/.fastclaw` and `~fastclaw/.fastclaw/workspace`. Override the host paths used by the launch script with `FASTCLAW_CONFIG_DIR` and `FASTCLAW_WORKSPACE_DIR`.

## Useful commands

- **Logs:** With quadlet: `sudo journalctl --machine fastclaw@ --user -u fastclaw.service -f`. With script: `sudo -u fastclaw podman logs -f fastclaw`
- **Stop:** With quadlet: `sudo systemctl --machine fastclaw@ --user stop fastclaw.service`. With script: `sudo -u fastclaw podman stop fastclaw`
- **Start again:** With quadlet: `sudo systemctl --machine fastclaw@ --user start fastclaw.service`. With script: re-run the launch script or `podman start fastclaw`
- **Remove container:** `sudo -u fastclaw podman rm -f fastclaw` — config and workspace on the host are kept

## Troubleshooting

- **Permission denied (EACCES) on config or auth-profiles:** The container defaults to `--userns=keep-id` and runs as the same uid/gid as the host user running the script. Ensure your host `FASTCLAW_CONFIG_DIR` and `FASTCLAW_WORKSPACE_DIR` are owned by that user.
- **Gateway start blocked (missing `gateway.mode=local`):** Ensure `~fastclaw/.fastclaw/fastclaw.json` exists and sets `gateway.mode="local"`. `setup-podman.sh` creates this file if missing.
- **Rootless Podman fails for user fastclaw:** Check `/etc/subuid` and `/etc/subgid` contain a line for `fastclaw` (e.g. `fastclaw:100000:65536`). Add it if missing and restart.
- **Container name in use:** The launch script uses `podman run --replace`, so the existing container is replaced when you start again. To clean up manually: `podman rm -f fastclaw`.
- **Script not found when running as fastclaw:** Ensure `setup-podman.sh` was run so that `run-fastclaw-podman.sh` is copied to fastclaw’s home (e.g. `/home/fastclaw/run-fastclaw-podman.sh`).
- **Quadlet service not found or fails to start:** Run `sudo systemctl --machine fastclaw@ --user daemon-reload` after editing the `.container` file. Quadlet requires cgroups v2: `podman info --format '{{.Host.CgroupsVersion}}'` should show `2`.

## Optional: run as your own user

To run the gateway as your normal user (no dedicated fastclaw user): build the image, create `~/.fastclaw/.env` with `FASTCLAW_GATEWAY_TOKEN`, and run the container with `--userns=keep-id` and mounts to your `~/.fastclaw`. The launch script is designed for the fastclaw-user flow; for a single-user setup you can instead run the `podman run` command from the script manually, pointing config and workspace to your home. Recommended for most users: use `setup-podman.sh` and run as the fastclaw user so config and process are isolated.
