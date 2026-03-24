---
summary: "CLI reference for `fastclaw logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `fastclaw logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
fastclaw logs
fastclaw logs --follow
fastclaw logs --json
fastclaw logs --limit 500
fastclaw logs --local-time
fastclaw logs --follow --local-time
```

Use `--local-time` to render timestamps in your local timezone.
