import Foundation
import Testing
@testable import FastClaw

@Suite(.serialized) struct NodeServiceManagerTests {
    @Test func `builds node service commands with current CLI shape`() throws {
        let tmp = try makeTempDirForTests()
        CommandResolver.setProjectRoot(tmp.path)

        let fastclawPath = tmp.appendingPathComponent("node_modules/.bin/fastclaw")
        try makeExecutableForTests(at: fastclawPath)

        let start = NodeServiceManager._testServiceCommand(["start"])
        #expect(start == [fastclawPath.path, "node", "start", "--json"])

        let stop = NodeServiceManager._testServiceCommand(["stop"])
        #expect(stop == [fastclawPath.path, "node", "stop", "--json"])
    }
}
