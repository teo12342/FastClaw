import { listSkillCommandsForAgents as listSkillCommandsForAgentsImpl } from "fastclaw/plugin-sdk/command-auth";

type ListSkillCommandsForAgents =
  typeof import("fastclaw/plugin-sdk/command-auth").listSkillCommandsForAgents;

export function listSkillCommandsForAgents(
  ...args: Parameters<ListSkillCommandsForAgents>
): ReturnType<ListSkillCommandsForAgents> {
  return listSkillCommandsForAgentsImpl(...args);
}
