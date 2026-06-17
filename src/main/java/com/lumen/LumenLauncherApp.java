package com.lumen;

import com.lumen.core.AppPaths;
import com.lumen.core.ArtifactPlan;
import com.lumen.core.BackupService;
import com.lumen.core.CrashReportService;
import com.lumen.core.JavaRuntimeInfo;
import com.lumen.core.JavaRuntimeService;
import com.lumen.core.LaunchLogEntry;
import com.lumen.core.LaunchPlan;
import com.lumen.core.LaunchService;
import com.lumen.core.LauncherProfile;
import com.lumen.core.LoaderType;
import com.lumen.core.ProfileManager;
import com.lumen.core.ValidationIssue;
import javafx.application.Application;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.stage.Stage;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public final class LumenLauncherApp extends Application {
    private final AppPaths appPaths = AppPaths.defaults();
    private final ProfileManager profileManager = new ProfileManager(appPaths);
    private final BackupService backupService = new BackupService(appPaths);
    private final CrashReportService reportService = new CrashReportService(appPaths);
    private final JavaRuntimeService javaRuntimeService = new JavaRuntimeService();
    private final LaunchService launchService = new LaunchService();
    private final List<JavaRuntimeInfo> runtimes = new ArrayList<>();
    private final List<LaunchLogEntry> logs = new ArrayList<>();
    private Label storageLabel;

    private ListView<LauncherProfile> profileList;
    private TextArea launchPlanText;
    private TextArea logText;
    private Label statusLabel;

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage stage) {
        runtimes.addAll(javaRuntimeService.detect());
        BorderPane root = new BorderPane();
        root.getStyleClass().add("app-root");
        root.setTop(header());
        root.setCenter(tabs());
        root.setBottom(statusBar());

        Scene scene = new Scene(root, 1180, 760);
        scene.getStylesheets().add(LumenLauncherApp.class.getResource("/com/lumen/lumen.css").toExternalForm());
        stage.setTitle("Lumen Launcher");
        stage.setMinWidth(960);
        stage.setMinHeight(620);
        stage.setScene(scene);
        stage.show();
        refreshPlan();
    }

    private HBox header() {
        Label mark = new Label("L");
        mark.getStyleClass().add("brand-mark");
        Label title = new Label("Lumen");
        title.setFont(Font.font(28));
        Label subtitle = new Label("Safe Minecraft launcher - JavaFX - Gradle - Space-line style launch pipeline");
        subtitle.getStyleClass().add("muted");
        VBox copy = new VBox(2, title, subtitle);
        HBox header = new HBox(14, mark, copy);
        header.setAlignment(Pos.CENTER_LEFT);
        header.setPadding(new Insets(18, 22, 14, 22));
        header.getStyleClass().add("header");
        return header;
    }

    private TabPane tabs() {
        TabPane tabs = new TabPane();
        tabs.getTabs().add(tab("Dashboard", dashboard()));
        tabs.getTabs().add(tab("Profiles", profilesPane()));
        tabs.getTabs().add(tab("Loaders", loadersPane()));
        tabs.getTabs().add(tab("Java", javaPane()));
        tabs.getTabs().add(tab("Logs", logsPane()));
        tabs.getTabs().add(tab("Settings", settingsPane()));
        tabs.getTabs().add(tab("Safety", safetyPane()));
        return tabs;
    }

    private Tab tab(String title, javafx.scene.Node content) {
        Tab tab = new Tab(title, content);
        tab.setClosable(false);
        return tab;
    }

    private VBox dashboard() {
        launchPlanText = new TextArea();
        launchPlanText.setEditable(false);
        launchPlanText.getStyleClass().add("terminal");

        Button validate = new Button("Launch Check");
        validate.getStyleClass().add("primary");
        validate.setOnAction(event -> runLaunchCheck());

        Button createFabric = new Button("New Fabric 26.1");
        createFabric.setOnAction(event -> createProfile(LoaderType.FABRIC, "26.1.2"));

        VBox hero = card("Ready launch plan",
                new Label("Validate Java, loader metadata, artifacts, and launch command before starting Minecraft."),
                new HBox(10, validate, createFabric), launchPlanText);
        return page(hero);
    }

    private VBox profilesPane() {
        profileList = new ListView<>(FXCollections.observableArrayList(profileManager.list()));
        profileList.getSelectionModel().selectFirst();
        profileList.getSelectionModel().selectedItemProperty().addListener((obs, oldValue, newValue) -> refreshPlan());

        ComboBox<LoaderType> loader = new ComboBox<>(FXCollections.observableArrayList(LoaderType.values()));
        loader.getSelectionModel().select(LoaderType.VANILLA);
        TextField name = new TextField("New Profile");
        TextField version = new TextField("1.21.4");
        Button add = new Button("Create Profile");
        add.getStyleClass().add("primary");
        add.setOnAction(event -> {
            LauncherProfile profile = profileManager.create(name.getText(), version.getText(), loader.getValue());
            profileList.getItems().setAll(profileManager.list());
            profileList.getSelectionModel().select(profile);
            refreshPlan();
        });

        GridPane form = new GridPane();
        form.setHgap(10);
        form.setVgap(10);
        form.addRow(0, new Label("Name"), name);
        form.addRow(1, new Label("Version"), version);
        form.addRow(2, new Label("Loader"), loader);
        form.add(add, 1, 3);

        HBox content = new HBox(16, profileList, card("Create profile", form));
        HBox.setHgrow(profileList, Priority.ALWAYS);
        return page(content);
    }

    private VBox loadersPane() {
        HBox cards = new HBox(14);
        for (LoaderType loader : LoaderType.values()) {
            cards.getChildren().add(card(loader.displayName(),
                    new Label(loader.officialSource()),
                    new Label(loader.installerBased() ? "Official installer/API metadata planned." : "Uses Mojang manifests directly.")));
        }
        return page(cards);
    }

    private VBox javaPane() {
        TableView<JavaRuntimeInfo> table = new TableView<>(FXCollections.observableArrayList(runtimes));
        TableColumn<JavaRuntimeInfo, String> name = new TableColumn<>("Runtime");
        name.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().name()));
        TableColumn<JavaRuntimeInfo, String> version = new TableColumn<>("Version");
        version.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().version()));
        TableColumn<JavaRuntimeInfo, String> path = new TableColumn<>("Path");
        path.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().javaExecutable().toString()));
        table.getColumns().add(name);
        table.getColumns().add(version);
        table.getColumns().add(path);
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY_FLEX_LAST_COLUMN);
        return page(card("Detected Java runtimes", table));
    }

    private VBox logsPane() {
        logText = new TextArea();
        logText.setEditable(false);
        logText.getStyleClass().add("terminal");
        refreshLogs();
        return page(card("Transparent logs", logText));
    }

    private VBox settingsPane() {
        ComboBox<String> theme = new ComboBox<>(FXCollections.observableArrayList("Galaxy", "Lumen", "Midnight", "High Contrast"));
        theme.getSelectionModel().selectFirst();
        ComboBox<String> density = new ComboBox<>(FXCollections.observableArrayList("Comfortable", "Compact"));
        density.getSelectionModel().selectFirst();
        storageLabel = new Label("Storage: " + appPaths.root());
        storageLabel.getStyleClass().add("muted");
        Button backup = new Button("Backup Now");
        backup.setOnAction(event -> createBackup());
        return page(card("Customization", new Label("Theme"), theme, new Label("Density"), density,
                storageLabel, backup,
                new Label("Profiles are saved as schema-versioned JSON with backup and migration hooks.")));
    }

    private VBox safetyPane() {
        return page(card("Safety policy",
                new Label("Lumen is launcher/client-management only."),
                new Label("No cheats, hacks, bypasses, unfair automation, piracy, cracked accounts, token scraping, or hidden network behavior."),
                new Label("Extensions are limited to themes, launch hooks, and UI widgets.")));
    }

    private VBox page(javafx.scene.Node content) {
        VBox box = new VBox(content);
        box.setPadding(new Insets(18));
        VBox.setVgrow(content, Priority.ALWAYS);
        return box;
    }

    private VBox card(String title, javafx.scene.Node... nodes) {
        Label heading = new Label(title);
        heading.getStyleClass().add("card-title");
        VBox box = new VBox(12);
        box.getStyleClass().add("card");
        box.getChildren().add(heading);
        box.getChildren().addAll(nodes);
        return box;
    }

    private void createProfile(LoaderType loader, String version) {
        LauncherProfile profile = profileManager.create(loader.displayName() + " " + version, version, loader);
        if (profileList != null) {
            profileList.getItems().setAll(profileManager.list());
            profileList.getSelectionModel().select(profile);
        }
        refreshPlan();
    }

    private LauncherProfile selectedProfile() {
        if (profileList != null && profileList.getSelectionModel().getSelectedItem() != null) {
            return profileList.getSelectionModel().getSelectedItem();
        }
        return profileManager.list().isEmpty() ? null : profileManager.list().get(0);
    }

    private void refreshPlan() {
        LauncherProfile profile = selectedProfile();
        if (profile == null || launchPlanText == null) {
            return;
        }
        LaunchPlan plan = launchService.buildPlan(profile, runtimes);
        launchPlanText.setText(formatPlan(plan));
        if (statusLabel != null) {
            statusLabel.setText(plan.hasBlockingIssues() ? "Validation has blocking issues" : "Ready for launch check");
        }
    }

    private void runLaunchCheck() {
        LauncherProfile profile = selectedProfile();
        if (profile == null) {
            return;
        }
        LaunchPlan plan = launchService.buildPlan(profile, runtimes);
        logs.addAll(0, launchService.simulate(plan));
        writeReportIfNeeded(plan);
        refreshPlan();
        refreshLogs();
    }

    private String formatPlan(LaunchPlan plan) {
        StringBuilder out = new StringBuilder();
        out.append("Profile: ").append(plan.profile().name()).append('\n');
        out.append("Version: ").append(plan.version().id()).append("  line=").append(plan.version().releaseLine().label()).append('\n');
        out.append("Loader: ").append(plan.profile().loader().displayName()).append('\n');
        out.append("Java: ").append(plan.javaRuntime() == null ? "missing" : plan.javaRuntime().name()).append('\n');
        out.append("\nArtifacts:\n");
        for (ArtifactPlan artifact : plan.artifacts()) {
            out.append(" - ").append(artifact.label()).append(" [").append(artifact.required() ? "required" : "optional").append("]\n");
        }
        out.append("\nIssues:\n");
        if (plan.issues().isEmpty()) {
            out.append(" - none\n");
        } else {
            for (ValidationIssue issue : plan.issues()) {
                out.append(" - ").append(issue.severity()).append(" ").append(issue.code()).append(": ").append(issue.message()).append('\n');
            }
        }
        out.append("\nCommand preview:\n");
        out.append(String.join(" ", plan.command()));
        return out.toString();
    }

    private void createBackup() {
        try {
            profileManager.save();
            Path backup = backupService.createConfigBackup();
            if (storageLabel != null) {
                storageLabel.setText("Backup created: " + backup);
            }
            statusLabel.setText("Backup created");
        } catch (IOException error) {
            if (storageLabel != null) {
                storageLabel.setText("Backup failed: " + error.getMessage());
            }
            statusLabel.setText("Backup failed");
        }
    }

    private void writeReportIfNeeded(LaunchPlan plan) {
        if (!plan.hasBlockingIssues()) {
            return;
        }
        try {
            Path report = reportService.writeValidationReport(plan);
            if (statusLabel != null) {
                statusLabel.setText("Validation report written: " + report.getFileName());
            }
        } catch (IOException error) {
            if (statusLabel != null) {
                statusLabel.setText("Validation report failed: " + error.getMessage());
            }
        }
    }
    private void refreshLogs() {
        if (logText == null) {
            return;
        }
        StringBuilder out = new StringBuilder();
        for (LaunchLogEntry log : logs) {
            out.append(log).append('\n');
        }
        logText.setText(out.toString());
    }

    private StackPane statusBar() {
        statusLabel = new Label("Lumen ready");
        StackPane bar = new StackPane(statusLabel);
        bar.setAlignment(Pos.CENTER_LEFT);
        bar.setPadding(new Insets(8, 18, 10, 18));
        bar.getStyleClass().add("status-bar");
        return bar;
    }
}

