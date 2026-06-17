// ============================================================
// Lumen — Tauri Commands: bridge between frontend and Rust backend
// Handles Java detection, Minecraft manifests, downloads,
// launch orchestration, and skin fetching.
// ============================================================

use serde::{Deserialize, Serialize};
use std::process::Command;

// ----- Java Runtime Commands -----

#[derive(Debug, Serialize, Deserialize)]
pub struct JavaRuntimeInfo {
    pub id: String,
    pub path: String,
    pub version: String,
    pub vendor: String,
    pub major_version: i32,
    pub is_managed: bool,
    pub is_compatible: bool,
    pub compatibility_warnings: Vec<String>,
}

#[tauri::command]
pub fn detect_java_runtimes() -> Vec<JavaRuntimeInfo> {
    let mut runtimes = Vec::new();

    // Check JAVA_HOME
    if let Ok(java_home) = std::env::var("JAVA_HOME") {
        let java_path = if cfg!(windows) {
            format!("{}\\bin\\java.exe", java_home)
        } else {
            format!("{}/bin/java", java_home)
        };

        if let Some(info) = check_java_at_path(&java_path) {
            runtimes.push(info);
        }
    }

    // Check common installation paths
    let common_paths = if cfg!(windows) {
        vec![
            "C:\\Program Files\\Java",
            "C:\\Program Files\\Eclipse Adoptium",
            "C:\\Program Files\\Microsoft",
        ]
    } else if cfg!(target_os = "macos") {
        vec!["/Library/Java/JavaVirtualMachines", "/usr/lib/jvm"]
    } else {
        vec!["/usr/lib/jvm", "/usr/local/lib/jvm"]
    };

    for base_path in common_paths {
        if let Ok(entries) = std::fs::read_dir(base_path) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    let java_bin = if cfg!(windows) {
                        path.join("bin").join("java.exe")
                    } else {
                        path.join("bin").join("java")
                    };

                    if java_bin.exists() {
                        let path_str = java_bin.to_string_lossy().to_string();
                        if let Some(info) = check_java_at_path(&path_str) {
                            if !runtimes.iter().any(|r| r.path == info.path) {
                                runtimes.push(info);
                            }
                        }
                    }
                }
            }
        }
    }

    // Check PATH for java
    if let Ok(output) = Command::new(if cfg!(windows) { "where" } else { "which" })
        .arg("java")
        .output()
    {
        let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
        if !path.is_empty() {
            let first_path = path.lines().next().unwrap_or(&path);
            if let Some(info) = check_java_at_path(first_path) {
                if !runtimes.iter().any(|r| r.path == info.path) {
                    runtimes.push(info);
                }
            }
        }
    }

    runtimes
}

fn check_java_at_path(path: &str) -> Option<JavaRuntimeInfo> {
    let output = Command::new(path).arg("-version").output().ok()?;

    // Java outputs version to stderr
    let version_output = String::from_utf8_lossy(&output.stderr).to_string();
    if version_output.is_empty() {
        return None;
    }

    let (major, full_version, vendor) = parse_java_version_output(&version_output);

    let mut warnings = Vec::new();
    if major > 21 {
        warnings.push(format!("Java {} is newer than recommended JDK 21", major));
    }

    Some(JavaRuntimeInfo {
        id: format!("java_{}", major),
        path: path.to_string(),
        version: full_version,
        vendor,
        major_version: major,
        is_managed: false,
        is_compatible: major >= 21,
        compatibility_warnings: warnings,
    })
}

fn parse_java_version_output(output: &str) -> (i32, String, String) {
    let version_line = output.lines().next().unwrap_or("").trim();

    // Parse vendor
    let vendor = if version_line.contains("Oracle") {
        "Oracle Corporation".to_string()
    } else if version_line.contains("Eclipse") || version_line.contains("Temurin") {
        "Eclipse Adoptium".to_string()
    } else if version_line.contains("Azul") {
        "Azul Systems".to_string()
    } else if version_line.contains("Microsoft") {
        "Microsoft".to_string()
    } else if version_line.contains("GraalVM") {
        "GraalVM Community".to_string()
    } else {
        "Unknown Vendor".to_string()
    };

    // Parse version number
    // Format: "java version \"1.8.0_402\"" or "openjdk version \"21.0.1\" 2023-10-17"
    let version_start = version_line.find('"').unwrap_or(0) + 1;
    let version_end = version_line[version_start..].find('"').unwrap_or(version_line.len() - version_start);
    let version_str = &version_line[version_start..version_start + version_end.min(20)];

    let major = if version_str.starts_with("1.") {
        // Old style: 1.8.0_402
        version_str.split('.').nth(1).and_then(|s| s.parse().ok()).unwrap_or(0)
    } else {
        // New style: 21.0.1
        version_str.split('.').next().and_then(|s| s.parse().ok()).unwrap_or(0)
    };

    (major, version_str.to_string(), vendor)
}

#[tauri::command]
pub fn validate_java(java_path: String, minecraft_version: String) -> JavaRuntimeInfo {
    match check_java_at_path(&java_path) {
        Some(info) => info,
        None => JavaRuntimeInfo {
            id: String::new(),
            path: java_path,
            version: "Unknown".into(),
            vendor: "Unknown".into(),
            major_version: 0,
            is_managed: false,
            is_compatible: false,
            compatibility_warnings: vec!["Could not determine Java version".into()],
        },
    }
}

// ----- Minecraft Version Commands -----

#[derive(Debug, Serialize, Deserialize)]
pub struct MinecraftVersion {
    pub id: String,
    pub version_type: String,
    pub release_time: String,
}

#[tauri::command]
pub async fn fetch_minecraft_versions() -> Result<Vec<MinecraftVersion>, String> {
    let client = reqwest::Client::new();
    let manifest: serde_json::Value = client
        .get("https://launchermeta.mojang.com/mc/game/version_manifest.json")
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    let versions = manifest["versions"]
        .as_array()
        .ok_or("No versions found")?
        .iter()
        .map(|v| MinecraftVersion {
            id: v["id"].as_str().unwrap_or("").to_string(),
            version_type: v["type"].as_str().unwrap_or("").to_string(),
            release_time: v["releaseTime"].as_str().unwrap_or("").to_string(),
        })
        .collect();

    Ok(versions)
}

// ----- Loader Version Commands -----

#[derive(Debug, Serialize, Deserialize)]
pub struct LoaderVersion {
    pub version: String,
    pub stable: bool,
}

#[tauri::command]
pub async fn fetch_fabric_versions() -> Result<Vec<LoaderVersion>, String> {
    let client = reqwest::Client::new();
    let versions: Vec<serde_json::Value> = client
        .get("https://meta.fabricmc.net/v2/versions/loader")
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    Ok(versions
        .iter()
        .map(|v| LoaderVersion {
            version: v["version"].as_str().unwrap_or("").to_string(),
            stable: v["stable"].as_bool().unwrap_or(true),
        })
        .collect())
}

#[tauri::command]
pub async fn fetch_forge_versions(minecraft_version: String) -> Result<Vec<LoaderVersion>, String> {
    let client = reqwest::Client::new();
    let url = format!(
        "https://maven.minecraftforge.net/net/minecraftforge/forge/index_{}.json",
        minecraft_version
    );
    // Simplified — returns mock data for demonstration
    Ok(vec![
        LoaderVersion { version: format!("{}-recommended", minecraft_version), stable: true },
        LoaderVersion { version: format!("{}-latest", minecraft_version), stable: false },
    ])
}

#[tauri::command]
pub async fn fetch_neoforge_versions() -> Result<Vec<LoaderVersion>, String> {
    // Simplified — returns mock data for demonstration
    Ok(vec![
        LoaderVersion { version: "21.1.0".into(), stable: true },
        LoaderVersion { version: "21.0.0-beta".into(), stable: false },
    ])
}

// ----- Download Commands -----

#[tauri::command]
pub async fn download_asset(url: String, dest: String, sha1: Option<String>) -> Result<(), String> {
    let client = reqwest::Client::new();
    let response = client.get(&url).send().await.map_err(|e| e.to_string())?;

    let bytes = response.bytes().await.map_err(|e| e.to_string())?;

    // Validate checksum if provided
    if let Some(expected_sha1) = sha1 {
        let actual = sha1::Sha1::from(&bytes).hexdigest();
        if actual.to_lowercase() != expected_sha1.to_lowercase() {
            return Err(format!("Checksum mismatch for {}", url));
        }
    }

    // Create parent directories
    if let Some(parent) = std::path::Path::new(&dest).parent() {
        std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    std::fs::write(&dest, &bytes).map_err(|e| e.to_string())?;
    Ok(())
}

// ----- Launch Command -----

#[tauri::command]
pub async fn launch_profile(profile_json: String) -> Result<String, String> {
    let config: serde_json::Value =
        serde_json::from_str(&profile_json).map_err(|e| e.to_string())?;

    let java_path = config["javaPath"].as_str().unwrap_or("java");
    let main_class = config["mainClass"].as_str().unwrap_or("net.minecraft.client.main.Main");
    let jvm_args = config["jvmArgs"].as_array()
        .map(|a| a.iter().filter_map(|v| v.as_str().map(String::from)).collect::<Vec<_>>())
        .unwrap_or_default();
    let game_args = config["gameArgs"].as_array()
        .map(|a| a.iter().filter_map(|v| v.as_str().map(String::from)).collect::<Vec<_>>())
        .unwrap_or_default();

    // Build the command (synchronous for simplicity; real impl uses process spawn)
    let mut cmd = std::process::Command::new(java_path);
    cmd.args(&jvm_args);
    cmd.arg(main_class);
    cmd.args(&game_args);

    log::info!("Launching: {:?}", cmd);

    // In production, spawn the process and monitor it
    Ok("launch_initiated".to_string())
}

// ----- Skin Commands -----

#[derive(Debug, Serialize, Deserialize)]
pub struct SkinResponse {
    pub username: String,
    pub uuid: String,
    pub skin_url: Option<String>,
    pub cape_url: Option<String>,
    pub model: String,
}

#[tauri::command]
pub async fn get_skin_by_username(username: String) -> Result<SkinResponse, String> {
    let client = reqwest::Client::new();

    // Get UUID from username
    let profile: serde_json::Value = client
        .get(format!(
            "https://api.mojang.com/users/profiles/minecraft/{}",
            username
        ))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    let uuid = profile["id"].as_str().unwrap_or("").to_string();
    get_skin_internal(&client, &uuid, &username).await
}

#[tauri::command]
pub async fn get_skin_by_uuid(uuid: String) -> Result<SkinResponse, String> {
    let client = reqwest::Client::new();
    get_skin_internal(&client, &uuid, "Unknown").await
}

async fn get_skin_internal(
    client: &reqwest::Client,
    uuid: &str,
    username: &str,
) -> Result<SkinResponse, String> {
    let session: serde_json::Value = client
        .get(format!(
            "https://sessionserver.mojang.com/session/minecraft/profile/{}",
            uuid
        ))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    let actual_name = session["name"].as_str().unwrap_or(username).to_string();

    let properties = session["properties"].as_array();
    let textures_prop = properties.and_then(|props| {
        props.iter().find(|p| p["name"].as_str() == Some("textures"))
    });

    let mut skin_url = None;
    let mut cape_url = None;
    let mut model = "classic".to_string();

    if let Some(prop) = textures_prop {
        if let Some(value) = prop["value"].as_str() {
            let decoded = base64_decode(value);
            if let Ok(textures) = serde_json::from_str::<serde_json::Value>(&decoded) {
                skin_url = textures["textures"]["SKIN"]["url"].as_str().map(String::from);
                cape_url = textures["textures"]["CAPE"]["url"].as_str().map(String::from);
                if let Some(metadata) = textures["textures"]["SKIN"]["metadata"].as_object() {
                    if metadata.get("model").and_then(|m| m.as_str()) == Some("slim") {
                        model = "slim".to_string();
                    }
                }
            }
        }
    }

    Ok(SkinResponse {
        username: actual_name,
        uuid: uuid.to_string(),
        skin_url,
        cape_url,
        model,
    })
}

fn base64_decode(s: &str) -> String {
    use base64::Engine;
    base64::engine::general_purpose::STANDARD
        .decode(s)
        .map(|bytes| String::from_utf8_lossy(&bytes).to_string())
        .unwrap_or_default()
}

#[tauri::command]
pub async fn export_skin(skin_url: String) -> Result<Vec<u8>, String> {
    let client = reqwest::Client::new();
    let response = client
        .get(&skin_url)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let bytes = response.bytes().await.map_err(|e| e.to_string())?;
    Ok(bytes.to_vec())
}

// ----- Hardware Info Command -----

#[derive(Debug, Serialize, Deserialize)]
pub struct HardwareInfo {
    pub os_name: String,
    pub os_version: String,
    pub cpu_cores: u32,
    pub cpu_model: String,
    pub total_ram_mb: u64,
}

#[tauri::command]
pub fn collect_hardware_info() -> HardwareInfo {
    let os_name = std::env::consts::OS.to_string();
    let os_version = if cfg!(windows) {
        "Windows 10/11".to_string()
    } else if cfg!(target_os = "macos") {
        "macOS".to_string()
    } else {
        "Linux".to_string()
    };

    let cpu_cores = num_cpus::get() as u32;
    let cpu_model = "Unknown CPU".to_string();

    // Get total RAM (platform-specific via sysinfo or similar)
    let total_ram_mb = 8192u64; // Placeholder

    HardwareInfo {
        os_name,
        os_version,
        cpu_cores,
        cpu_model,
        total_ram_mb,
    }
}

#[tauri::command]
pub fn get_system_java_home() -> String {
    std::env::var("JAVA_HOME").unwrap_or_default()
}
