package com.lumen.core;

import java.nio.file.Path;
import java.util.List;

public record JavaRuntimeInfo(
        String id,
        String name,
        Path javaExecutable,
        String version,
        int major,
        RuntimeSource source,
        boolean supported,
        List<String> notes) {

    public enum RuntimeSource {
        DETECTED, BUNDLED, MANUAL
    }
}
