package ai.fastclaw.app.protocol

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
    assertEquals("voiceWake", FastClawCapability.VoiceWake.rawValue)
    assertEquals("location", FastClawCapability.Location.rawValue)
    assertEquals("sms", FastClawCapability.Sms.rawValue)
    assertEquals("device", FastClawCapability.Device.rawValue)
    assertEquals("notifications", FastClawCapability.Notifications.rawValue)
    assertEquals("system", FastClawCapability.System.rawValue)
    assertEquals("photos", FastClawCapability.Photos.rawValue)
    assertEquals("contacts", FastClawCapability.Contacts.rawValue)
    assertEquals("calendar", FastClawCapability.Calendar.rawValue)
    assertEquals("motion", FastClawCapability.Motion.rawValue)
    assertEquals("callLog", FastClawCapability.CallLog.rawValue)
  }

  @Test
  fun cameraCommandsUseStableStrings() {
    assertEquals("camera.list", FastClawCameraCommand.List.rawValue)
    assertEquals("camera.snap", FastClawCameraCommand.Snap.rawValue)
    assertEquals("camera.clip", FastClawCameraCommand.Clip.rawValue)
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

  @Test
  fun systemCommandsUseStableStrings() {
    assertEquals("system.notify", FastClawSystemCommand.Notify.rawValue)
  }

  @Test
  fun photosCommandsUseStableStrings() {
    assertEquals("photos.latest", FastClawPhotosCommand.Latest.rawValue)
  }

  @Test
  fun contactsCommandsUseStableStrings() {
    assertEquals("contacts.search", FastClawContactsCommand.Search.rawValue)
    assertEquals("contacts.add", FastClawContactsCommand.Add.rawValue)
  }

  @Test
  fun calendarCommandsUseStableStrings() {
    assertEquals("calendar.events", FastClawCalendarCommand.Events.rawValue)
    assertEquals("calendar.add", FastClawCalendarCommand.Add.rawValue)
  }

  @Test
  fun motionCommandsUseStableStrings() {
    assertEquals("motion.activity", FastClawMotionCommand.Activity.rawValue)
    assertEquals("motion.pedometer", FastClawMotionCommand.Pedometer.rawValue)
  }

  @Test
  fun callLogCommandsUseStableStrings() {
    assertEquals("callLog.search", FastClawCallLogCommand.Search.rawValue)
  }

  @Test
  fun smsCommandsUseStableStrings() {
    assertEquals("sms.search", FastClawSmsCommand.Search.rawValue)
  }
}
