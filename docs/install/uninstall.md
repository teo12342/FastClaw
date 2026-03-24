---
summary: "Uninstall FastClaw completely (CLI, service, state, workspace)"
read_when:
  - You want to remove FastClaw from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

# Uninstall

Two paths:

- **Easy path** if `fastclaw` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
fastclaw uninstall
```

Non-interactive (automation / npx):

```bash
fastclaw uninstall --all --yes --non-interactive
npx -y fastclaw uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
fastclaw gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
fastclaw gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${FASTCLAW_STATE_DIR:-$HOME/.fastclaw}"
```

If you set `FASTCLAW_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.fastclaw/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g fastclaw
pnpm remove -g fastclaw
bun remove -g fastclaw
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/FastClaw.app
```

Notes:

- If you used profiles (`--profile` / `FASTCLAW_PROFILE`), repeat step 3 for each state dir (defaults are `~/.fastclaw-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `fastclaw` is missing.

### macOS (launchd)

Default label is `ai.fastclaw.gateway` (or `ai.fastclaw.<profile>`; legacy `com.fastclaw.*` may still exist):

```bash
launchctl bootout gui/$UID/ai.fastclaw.gateway
rm -f ~/Library/LaunchAgents/ai.fastclaw.gateway.plist
```

If you used a profile, replace the label and plist name with `ai.fastclaw.<profile>`. Remove any legacy `com.fastclaw.*` plists if present.

### Linux (systemd user unit)

Default unit name is `fastclaw-gateway.service` (or `fastclaw-gateway-<profile>.service`):

```bash
systemctl --user disable --now fastclaw-gateway.service
rm -f ~/.config/systemd/user/fastclaw-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `FastClaw Gateway` (or `FastClaw Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "FastClaw Gateway"
Remove-Item -Force "$env:USERPROFILE\.fastclaw\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.fastclaw-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://fastclaw.ai/install.sh` or `install.ps1`, the CLI was installed with `npm install -g fastclaw@latest`.
Remove it with `npm rm -g fastclaw` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `fastclaw ...` / `bun run fastclaw ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.
