import type { FastClawPluginApi } from "fastclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "fastclaw/plugin-sdk";
import { createSynologyChatPlugin } from "./src/channel.js";
import { setSynologyRuntime } from "./src/runtime.js";

const plugin = {
  id: "synology-chat",
  name: "Synology Chat",
  description: "Native Synology Chat channel plugin for FastClaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: FastClawPluginApi) {
    setSynologyRuntime(api.runtime);
    api.registerChannel({ plugin: createSynologyChatPlugin() });
  },
};

export default plugin;
