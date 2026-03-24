---
summary: "CLI reference for `fastclaw voicecall` (voice-call plugin command surface)"
read_when:
  - You use the voice-call plugin and want the CLI entry points
  - You want quick examples for `voicecall call|continue|status|tail|expose`
title: "voicecall"
---

# `fastclaw voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.

Primary doc:

- Voice-call plugin: [Voice Call](/plugins/voice-call)

## Common commands

```bash
fastclaw voicecall status --call-id <id>
fastclaw voicecall call --to "+15555550123" --message "Hello" --mode notify
fastclaw voicecall continue --call-id <id> --message "Any questions?"
fastclaw voicecall end --call-id <id>
```

## Exposing webhooks (Tailscale)

```bash
fastclaw voicecall expose --mode serve
fastclaw voicecall expose --mode funnel
fastclaw voicecall expose --mode off
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.
