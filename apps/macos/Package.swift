// swift-tools-version: 6.2
// Package manifest for the FastClaw macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "FastClaw",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "FastClawIPC", targets: ["FastClawIPC"]),
        .library(name: "FastClawDiscovery", targets: ["FastClawDiscovery"]),
        .executable(name: "FastClaw", targets: ["FastClaw"]),
        .executable(name: "fastclaw-mac", targets: ["FastClawMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/FastClawKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "FastClawIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "FastClawDiscovery",
            dependencies: [
                .product(name: "FastClawKit", package: "FastClawKit"),
            ],
            path: "Sources/FastClawDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "FastClaw",
            dependencies: [
                "FastClawIPC",
                "FastClawDiscovery",
                .product(name: "FastClawKit", package: "FastClawKit"),
                .product(name: "FastClawChatUI", package: "FastClawKit"),
                .product(name: "FastClawProtocol", package: "FastClawKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/FastClaw.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "FastClawMacCLI",
            dependencies: [
                "FastClawDiscovery",
                .product(name: "FastClawKit", package: "FastClawKit"),
                .product(name: "FastClawProtocol", package: "FastClawKit"),
            ],
            path: "Sources/FastClawMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "FastClawIPCTests",
            dependencies: [
                "FastClawIPC",
                "FastClaw",
                "FastClawDiscovery",
                .product(name: "FastClawProtocol", package: "FastClawKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
