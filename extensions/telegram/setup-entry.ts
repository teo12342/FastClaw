import { defineSetupPluginEntry } from "fastclaw/plugin-sdk/core";
import { telegramSetupPlugin } from "./src/channel.setup.js";

export { telegramSetupPlugin } from "./src/channel.setup.js";

export default defineSetupPluginEntry(telegramSetupPlugin);
