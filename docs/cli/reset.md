---
summary: "CLI reference for `fastclaw reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `fastclaw reset`

Reset local config/state (keeps the CLI installed).

```bash
fastclaw reset
fastclaw reset --dry-run
fastclaw reset --scope config+creds+sessions --yes --non-interactive
```
