import { OPENCODE_GO_DEFAULT_MODEL_REF } from "fastclaw/plugin-sdk/provider-models";
import {
  applyAgentDefaultModelPrimary,
  withAgentModelAliases,
  type FastClawConfig,
} from "fastclaw/plugin-sdk/provider-onboard";

export { OPENCODE_GO_DEFAULT_MODEL_REF };

const OPENCODE_GO_ALIAS_DEFAULTS: Record<string, string> = {
  "opencode-go/kimi-k2.5": "Kimi",
  "opencode-go/glm-5": "GLM",
  "opencode-go/minimax-m2.5": "MiniMax",
};

export function applyOpencodeGoProviderConfig(cfg: FastClawConfig): FastClawConfig {
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...cfg.agents?.defaults,
        models: withAgentModelAliases(
          cfg.agents?.defaults?.models,
          Object.entries(OPENCODE_GO_ALIAS_DEFAULTS).map(([modelRef, alias]) => ({
            modelRef,
            alias,
          })),
        ),
      },
    },
  };
}

export function applyOpencodeGoConfig(cfg: FastClawConfig): FastClawConfig {
  return applyAgentDefaultModelPrimary(
    applyOpencodeGoProviderConfig(cfg),
    OPENCODE_GO_DEFAULT_MODEL_REF,
  );
}
