import Foundation

public enum FastClawCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum FastClawCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum FastClawCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum FastClawCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct FastClawCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: FastClawCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: FastClawCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: FastClawCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: FastClawCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct FastClawCameraClipParams: Codable, Sendable, Equatable {
    public var facing: FastClawCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: FastClawCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: FastClawCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: FastClawCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
