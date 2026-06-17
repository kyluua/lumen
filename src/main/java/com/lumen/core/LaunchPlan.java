package com.lumen.core;

import java.util.List;

public record LaunchPlan(
        LauncherProfile profile,
        VersionDescriptor version,
        JavaRuntimeInfo javaRuntime,
        List<ArtifactPlan> artifacts,
        List<String> command,
        List<ValidationIssue> issues,
        List<LaunchStage> stages) {

    public boolean hasBlockingIssues() {
        return issues.stream().anyMatch(issue -> issue.severity() == Severity.ERROR);
    }
}
