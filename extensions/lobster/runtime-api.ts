export { definePluginEntry } from "fastclaw/plugin-sdk/core";
export type {
  AnyAgentTool,
  FastClawPluginApi,
  FastClawPluginToolContext,
  FastClawPluginToolFactory,
} from "fastclaw/plugin-sdk/core";
export {
  applyWindowsSpawnProgramPolicy,
  materializeWindowsSpawnProgram,
  resolveWindowsSpawnProgramCandidate,
} from "fastclaw/plugin-sdk/windows-spawn";
