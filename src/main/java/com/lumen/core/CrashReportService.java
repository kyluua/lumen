package com.lumen.core;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class CrashReportService {
    private static final DateTimeFormatter STAMP = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");
    private final AppPaths paths;

    public CrashReportService(AppPaths paths) {
        this.paths = paths;
    }

    public Path writeValidationReport(LaunchPlan plan) throws IOException {
        paths.ensure();
        Path report = paths.reportsDir().resolve("launch-validation-" + LocalDateTime.now().format(STAMP) + ".txt");
        StringBuilder text = new StringBuilder();
        text.append("Lumen launch validation report\n");
        text.append("Profile: ").append(plan.profile().name()).append('\n');
        text.append("Version: ").append(plan.version().id()).append('\n');
        text.append("Loader: ").append(plan.profile().loader().displayName()).append('\n');
        text.append("Java: ").append(plan.javaRuntime() == null ? "missing" : plan.javaRuntime().javaExecutable()).append("\n\n");
        text.append("Issues:\n");
        if (plan.issues().isEmpty()) {
            text.append(" - none\n");
        } else {
            for (ValidationIssue issue : plan.issues()) {
                text.append(" - ").append(issue.severity()).append(' ').append(issue.code()).append(": ").append(issue.message()).append('\n');
                text.append("   Action: ").append(issue.action()).append('\n');
            }
        }
        text.append("\nCommand preview:\n").append(String.join(" ", plan.command())).append('\n');
        Files.writeString(report, text.toString());
        return report;
    }
}