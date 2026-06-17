package com.lumen.core;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public record AppPaths(Path root, Path configDir, Path profilesFile, Path logsDir, Path reportsDir, Path backupsDir) {
    public static AppPaths defaults() {
        String appData = System.getenv("APPDATA");
        Path root = appData == null || appData.isBlank()
                ? Path.of(System.getProperty("user.home"), ".lumen")
                : Path.of(appData, "Lumen");
        return new AppPaths(root, root.resolve("config"), root.resolve("config").resolve("profiles.json"),
                root.resolve("logs"), root.resolve("reports"), root.resolve("backups"));
    }

    public void ensure() throws IOException {
        Files.createDirectories(configDir);
        Files.createDirectories(logsDir);
        Files.createDirectories(reportsDir);
        Files.createDirectories(backupsDir);
    }
}