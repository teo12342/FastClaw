---
summary: "CLI reference for `fastclaw config` (get/set/unset config values)"
read_when:
  - You want to read or edit config non-interactively
title: "config"
---

# `fastclaw config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `fastclaw configure`).

## Examples

```bash
fastclaw config get browser.executablePath
fastclaw config set browser.executablePath "/usr/bin/google-chrome"
fastclaw config set agents.defaults.heartbeat.every "2h"
fastclaw config set agents.list[0].tools.exec.node "node-id-or-name"
fastclaw config unset tools.web.search.apiKey
```

## Paths

Paths use dot or bracket notation:

```bash
fastclaw config get agents.defaults.workspace
fastclaw config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
fastclaw config get agents.list
fastclaw config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--strict-json` to require JSON5 parsing. `--json` remains supported as a legacy alias.

```bash
fastclaw config set agents.defaults.heartbeat.every "0m"
fastclaw config set gateway.port 19001 --strict-json
fastclaw config set channels.whatsapp.groups '["*"]' --strict-json
```

Restart the gateway after edits.
