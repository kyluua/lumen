package com.lumen.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public final class ProfileStore {
    private final AppPaths paths;
    private final ObjectMapper mapper;

    public ProfileStore(AppPaths paths) {
        this.paths = paths;
        this.mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
    }

    public List<LauncherProfile> loadOrSeed(List<LauncherProfile> seedProfiles) {
        try {
            paths.ensure();
            if (Files.notExists(paths.profilesFile())) {
                save(seedProfiles);
                return seedProfiles;
            }
            ProfileDocument document = mapper.readValue(paths.profilesFile().toFile(), ProfileDocument.class);
            if (document == null || document.profiles == null || document.profiles.isEmpty()) {
                return seedProfiles;
            }
            List<LauncherProfile> restored = new ArrayList<>();
            for (ProfileEntry entry : document.profiles) {
                restored.add(entry.toProfile());
            }
            return restored;
        } catch (Exception error) {
            return seedProfiles;
        }
    }

    public void save(List<LauncherProfile> profiles) throws IOException {
        paths.ensure();
        ProfileDocument document = new ProfileDocument();
        document.schemaVersion = 1;
        document.profiles = profiles.stream().map(ProfileEntry::from).toList();
        mapper.writeValue(paths.profilesFile().toFile(), document);
    }

    public Path profilesFile() {
        return paths.profilesFile();
    }

    public static final class ProfileDocument {
        public int schemaVersion;
        public List<ProfileEntry> profiles = List.of();
    }

    public static final class ProfileEntry {
        public String id;
        public String name;
        public String minecraftVersion;
        public String releaseLine;
        public String loader;
        public String javaRuntimeId;
        public int memoryMb;
        public int width;
        public int height;
        public String gameDirectory;
        public String createdAt;
        public String updatedAt;

        static ProfileEntry from(LauncherProfile profile) {
            ProfileEntry entry = new ProfileEntry();
            entry.id = profile.id();
            entry.name = profile.name();
            entry.minecraftVersion = profile.minecraftVersion();
            entry.releaseLine = profile.releaseLine().name();
            entry.loader = profile.loader().name();
            entry.javaRuntimeId = profile.javaRuntimeId();
            entry.memoryMb = profile.memoryMb();
            entry.width = profile.width();
            entry.height = profile.height();
            entry.gameDirectory = profile.gameDirectory().toString();
            entry.createdAt = profile.createdAt().toString();
            entry.updatedAt = profile.updatedAt().toString();
            return entry;
        }

        LauncherProfile toProfile() {
            return LauncherProfile.restore(id, name, minecraftVersion, ReleaseLine.valueOf(releaseLine),
                    LoaderType.valueOf(loader), javaRuntimeId, memoryMb, width, height,
                    Path.of(gameDirectory), Instant.parse(createdAt), Instant.parse(updatedAt));
        }
    }
}