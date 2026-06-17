package com.lumen.core;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public final class LaunchService {
    private final VersionRepository versions = new VersionRepository();
    private final JavaRuntimeService javaRuntimeService = new JavaRuntimeService();
    private final ArtifactPlanner artifacts = new ArtifactPlanner();
    private final LaunchCommandBuilder commandBuilder = new LaunchCommandBuilder();

    public LaunchPlan buildPlan(LauncherProfile profile, List<JavaRuntimeInfo> runtimes) {
        VersionDescriptor version = versions.resolve(profile.minecraftVersion());
        JavaRuntimeInfo runtime = runtimes.stream()
                .filter(java -> java.id().equals(profile.javaRuntimeId()))
                .findFirst()
                .orElseGet(() -> runtimes.isEmpty() ? null : runtimes.get(0));
        List<ValidationIssue> issues = new ArrayList<>();
        if (!version.supportedLoaders().contains(profile.loader())) {
            issues.add(ValidationIssue.error("loader.unsupported", profile.loader().displayName() + " is not supported for " + version.id(), "Choose a supported loader."));
        }
        issues.addAll(javaRuntimeService.validate(runtime, version));
        if (version.experimental()) {
            issues.add(ValidationIssue.warning("version.experimental", version.id() + " is a forward-compatible Lumen line.", "Review loader and Java compatibility."));
        }
        List<String> command = runtime == null ? List.of() : commandBuilder.build(profile, version, runtime);
        return new LaunchPlan(profile, version, runtime, artifacts.plan(profile, version), command, issues,
                List.of(LaunchStage.RESOLVING_VERSION, LaunchStage.VERIFYING_LOADER,
                        LaunchStage.VALIDATING_JAVA, LaunchStage.PLANNING_ARTIFACTS,
                        LaunchStage.CHECKING_ASSETS, LaunchStage.BUILDING_COMMAND, LaunchStage.READY));
    }

    public List<LaunchLogEntry> simulate(LaunchPlan plan) {
        List<LaunchLogEntry> logs = new ArrayList<>();
        for (LaunchStage stage : plan.stages()) {
            logs.add(new LaunchLogEntry(Instant.now(), stage, Severity.INFO, message(stage, plan)));
        }
        for (ValidationIssue issue : plan.issues()) {
            logs.add(new LaunchLogEntry(Instant.now(), issue.severity() == Severity.ERROR ? LaunchStage.FAILED : LaunchStage.READY,
                    issue.severity(), issue.code() + ": " + issue.message()));
        }
        if (!plan.hasBlockingIssues()) {
            logs.add(new LaunchLogEntry(Instant.now(), LaunchStage.READY, Severity.INFO,
                    "Launch command is ready. Actual process start is gated behind artifact installation and account auth."));
        }
        return logs;
    }

    private String message(LaunchStage stage, LaunchPlan plan) {
        return switch (stage) {
            case RESOLVING_VERSION -> "Resolved " + plan.version().id();
            case VERIFYING_LOADER -> "Verified " + plan.profile().loader().displayName();
            case VALIDATING_JAVA -> "Validated Java runtime " + (plan.javaRuntime() == null ? "missing" : plan.javaRuntime().name());
            case PLANNING_ARTIFACTS -> "Planned " + plan.artifacts().size() + " artifact group(s)";
            case CHECKING_ASSETS -> "Prepared asset/library validation with checksum hooks";
            case BUILDING_COMMAND -> "Built launch command with " + plan.command().size() + " argument(s)";
            case READY -> "Ready after validation";
            default -> stage.name();
        };
    }
}
