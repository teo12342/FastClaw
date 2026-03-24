import { getRuntimeConfigSnapshot, type FastClawConfig } from "../../config/config.js";

export function resolveSkillRuntimeConfig(config?: FastClawConfig): FastClawConfig | undefined {
  return getRuntimeConfigSnapshot() ?? config;
}
