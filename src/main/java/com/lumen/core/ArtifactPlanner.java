package com.lumen.core;

import java.util.ArrayList;
import java.util.List;

public final class ArtifactPlanner {
    public List<ArtifactPlan> plan(LauncherProfile profile, VersionDescriptor version) {
        List<ArtifactPlan> artifacts = new ArrayList<>();
        artifacts.add(new ArtifactPlan("version-manifest", "Minecraft version manifest",
                "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json",
                "versions/" + version.id() + "/manifest.json", true, "published-sha1", ""));
        artifacts.add(new ArtifactPlan("assets", "Minecraft assets and libraries",
                "https://resources.download.minecraft.net/",
                "assets/" + version.id(), true, "published-sha1", ""));
        if (profile.loader() != LoaderType.VANILLA) {
            artifacts.add(new ArtifactPlan(profile.loader().name().toLowerCase() + "-loader",
                    profile.loader().displayName() + " loader metadata/installer",
                    profile.loader().officialSource(),
                    "loaders/" + profile.loader().name().toLowerCase() + "/" + version.id(), true,
                    "provider-checksum-if-available", "provider-signature-if-available"));
        }
        if (profile.loader() == LoaderType.FABRIC) {
            artifacts.add(new ArtifactPlan("fabric-api", "Fabric API when profile content requires it",
                    "https://api.modrinth.com/v2/project/fabric-api",
                    "loaders/fabric-api/" + version.id(), false, "modrinth-sha1", ""));
        }
        return artifacts;
    }
}
