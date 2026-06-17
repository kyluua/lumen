package com.lumen.core;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public final class BackupService {
    private static final DateTimeFormatter STAMP = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");
    private final AppPaths paths;

    public BackupService(AppPaths paths) {
        this.paths = paths;
    }

    public Path createConfigBackup() throws IOException {
        paths.ensure();
        Path backup = paths.backupsDir().resolve("lumen-config-" + LocalDateTime.now().format(STAMP) + ".zip");
        try (OutputStream output = Files.newOutputStream(backup); ZipOutputStream zip = new ZipOutputStream(output)) {
            addIfExists(zip, paths.profilesFile(), "config/profiles.json");
        }
        return backup;
    }

    private void addIfExists(ZipOutputStream zip, Path file, String name) throws IOException {
        if (Files.notExists(file)) {
            return;
        }
        zip.putNextEntry(new ZipEntry(name));
        Files.copy(file, zip);
        zip.closeEntry();
    }
}