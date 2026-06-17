package com.lumen.core;

public record ArtifactPlan(
        String id,
        String label,
        String source,
        String destination,
        boolean required,
        String checksum,
        String signature) {
}
