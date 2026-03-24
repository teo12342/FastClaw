package ai.fastclaw.android.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class FastClawProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", FastClawCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", FastClawCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", FastClawCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", FastClawCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", FastClawCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", FastClawCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", FastClawCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", FastClawCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", FastClawCapability.Canvas.rawValue)
    assertEquals("camera", FastClawCapability.Camera.rawValue)
    assertEquals("screen", FastClawCapability.Screen.rawValue)
    assertEquals("voiceWake", FastClawCapability.VoiceWake.rawValue)
    assertEquals("location", FastClawCapability.Location.rawValue)
    assertEquals("sms", FastClawCapability.Sms.rawValue)
    assertEquals("device", FastClawCapability.Device.rawValue)
  }

  @Test
  fun cameraCommandsUseStableStrings() {
    assertEquals("camera.list", FastClawCameraCommand.List.rawValue)
    assertEquals("camera.snap", FastClawCameraCommand.Snap.rawValue)
    assertEquals("camera.clip", FastClawCameraCommand.Clip.rawValue)
  }

  @Test
  fun screenCommandsUseStableStrings() {
    assertEquals("screen.record", FastClawScreenCommand.Record.rawValue)
  }

  @Test
  fun notificationsCommandsUseStableStrings() {
    assertEquals("notifications.list", FastClawNotificationsCommand.List.rawValue)
    assertEquals("notifications.actions", FastClawNotificationsCommand.Actions.rawValue)
  }

  @Test
  fun deviceCommandsUseStableStrings() {
    assertEquals("device.status", FastClawDeviceCommand.Status.rawValue)
    assertEquals("device.info", FastClawDeviceCommand.Info.rawValue)
    assertEquals("device.permissions", FastClawDeviceCommand.Permissions.rawValue)
    assertEquals("device.health", FastClawDeviceCommand.Health.rawValue)
  }
}
