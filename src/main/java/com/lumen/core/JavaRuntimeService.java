package com.lumen.core;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class JavaRuntimeService {
    public List<JavaRuntimeInfo> detect() {
        Map<String, JavaRuntimeInfo> runtimes = new LinkedHashMap<>();
        addCurrentRuntime(runtimes);
        addCandidate(runtimes, "jdk-21-common", Path.of("C:/Program Files/Java/jdk-21/bin/java.exe"), 21, "JDK 21");
        addCandidate(runtimes, "jdk-25-common", Path.of("C:/Program Files/Java/jdk-25/bin/java.exe"), 25, "JDK 25");
        addCandidate(runtimes, "temurin-21", Path.of("C:/Users/kylev/AppData/Local/Programs/Eclipse Adoptium/jdk-21.0.11.10-hotspot/bin/java.exe"), 21, "Temurin JDK 21");
        return new ArrayList<>(runtimes.values());
    }

    public List<ValidationIssue> validate(JavaRuntimeInfo runtime, VersionDescriptor version) {
        List<ValidationIssue> issues = new ArrayList<>();
        if (runtime == null) {
            issues.add(ValidationIssue.error("java.missing", "No Java runtime selected.", "Select JDK 21 or JDK 25."));
            return issues;
        }
        if (!Files.exists(runtime.javaExecutable())) {
            issues.add(ValidationIssue.error("java.path-missing", runtime.javaExecutable() + " does not exist.", "Install or select a valid JDK."));
        }
        if (runtime.major() < version.minimumJavaMajor()) {
            issues.add(ValidationIssue.error("java.too-old", version.id() + " requires Java " + version.minimumJavaMajor() + "+.", "Switch Java runtime."));
        }
        if (runtime.major() > 25) {
            issues.add(ValidationIssue.warning("java.newer", "This runtime is newer than Lumen's validated matrix.", "Proceed only after compatibility checks pass."));
        }
        return issues;
    }

    private void addCurrentRuntime(Map<String, JavaRuntimeInfo> runtimes) {
        Path javaHome = Path.of(System.getProperty("java.home", ""));
        Path exe = javaHome.resolve("bin/java.exe");
        if (!Files.exists(exe)) {
            exe = javaHome.resolve("bin/java");
        }
        int major = Runtime.version().feature();
        runtimes.put("current", new JavaRuntimeInfo(
                "current",
                "Current JDK " + major,
                exe,
                System.getProperty("java.version", "unknown"),
                major,
                JavaRuntimeInfo.RuntimeSource.DETECTED,
                major >= 21,
                List.of("Runtime used to run Lumen.")));
    }

    private void addCandidate(Map<String, JavaRuntimeInfo> runtimes, String id, Path exe, int major, String name) {
        if (!Files.exists(exe)) {
            return;
        }
        runtimes.putIfAbsent(id, new JavaRuntimeInfo(id, name, exe, String.valueOf(major), major,
                JavaRuntimeInfo.RuntimeSource.DETECTED, major >= 21,
                List.of(major == 21 ? "Baseline runtime." : "Supported compatibility runtime.")));
    }
}
