import { resolveChannelGroupRequireMention } from "fastclaw/plugin-sdk/channel-policy";
import type { FastClawConfig } from "fastclaw/plugin-sdk/core";

type GoogleChatGroupContext = {
  cfg: FastClawConfig;
  accountId?: string | null;
  groupId?: string | null;
};

export function resolveGoogleChatGroupRequireMention(params: GoogleChatGroupContext): boolean {
  return resolveChannelGroupRequireMention({
    cfg: params.cfg,
    channel: "googlechat",
    groupId: params.groupId,
    accountId: params.accountId,
  });
}
