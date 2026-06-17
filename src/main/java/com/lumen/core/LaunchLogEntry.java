package com.lumen.core;

import java.time.Instant;

public record LaunchLogEntry(Instant at, LaunchStage stage, Severity severity, String message) {
    @Override
    public String toString() {
        return at + " [" + severity + "] " + stage + " - " + message;
    }
}
