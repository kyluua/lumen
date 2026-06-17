# Network Policy

Lumen should contact only documented endpoints needed for official launcher workflows:

- Mojang/Minecraft manifests, assets, and libraries
- Fabric metadata and Fabric API metadata
- Forge official metadata/installers
- NeoForge official metadata/installers
- Lumen signed update metadata
- User-selected Modrinth/CurseForge browsing only when implemented and explicitly requested

Every download should log URL, destination, checksum/signature when available, and result.
