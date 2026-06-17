# Development

## Requirements

- JDK 21+
- Gradle wrapper included

## Commands

```cmd
.\gradlew.bat run
.\gradlew.bat build
.\gradlew.bat installDist
.\gradlew.bat lumenAppImage
```

## Architecture

- `com.lumen.core`: Space-line-style launch system
- `com.lumen.ui`: JavaFX app shell
- `com.lumen.LumenLauncherApp`: entry point
