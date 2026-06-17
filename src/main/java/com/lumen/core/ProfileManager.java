package com.lumen.core;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public final class ProfileManager {
    private final List<LauncherProfile> profiles = new ArrayList<>();
    private final ProfileStore store;

    public ProfileManager() {
        this(AppPaths.defaults());
    }

    public ProfileManager(AppPaths paths) {
        this.store = new ProfileStore(paths);
        profiles.addAll(store.loadOrSeed(defaultProfiles()));
    }

    public List<LauncherProfile> list() {
        return profiles;
    }

    public LauncherProfile create(String name, String version, LoaderType loader) {
        ReleaseLine line = version.startsWith("26.1") ? ReleaseLine.LUMEN_26_1
                : version.startsWith("26.2") ? ReleaseLine.LUMEN_26_2 : ReleaseLine.STABLE;
        LauncherProfile profile = new LauncherProfile(name, version, line, loader, "current",
                loader == LoaderType.VANILLA ? 4096 : 6144, 1280, 720,
                Path.of("profiles/" + name.toLowerCase().replaceAll("[^a-z0-9]+", "-")));
        profiles.add(0, profile);
        saveQuietly();
        return profile;
    }

    public void save() throws IOException {
        store.save(profiles);
    }

    public Path profilesFile() {
        return store.profilesFile();
    }

    private void saveQuietly() {
        try {
            save();
        } catch (IOException ignored) {
            // The UI surfaces storage paths and build logs; failed saves should not crash profile creation.
        }
    }

    private List<LauncherProfile> defaultProfiles() {
        return List.of(
                new LauncherProfile("Vanilla 1.21", "1.21.4", ReleaseLine.STABLE, LoaderType.VANILLA,
                        "current", 4096, 1280, 720, Path.of("profiles/vanilla-121")),
                new LauncherProfile("Fabric 26.1", "26.1.2", ReleaseLine.LUMEN_26_1, LoaderType.FABRIC,
                        "current", 6144, 1280, 720, Path.of("profiles/fabric-261")),
                new LauncherProfile("NeoForge 26.2 Lab", "26.2.x", ReleaseLine.LUMEN_26_2, LoaderType.NEOFORGE,
                        "current", 6144, 1280, 720, Path.of("profiles/neoforge-262"))
        );
    }
}