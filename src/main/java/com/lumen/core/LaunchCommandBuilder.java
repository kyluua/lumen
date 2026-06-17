package com.lumen.core;

import java.util.ArrayList;
import java.util.List;

public final class LaunchCommandBuilder {
    public List<String> build(LauncherProfile profile, VersionDescriptor version, JavaRuntimeInfo java) {
        List<String> command = new ArrayList<>();
        command.add(java.javaExecutable().toString());
        command.add("-Xmx" + profile.memoryMb() + "M");
        command.add("-Dlumen.launcher.brand=Lumen");
        command.add("-Dlumen.launcher.version=" + version.id());
        command.add("-cp");
        command.add("${resolved.classpath}");
        command.add("${minecraft.mainClass}");
        command.add("--version");
        command.add(version.id());
        command.add("--gameDir");
        command.add(profile.gameDirectory().toString());
        command.add("--width");
        command.add(String.valueOf(profile.width()));
        command.add("--height");
        command.add(String.valueOf(profile.height()));
        return command;
    }
}
