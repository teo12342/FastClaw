import CoreLocation
import Foundation
import FastClawKit
import UIKit

typealias FastClawCameraSnapResult = (format: String, base64: String, width: Int, height: Int)
typealias FastClawCameraClipResult = (format: String, base64: String, durationMs: Int, hasAudio: Bool)

protocol CameraServicing: Sendable {
    func listDevices() async -> [CameraController.CameraDeviceInfo]
    func snap(params: FastClawCameraSnapParams) async throws -> FastClawCameraSnapResult
    func clip(params: FastClawCameraClipParams) async throws -> FastClawCameraClipResult
}

protocol ScreenRecordingServicing: Sendable {
    func record(
        screenIndex: Int?,
        durationMs: Int?,
        fps: Double?,
        includeAudio: Bool?,
        outPath: String?) async throws -> String
}

@MainActor
protocol LocationServicing: Sendable {
    func authorizationStatus() -> CLAuthorizationStatus
    func accuracyAuthorization() -> CLAccuracyAuthorization
    func ensureAuthorization(mode: FastClawLocationMode) async -> CLAuthorizationStatus
    func currentLocation(
        params: FastClawLocationGetParams,
        desiredAccuracy: FastClawLocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    func startLocationUpdates(
        desiredAccuracy: FastClawLocationAccuracy,
        significantChangesOnly: Bool) -> AsyncStream<CLLocation>
    func stopLocationUpdates()
    func startMonitoringSignificantLocationChanges(onUpdate: @escaping @Sendable (CLLocation) -> Void)
    func stopMonitoringSignificantLocationChanges()
}

protocol DeviceStatusServicing: Sendable {
    func status() async throws -> FastClawDeviceStatusPayload
    func info() -> FastClawDeviceInfoPayload
}

protocol PhotosServicing: Sendable {
    func latest(params: FastClawPhotosLatestParams) async throws -> FastClawPhotosLatestPayload
}

protocol ContactsServicing: Sendable {
    func search(params: FastClawContactsSearchParams) async throws -> FastClawContactsSearchPayload
    func add(params: FastClawContactsAddParams) async throws -> FastClawContactsAddPayload
}

protocol CalendarServicing: Sendable {
    func events(params: FastClawCalendarEventsParams) async throws -> FastClawCalendarEventsPayload
    func add(params: FastClawCalendarAddParams) async throws -> FastClawCalendarAddPayload
}

protocol RemindersServicing: Sendable {
    func list(params: FastClawRemindersListParams) async throws -> FastClawRemindersListPayload
    func add(params: FastClawRemindersAddParams) async throws -> FastClawRemindersAddPayload
}

protocol MotionServicing: Sendable {
    func activities(params: FastClawMotionActivityParams) async throws -> FastClawMotionActivityPayload
    func pedometer(params: FastClawPedometerParams) async throws -> FastClawPedometerPayload
}

struct WatchMessagingStatus: Sendable, Equatable {
    var supported: Bool
    var paired: Bool
    var appInstalled: Bool
    var reachable: Bool
    var activationState: String
}

struct WatchQuickReplyEvent: Sendable, Equatable {
    var replyId: String
    var promptId: String
    var actionId: String
    var actionLabel: String?
    var sessionKey: String?
    var note: String?
    var sentAtMs: Int?
    var transport: String
}

struct WatchNotificationSendResult: Sendable, Equatable {
    var deliveredImmediately: Bool
    var queuedForDelivery: Bool
    var transport: String
}

protocol WatchMessagingServicing: AnyObject, Sendable {
    func status() async -> WatchMessagingStatus
    func setReplyHandler(_ handler: (@Sendable (WatchQuickReplyEvent) -> Void)?)
    func sendNotification(
        id: String,
        params: FastClawWatchNotifyParams) async throws -> WatchNotificationSendResult
}

extension CameraController: CameraServicing {}
extension ScreenRecordService: ScreenRecordingServicing {}
extension LocationService: LocationServicing {}
