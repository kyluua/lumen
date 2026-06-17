package com.lumen.core;

public enum LaunchStage {
    IDLE,
    RESOLVING_VERSION,
    VERIFYING_LOADER,
    VALIDATING_JAVA,
    PLANNING_ARTIFACTS,
    CHECKING_ASSETS,
    BUILDING_COMMAND,
    READY,
    FAILED
}
