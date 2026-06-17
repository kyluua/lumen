package com.lumen.core;

public enum LoaderType {
    VANILLA("Vanilla", "Mojang version manifest", false),
    FABRIC("Fabric", "Official Fabric metadata and Fabric API paths", true),
    FORGE("Forge", "Official Forge installer metadata", true),
    NEOFORGE("NeoForge", "Official NeoForge installer metadata", true);

    private final String displayName;
    private final String officialSource;
    private final boolean installerBased;

    LoaderType(String displayName, String officialSource, boolean installerBased) {
        this.displayName = displayName;
        this.officialSource = officialSource;
        this.installerBased = installerBased;
    }

    public String displayName() {
        return displayName;
    }

    public String officialSource() {
        return officialSource;
    }

    public boolean installerBased() {
        return installerBased;
    }
}
