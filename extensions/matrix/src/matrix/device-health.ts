export type MatrixManagedDeviceInfo = {
  deviceId: string;
  displayName: string | null;
  current: boolean;
};

export type MatrixDeviceHealthSummary = {
  currentDeviceId: string | null;
  staleFastClawDevices: MatrixManagedDeviceInfo[];
  currentFastClawDevices: MatrixManagedDeviceInfo[];
};

const FASTCLAW_DEVICE_NAME_PREFIX = "FastClaw ";

export function isFastClawManagedMatrixDevice(displayName: string | null | undefined): boolean {
  return displayName?.startsWith(FASTCLAW_DEVICE_NAME_PREFIX) === true;
}

export function summarizeMatrixDeviceHealth(
  devices: MatrixManagedDeviceInfo[],
): MatrixDeviceHealthSummary {
  const currentDeviceId = devices.find((device) => device.current)?.deviceId ?? null;
  const openClawDevices = devices.filter((device) =>
    isFastClawManagedMatrixDevice(device.displayName),
  );
  return {
    currentDeviceId,
    staleFastClawDevices: openClawDevices.filter((device) => !device.current),
    currentFastClawDevices: openClawDevices.filter((device) => device.current),
  };
}
