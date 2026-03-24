import Foundation

// Stable identifier used for both the macOS LaunchAgent label and Nix-managed defaults suite.
// nix-fastclaw writes app defaults into this suite to survive app bundle identifier churn.
let launchdLabel = "ai.fastclaw.mac"
let gatewayLaunchdLabel = "ai.fastclaw.gateway"
let onboardingVersionKey = "fastclaw.onboardingVersion"
let onboardingSeenKey = "fastclaw.onboardingSeen"
let currentOnboardingVersion = 7
let pauseDefaultsKey = "fastclaw.pauseEnabled"
let iconAnimationsEnabledKey = "fastclaw.iconAnimationsEnabled"
let swabbleEnabledKey = "fastclaw.swabbleEnabled"
let swabbleTriggersKey = "fastclaw.swabbleTriggers"
let voiceWakeTriggerChimeKey = "fastclaw.voiceWakeTriggerChime"
let voiceWakeSendChimeKey = "fastclaw.voiceWakeSendChime"
let showDockIconKey = "fastclaw.showDockIcon"
let defaultVoiceWakeTriggers = ["fastclaw"]
let voiceWakeMaxWords = 32
let voiceWakeMaxWordLength = 64
let voiceWakeMicKey = "fastclaw.voiceWakeMicID"
let voiceWakeMicNameKey = "fastclaw.voiceWakeMicName"
let voiceWakeLocaleKey = "fastclaw.voiceWakeLocaleID"
let voiceWakeAdditionalLocalesKey = "fastclaw.voiceWakeAdditionalLocaleIDs"
let voicePushToTalkEnabledKey = "fastclaw.voicePushToTalkEnabled"
let talkEnabledKey = "fastclaw.talkEnabled"
let iconOverrideKey = "fastclaw.iconOverride"
let connectionModeKey = "fastclaw.connectionMode"
let remoteTargetKey = "fastclaw.remoteTarget"
let remoteIdentityKey = "fastclaw.remoteIdentity"
let remoteProjectRootKey = "fastclaw.remoteProjectRoot"
let remoteCliPathKey = "fastclaw.remoteCliPath"
let canvasEnabledKey = "fastclaw.canvasEnabled"
let cameraEnabledKey = "fastclaw.cameraEnabled"
let systemRunPolicyKey = "fastclaw.systemRunPolicy"
let systemRunAllowlistKey = "fastclaw.systemRunAllowlist"
let systemRunEnabledKey = "fastclaw.systemRunEnabled"
let locationModeKey = "fastclaw.locationMode"
let locationPreciseKey = "fastclaw.locationPreciseEnabled"
let peekabooBridgeEnabledKey = "fastclaw.peekabooBridgeEnabled"
let deepLinkKeyKey = "fastclaw.deepLinkKey"
let modelCatalogPathKey = "fastclaw.modelCatalogPath"
let modelCatalogReloadKey = "fastclaw.modelCatalogReload"
let cliInstallPromptedVersionKey = "fastclaw.cliInstallPromptedVersion"
let heartbeatsEnabledKey = "fastclaw.heartbeatsEnabled"
let debugPaneEnabledKey = "fastclaw.debugPaneEnabled"
let debugFileLogEnabledKey = "fastclaw.debug.fileLogEnabled"
let appLogLevelKey = "fastclaw.debug.appLogLevel"
let voiceWakeSupported: Bool = ProcessInfo.processInfo.operatingSystemVersion.majorVersion >= 26
