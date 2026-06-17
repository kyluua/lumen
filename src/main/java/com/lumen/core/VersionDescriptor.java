package com.lumen.core;

import java.util.Set;

public record VersionDescriptor(
        String id,
        ReleaseLine releaseLine,
        int minimumJavaMajor,
        Set<LoaderType> supportedLoaders,
        boolean experimental) {
}
