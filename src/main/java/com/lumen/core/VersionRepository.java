package com.lumen.core;

import java.util.List;
import java.util.Set;

public final class VersionRepository {
    private static final Set<LoaderType> ALL_LOADERS = Set.of(LoaderType.VANILLA, LoaderType.FABRIC, LoaderType.FORGE, LoaderType.NEOFORGE);

    private final List<VersionDescriptor> supported = List.of(
            new VersionDescriptor("1.21.4", ReleaseLine.STABLE, 21, ALL_LOADERS, false),
            new VersionDescriptor("1.21.5", ReleaseLine.STABLE, 21, ALL_LOADERS, false),
            new VersionDescriptor("26.1.x", ReleaseLine.LUMEN_26_1, 25, ALL_LOADERS, false),
            new VersionDescriptor("26.2.x", ReleaseLine.LUMEN_26_2, 25, ALL_LOADERS, true)
    );

    public List<VersionDescriptor> supportedVersions() {
        return supported;
    }

    public VersionDescriptor resolve(String id) {
        return supported.stream()
                .filter(version -> version.id().equals(id))
                .findFirst()
                .orElseGet(() -> resolveLine(id));
    }

    private VersionDescriptor resolveLine(String id) {
        if (id.startsWith("26.1.")) {
            return new VersionDescriptor(id, ReleaseLine.LUMEN_26_1, 25, ALL_LOADERS, false);
        }
        if (id.startsWith("26.2.")) {
            return new VersionDescriptor(id, ReleaseLine.LUMEN_26_2, 25, ALL_LOADERS, true);
        }
        if (id.startsWith("1.21.")) {
            return new VersionDescriptor(id, ReleaseLine.STABLE, 21, ALL_LOADERS, false);
        }
        throw new IllegalArgumentException("Unsupported version: " + id);
    }
}
