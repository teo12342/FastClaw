package ai.fastclaw.app.node

import ai.fastclaw.app.protocol.FastClawCalendarCommand
import ai.fastclaw.app.protocol.FastClawCameraCommand
import ai.fastclaw.app.protocol.FastClawCallLogCommand
import ai.fastclaw.app.protocol.FastClawCapability
import ai.fastclaw.app.protocol.FastClawContactsCommand
import ai.fastclaw.app.protocol.FastClawDeviceCommand
import ai.fastclaw.app.protocol.FastClawLocationCommand
import ai.fastclaw.app.protocol.FastClawMotionCommand
import ai.fastclaw.app.protocol.FastClawNotificationsCommand
import ai.fastclaw.app.protocol.FastClawPhotosCommand
import ai.fastclaw.app.protocol.FastClawSmsCommand
import ai.fastclaw.app.protocol.FastClawSystemCommand
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class InvokeCommandRegistryTest {
  private val coreCapabilities =
    setOf(
      FastClawCapability.Canvas.rawValue,
      FastClawCapability.Device.rawValue,
      FastClawCapability.Notifications.rawValue,
      FastClawCapability.System.rawValue,
      FastClawCapability.Photos.rawValue,
      FastClawCapability.Contacts.rawValue,
      FastClawCapability.Calendar.rawValue,
    )

  private val optionalCapabilities =
    setOf(
      FastClawCapability.Camera.rawValue,
      FastClawCapability.Location.rawValue,
      FastClawCapability.Sms.rawValue,
      FastClawCapability.CallLog.rawValue,
      FastClawCapability.VoiceWake.rawValue,
      FastClawCapability.Motion.rawValue,
    )

  private val coreCommands =
    setOf(
      FastClawDeviceCommand.Status.rawValue,
      FastClawDeviceCommand.Info.rawValue,
      FastClawDeviceCommand.Permissions.rawValue,
      FastClawDeviceCommand.Health.rawValue,
      FastClawNotificationsCommand.List.rawValue,
      FastClawNotificationsCommand.Actions.rawValue,
      FastClawSystemCommand.Notify.rawValue,
      FastClawPhotosCommand.Latest.rawValue,
      FastClawContactsCommand.Search.rawValue,
      FastClawContactsCommand.Add.rawValue,
      FastClawCalendarCommand.Events.rawValue,
      FastClawCalendarCommand.Add.rawValue,
    )

  private val optionalCommands =
    setOf(
      FastClawCameraCommand.Snap.rawValue,
      FastClawCameraCommand.Clip.rawValue,
      FastClawCameraCommand.List.rawValue,
      FastClawLocationCommand.Get.rawValue,
      FastClawMotionCommand.Activity.rawValue,
      FastClawMotionCommand.Pedometer.rawValue,
      FastClawSmsCommand.Send.rawValue,
      FastClawSmsCommand.Search.rawValue,
      FastClawCallLogCommand.Search.rawValue,
    )

  private val debugCommands = setOf("debug.logs", "debug.ed25519")

  @Test
  fun advertisedCapabilities_respectsFeatureAvailability() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags())

    assertContainsAll(capabilities, coreCapabilities)
    assertMissingAll(capabilities, optionalCapabilities)
  }

  @Test
  fun advertisedCapabilities_includesFeatureCapabilitiesWhenEnabled() {
    val capabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          sendSmsAvailable = true,
          readSmsAvailable = true,
          callLogAvailable = true,
          voiceWakeEnabled = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
        ),
      )

    assertContainsAll(capabilities, coreCapabilities + optionalCapabilities)
  }

  @Test
  fun advertisedCommands_respectsFeatureAvailability() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags())

    assertContainsAll(commands, coreCommands)
    assertMissingAll(commands, optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_includesFeatureCommandsWhenEnabled() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          sendSmsAvailable = true,
          readSmsAvailable = true,
          callLogAvailable = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
          debugBuild = true,
        ),
      )

    assertContainsAll(commands, coreCommands + optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_onlyIncludesSupportedMotionCommands() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        NodeRuntimeFlags(
          cameraEnabled = false,
          locationEnabled = false,
          sendSmsAvailable = false,
          readSmsAvailable = false,
          callLogAvailable = false,
          voiceWakeEnabled = false,
          motionActivityAvailable = true,
          motionPedometerAvailable = false,
          debugBuild = false,
        ),
      )

    assertTrue(commands.contains(FastClawMotionCommand.Activity.rawValue))
    assertFalse(commands.contains(FastClawMotionCommand.Pedometer.rawValue))
  }

  @Test
  fun advertisedCommands_splitsSmsSendAndSearchAvailability() {
    val readOnlyCommands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(readSmsAvailable = true),
      )
    val sendOnlyCommands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(sendSmsAvailable = true),
      )

    assertTrue(readOnlyCommands.contains(FastClawSmsCommand.Search.rawValue))
    assertFalse(readOnlyCommands.contains(FastClawSmsCommand.Send.rawValue))
    assertTrue(sendOnlyCommands.contains(FastClawSmsCommand.Send.rawValue))
    assertFalse(sendOnlyCommands.contains(FastClawSmsCommand.Search.rawValue))
  }

  @Test
  fun advertisedCapabilities_includeSmsWhenEitherSmsPathIsAvailable() {
    val readOnlyCapabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(readSmsAvailable = true),
      )
    val sendOnlyCapabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(sendSmsAvailable = true),
      )

    assertTrue(readOnlyCapabilities.contains(FastClawCapability.Sms.rawValue))
    assertTrue(sendOnlyCapabilities.contains(FastClawCapability.Sms.rawValue))
  }

  @Test
  fun advertisedCommands_excludesCallLogWhenUnavailable() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags(callLogAvailable = false))

    assertFalse(commands.contains(FastClawCallLogCommand.Search.rawValue))
  }

  @Test
  fun advertisedCapabilities_excludesCallLogWhenUnavailable() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags(callLogAvailable = false))

    assertFalse(capabilities.contains(FastClawCapability.CallLog.rawValue))
  }

  private fun defaultFlags(
    cameraEnabled: Boolean = false,
    locationEnabled: Boolean = false,
    sendSmsAvailable: Boolean = false,
    readSmsAvailable: Boolean = false,
    callLogAvailable: Boolean = false,
    voiceWakeEnabled: Boolean = false,
    motionActivityAvailable: Boolean = false,
    motionPedometerAvailable: Boolean = false,
    debugBuild: Boolean = false,
  ): NodeRuntimeFlags =
    NodeRuntimeFlags(
      cameraEnabled = cameraEnabled,
      locationEnabled = locationEnabled,
      sendSmsAvailable = sendSmsAvailable,
      readSmsAvailable = readSmsAvailable,
      callLogAvailable = callLogAvailable,
      voiceWakeEnabled = voiceWakeEnabled,
      motionActivityAvailable = motionActivityAvailable,
      motionPedometerAvailable = motionPedometerAvailable,
      debugBuild = debugBuild,
    )

  private fun assertContainsAll(actual: List<String>, expected: Set<String>) {
    expected.forEach { value -> assertTrue(actual.contains(value)) }
  }

  private fun assertMissingAll(actual: List<String>, forbidden: Set<String>) {
    forbidden.forEach { value -> assertFalse(actual.contains(value)) }
  }
}
