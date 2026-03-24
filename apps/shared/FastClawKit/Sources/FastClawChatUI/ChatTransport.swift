import Foundation

public enum FastClawChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(FastClawChatEventPayload)
    case agent(FastClawAgentEventPayload)
    case seqGap
}

public protocol FastClawChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> FastClawChatHistoryPayload
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [FastClawChatAttachmentPayload]) async throws -> FastClawChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> FastClawChatSessionsListResponse

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<FastClawChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
}

extension FastClawChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "FastClawChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> FastClawChatSessionsListResponse {
        throw NSError(
            domain: "FastClawChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }
}
