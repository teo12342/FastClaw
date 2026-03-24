// Narrow plugin-sdk surface for the bundled diffs plugin.
// Keep this list additive and scoped to symbols used under extensions/diffs.

export { definePluginEntry } from "./plugin-entry.js";
export type { FastClawConfig } from "../config/config.js";
export { resolvePreferredFastClawTmpDir } from "../infra/tmp-fastclaw-dir.js";
export type {
  AnyAgentTool,
  FastClawPluginApi,
  FastClawPluginConfigSchema,
  FastClawPluginToolContext,
  PluginLogger,
} from "../plugins/types.js";
