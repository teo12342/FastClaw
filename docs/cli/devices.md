---
summary: "CLI reference for `fastclaw devices` (device pairing + token rotation/revocation)"
read_when:
  - You are approving device pairing requests
  - You need to rotate or revoke device tokens
title: "devices"
---

# `fastclaw devices`

Manage device pairing requests and device-scoped tokens.

## Commands

### `fastclaw devices list`

List pending pairing requests and paired devices.

```
fastclaw devices list
fastclaw devices list --json
```

### `fastclaw devices remove <deviceId>`

Remove one paired device entry.

```
fastclaw devices remove <deviceId>
fastclaw devices remove <deviceId> --json
```

### `fastclaw devices clear --yes [--pending]`

Clear paired devices in bulk.

```
fastclaw devices clear --yes
fastclaw devices clear --yes --pending
fastclaw devices clear --yes --pending --json
```

### `fastclaw devices approve [requestId] [--latest]`

Approve a pending device pairing request. If `requestId` is omitted, FastClaw
automatically approves the most recent pending request.

```
fastclaw devices approve
fastclaw devices approve <requestId>
fastclaw devices approve --latest
```

### `fastclaw devices reject <requestId>`

Reject a pending device pairing request.

```
fastclaw devices reject <requestId>
```

### `fastclaw devices rotate --device <id> --role <role> [--scope <scope...>]`

Rotate a device token for a specific role (optionally updating scopes).

```
fastclaw devices rotate --device <deviceId> --role operator --scope operator.read --scope operator.write
```

### `fastclaw devices revoke --device <id> --role <role>`

Revoke a device token for a specific role.

```
fastclaw devices revoke --device <deviceId> --role node
```

## Common options

- `--url <url>`: Gateway WebSocket URL (defaults to `gateway.remote.url` when configured).
- `--token <token>`: Gateway token (if required).
- `--password <password>`: Gateway password (password auth).
- `--timeout <ms>`: RPC timeout.
- `--json`: JSON output (recommended for scripting).

Note: when you set `--url`, the CLI does not fall back to config or environment credentials.
Pass `--token` or `--password` explicitly. Missing explicit credentials is an error.

## Notes

- Token rotation returns a new token (sensitive). Treat it like a secret.
- These commands require `operator.pairing` (or `operator.admin`) scope.
- `devices clear` is intentionally gated by `--yes`.
- If pairing scope is unavailable on local loopback (and no explicit `--url` is passed), list/approve can use a local pairing fallback.
