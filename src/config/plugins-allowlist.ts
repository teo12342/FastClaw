import type { FastClawConfig } from "./config.js";

export function ensurePluginAllowlisted(cfg: FastClawConfig, pluginId: string): FastClawConfig {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}
