// ============================================================
// Lumen — Tauri Desktop Application: Main entry point
// ============================================================

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_log::{Target, TargetKind};

mod commands;
mod java;
mod profile;
mod download;
mod skin;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: Some("lumen".into()) }),
                    Target::new(TargetKind::Webview),
                ])
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            commands::detect_java_runtimes,
            commands::validate_java,
            commands::fetch_minecraft_versions,
            commands::fetch_fabric_versions,
            commands::fetch_forge_versions,
            commands::fetch_neoforge_versions,
            commands::download_asset,
            commands::launch_profile,
            commands::get_skin_by_username,
            commands::get_skin_by_uuid,
            commands::export_skin,
            commands::collect_hardware_info,
            commands::get_system_java_home,
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_title("Lumen Launcher")?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Lumen");
}
