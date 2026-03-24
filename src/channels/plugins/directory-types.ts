import type { FastClawConfig } from "../../config/types.js";

export type DirectoryConfigParams = {
  cfg: FastClawConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
};
