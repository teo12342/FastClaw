export const FASTCLAW_CLI_ENV_VAR = "FASTCLAW_CLI";
export const FASTCLAW_CLI_ENV_VALUE = "1";

export function markFastClawExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [FASTCLAW_CLI_ENV_VAR]: FASTCLAW_CLI_ENV_VALUE,
  };
}

export function ensureFastClawExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[FASTCLAW_CLI_ENV_VAR] = FASTCLAW_CLI_ENV_VALUE;
  return env;
}
