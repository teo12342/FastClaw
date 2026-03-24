import type {
  AnyAgentTool,
  FastClawPluginApi,
  FastClawPluginToolFactory,
} from "../../src/plugins/types.js";
import { createLobsterTool } from "./src/lobster-tool.js";

export default function register(api: FastClawPluginApi) {
  api.registerTool(
    ((ctx) => {
      if (ctx.sandboxed) {
        return null;
      }
      return createLobsterTool(api) as AnyAgentTool;
    }) as FastClawPluginToolFactory,
    { optional: true },
  );
}
