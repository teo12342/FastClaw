package ai.fastclaw.android.node

import ai.fastclaw.android.protocol.FastClawCameraCommand
import ai.fastclaw.android.protocol.FastClawDeviceCommand
import ai.fastclaw.android.protocol.FastClawLocationCommand
import ai.fastclaw.android.protocol.FastClawNotificationsCommand
import ai.fastclaw.android.protocol.FastClawSmsCommand
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class InvokeCommandRegistryTest {
  @Test
  fun advertisedCommands_respectsFeatureAvailability() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        cameraEnabled = false,
        locationEnabled = false,
        smsAvailable = false,
        debugBuild = false,
      )

    assertFalse(commands.contains(FastClawCameraCommand.Snap.rawValue))
    assertFalse(commands.contains(FastClawCameraCommand.Clip.rawValue))
    assertFalse(commands.contains(FastClawCameraCommand.List.rawValue))
    assertFalse(commands.contains(FastClawLocationCommand.Get.rawValue))
    assertTrue(commands.contains(FastClawDeviceCommand.Status.rawValue))
    assertTrue(commands.contains(FastClawDeviceCommand.Info.rawValue))
    assertTrue(commands.contains(FastClawDeviceCommand.Permissions.rawValue))
    assertTrue(commands.contains(FastClawDeviceCommand.Health.rawValue))
    assertTrue(commands.contains(FastClawNotificationsCommand.List.rawValue))
    assertTrue(commands.contains(FastClawNotificationsCommand.Actions.rawValue))
    assertFalse(commands.contains(FastClawSmsCommand.Send.rawValue))
    assertFalse(commands.contains("debug.logs"))
    assertFalse(commands.contains("debug.ed25519"))
    assertTrue(commands.contains("app.update"))
  }

  @Test
  fun advertisedCommands_includesFeatureCommandsWhenEnabled() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        cameraEnabled = true,
        locationEnabled = true,
        smsAvailable = true,
        debugBuild = true,
      )

    assertTrue(commands.contains(FastClawCameraCommand.Snap.rawValue))
    assertTrue(commands.contains(FastClawCameraCommand.Clip.rawValue))
    assertTrue(commands.contains(FastClawCameraCommand.List.rawValue))
    assertTrue(commands.contains(FastClawLocationCommand.Get.rawValue))
    assertTrue(commands.contains(FastClawDeviceCommand.Status.rawValue))
    assertTrue(commands.contains(FastClawDeviceCommand.Info.rawValue))
    assertTrue(commands.contains(FastClawDeviceCommand.Permissions.rawValue))
    assertTrue(commands.contains(FastClawDeviceCommand.Health.rawValue))
    assertTrue(commands.contains(FastClawNotificationsCommand.List.rawValue))
    assertTrue(commands.contains(FastClawNotificationsCommand.Actions.rawValue))
    assertTrue(commands.contains(FastClawSmsCommand.Send.rawValue))
    assertTrue(commands.contains("debug.logs"))
    assertTrue(commands.contains("debug.ed25519"))
    assertTrue(commands.contains("app.update"))
  }
}
