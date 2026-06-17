package com.lumen.core;

import java.nio.file.Path;
import java.time.Instant;
import java.util.UUID;

public final class LauncherProfile {
    private final String id;
    private String name;
    private String minecraftVersion;
    private ReleaseLine releaseLine;
    private LoaderType loader;
    private String javaRuntimeId;
    private int memoryMb;
    private int width;
    private int height;
    private Path gameDirectory;
    private final Instant createdAt;
    private Instant updatedAt;

    public LauncherProfile(String name, String minecraftVersion, ReleaseLine releaseLine, LoaderType loader,
                           String javaRuntimeId, int memoryMb, int width, int height, Path gameDirectory) {
        this(UUID.randomUUID().toString(), name, minecraftVersion, releaseLine, loader, javaRuntimeId,
                memoryMb, width, height, gameDirectory, Instant.now(), Instant.now());
    }

    private LauncherProfile(String id, String name, String minecraftVersion, ReleaseLine releaseLine, LoaderType loader,
                            String javaRuntimeId, int memoryMb, int width, int height, Path gameDirectory,
                            Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.minecraftVersion = minecraftVersion;
        this.releaseLine = releaseLine;
        this.loader = loader;
        this.javaRuntimeId = javaRuntimeId;
        this.memoryMb = memoryMb;
        this.width = width;
        this.height = height;
        this.gameDirectory = gameDirectory;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static LauncherProfile restore(String id, String name, String minecraftVersion, ReleaseLine releaseLine,
                                          LoaderType loader, String javaRuntimeId, int memoryMb, int width, int height,
                                          Path gameDirectory, Instant createdAt, Instant updatedAt) {
        return new LauncherProfile(id, name, minecraftVersion, releaseLine, loader, javaRuntimeId,
                memoryMb, width, height, gameDirectory, createdAt, updatedAt);
    }

    public String id() { return id; }
    public String name() { return name; }
    public String minecraftVersion() { return minecraftVersion; }
    public ReleaseLine releaseLine() { return releaseLine; }
    public LoaderType loader() { return loader; }
    public String javaRuntimeId() { return javaRuntimeId; }
    public int memoryMb() { return memoryMb; }
    public int width() { return width; }
    public int height() { return height; }
    public Path gameDirectory() { return gameDirectory; }
    public Instant createdAt() { return createdAt; }
    public Instant updatedAt() { return updatedAt; }

    public void touch() { updatedAt = Instant.now(); }

    @Override
    public String toString() {
        return name + "  " + minecraftVersion + "  " + loader.displayName();
    }
}