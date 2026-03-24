import type { FastClawConfig } from "../../../config/config.js";
import type { WizardPrompter } from "../../../wizard/prompts.js";
import { promptChannelAccessConfig, type ChannelAccessPolicy } from "./channel-access.js";

export async function configureChannelAccessWithAllowlist<TResolved>(params: {
  cfg: FastClawConfig;
  prompter: WizardPrompter;
  label: string;
  currentPolicy: ChannelAccessPolicy;
  currentEntries: string[];
  placeholder: string;
  updatePrompt: boolean;
  setPolicy: (cfg: FastClawConfig, policy: ChannelAccessPolicy) => FastClawConfig;
  resolveAllowlist: (params: { cfg: FastClawConfig; entries: string[] }) => Promise<TResolved>;
  applyAllowlist: (params: { cfg: FastClawConfig; resolved: TResolved }) => FastClawConfig;
}): Promise<FastClawConfig> {
  let next = params.cfg;
  const accessConfig = await promptChannelAccessConfig({
    prompter: params.prompter,
    label: params.label,
    currentPolicy: params.currentPolicy,
    currentEntries: params.currentEntries,
    placeholder: params.placeholder,
    updatePrompt: params.updatePrompt,
  });
  if (!accessConfig) {
    return next;
  }
  if (accessConfig.policy !== "allowlist") {
    return params.setPolicy(next, accessConfig.policy);
  }
  const resolved = await params.resolveAllowlist({
    cfg: next,
    entries: accessConfig.entries,
  });
  next = params.setPolicy(next, "allowlist");
  return params.applyAllowlist({
    cfg: next,
    resolved,
  });
}
