/** @format */

import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import os from "node:os";
import { MIN_WINDOW_HEIGHT } from "./constants";
import { WINDOW_HEIGHT } from "./constants";
import { WINDOW_WIDTH } from "./constants";
import { MIN_WINDOW_WIDTH } from "./constants";
import { globalShortcutManager } from "./globalShortcuts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// support gRPC
process.env.GRPC_DNS_RESOLVER = "native";

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minWidth: MIN_WINDOW_WIDTH,
    minHeight: MIN_WINDOW_HEIGHT,
    // use system native title bar and controls
    titleBarStyle: "hidden",
    // make the window look like a native window on macOS, while keeping the system buttons and title
    trafficLightPosition: { x: 15, y: 10 },
    // transparent background
    backgroundColor: "#00000000",
    // window rounded corners
    roundedCorners: true,
    // Spotlight style window configuration
    frame: false, // no frame
    skipTaskbar: false, // show in taskbar
    center: true, // center window
    resizable: true, // allow resizing
    fullscreenable: false, // disable fullscreen
    show: false, // create window but don't show it, wait for shortcut to show
    hasShadow: true, // window has shadow
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // set the main window reference for the global shortcut manager
  globalShortcutManager.setMainWindow(win);

  // listen to window blur event, automatically hide window (Spotlight behavior)
  win.on("blur", () => {
    // when the window loses focus, automatically hide it
    if (win) {
      win.setAlwaysOnTop(false);
    }
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
    console.log("📝 Renderer process loaded");
  });

  // Open DevTools in development mode
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

/**
 * create a temporary file
 *
 * @param options temporary file options
 * @param options.prefix file name prefix
 * @param options.extension file extension (without dot)
 * @returns temporary file path
 */
ipcMain.handle(
  "create-temp-file",
  (_, options: { prefix?: string; extension?: string }) => {
    const tempDir = os.tmpdir();
    const prefix = options.prefix || "temp_";
    const extension = options.extension ? `.${options.extension}` : "";
    const tempFilePath = path.join(
      tempDir,
      `${prefix}${Date.now()}${extension}`,
    );

    // create an empty file
    fs.writeFileSync(tempFilePath, "");

    return tempFilePath;
  },
);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

// on macOS, support reopening the window by clicking the dock icon
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else if (win && !win.isVisible()) {
    // if the window exists but is not visible, show the window
    globalShortcutManager.showWindow();
  }
});

// register global shortcuts
app.whenReady().then(() => {
  createWindow();
  globalShortcutManager.registerAll();
});

// unregister all shortcuts before the application exits
app.on("will-quit", () => {
  globalShortcutManager.unregisterAll();
});

// add global error handling for uncaught exceptions in main process
process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught exception in main process:", error);
});
